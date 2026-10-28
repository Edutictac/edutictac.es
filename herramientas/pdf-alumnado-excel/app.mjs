// Extracción de nombres adaptada de EduAvisos (MIT):
// https://github.com/Edutictac/EduAvisos/blob/main/js/app.js
const $ = (id) => document.getElementById(id);
const lang = typeof document !== "undefined" && document.documentElement.lang === "ca" ? "ca" : "es";
const messages = {
  es: {
    noPdf: "Selecciona un PDF para empezar.", reading: "Leyendo el PDF…",
    noText: "El PDF no contiene texto seleccionable. Si es una imagen escaneada, necesitarás OCR antes de usar esta herramienta.",
    noNames: "No se han detectado nombres. Puedes pegarlos o corregirlos en la lista.",
    found: (n) => `${n} nombres detectados. Revísalos antes de copiarlos.`,
    invalid: "Hay líneas que no parecen nombres. Revísalas antes de copiar o descargar.",
    copied: (n) => `${n} nombres copiados. Pégalos en una columna de Excel.`,
    downloaded: (n) => `CSV descargado con ${n} nombres.`,
    cleared: "Lista borrada de esta página.",
    error: "No se pudo leer el PDF. Comprueba que no está protegido y vuelve a intentarlo.",
  },
  ca: {
    noPdf: "Selecciona un PDF per a començar.", reading: "Llegint el PDF…",
    noText: "El PDF no conté text seleccionable. Si és una imatge escanejada, necessitaràs OCR abans d'usar esta eina.",
    noNames: "No s'han detectat noms. Pots apegar-los o corregir-los en la llista.",
    found: (n) => `${n} noms detectats. Revisa'ls abans de copiar-los.`,
    invalid: "Hi ha línies que no semblen noms. Revisa-les abans de copiar o descarregar.",
    copied: (n) => `${n} noms copiats. Apega'ls en una columna d'Excel.`,
    downloaded: (n) => `CSV descarregat amb ${n} noms.`,
    cleared: "Llista esborrada d'esta pàgina.",
    error: "No s'ha pogut llegir el PDF. Comprova que no està protegit i torna-ho a intentar.",
  },
}[lang];

const blocked = /\b(?:alumn(?:o|a|os|as|at)|apellidos?|nombre|noms?|cognoms?|curso|curs|grupo|grup|centro|centre|listado|llistat|informe|fecha|data|página|pàgina|verreport)\b/i;
const word = /^(?:\p{Lu}[\p{L}'’.-]*|de|del|la|las|los|y|i|da|das|do|dos)$/u;

function cleanLine(raw) {
  return String(raw).replace(/[\u200B-\u200D\uFEFF]/g, "")
    .replace(/^\s*\d{1,4}\s*[.)-]?\s+/, "")
    .replace(/[•·\t]+/g, " ").replace(/\s+/g, " ").trim();
}

function plausibleName(value) {
  if (!value || value.length > 90 || blocked.test(value)) return false;
  const words = value.split(/\s+/);
  return words.length >= 2 && words.length <= 7 &&
    words.filter((w) => /^\p{Lu}/u.test(w)).length >= 2 && words.every((w) => word.test(w));
}

export function parseNamesFromPdfText(text) {
  const names = [];
  const seen = new Set();
  for (const raw of String(text).split(/\r?\n/)) {
    const line = cleanLine(raw);
    if (!line) continue;
    let name = line;
    const comma = line.match(/^([^,;]+),\s*([^,;]+)$/);
    if (comma && plausibleName(`${comma[2]} ${comma[1]}`)) {
      name = `${comma[2]} ${comma[1]}`;
    }
    name = name.replace(/\s+/g, " ").trim();
    if (!plausibleName(name)) continue;
    const key = name.toLocaleLowerCase("es");
    if (!seen.has(key)) { seen.add(key); names.push(name); }
  }
  return names;
}

function editableNames() {
  const names = $("names").value.split(/\r?\n/).map((s) => s.trim()).filter(Boolean);
  if (!names.length) { setStatus(messages.noNames, true); return null; }
  if (names.some((n) => !/^\p{L}/u.test(n) || /[\t;]/.test(n))) {
    setStatus(messages.invalid, true); return null;
  }
  return names;
}

function setStatus(message, error = false) {
  $("status").textContent = message;
  $("status").classList.toggle("error", error);
}

async function extractPdf(file) {
  if (!window.pdfjsLib) throw new Error("pdf.js missing");
  window.pdfjsLib.GlobalWorkerOptions.workerSrc = new URL("./vendor/pdf.worker.min.js", import.meta.url).href;
  const bytes = new Uint8Array(await file.arrayBuffer());
  const task = window.pdfjsLib.getDocument({ data: bytes });
  const pdf = await task.promise;
  const lines = [];
  for (let pageNumber = 1; pageNumber <= pdf.numPages; pageNumber++) {
    const page = await pdf.getPage(pageNumber);
    const content = await page.getTextContent();
    // EduAvisos identifica nombres en los fragmentos; las filas agrupadas ayudan
    // cuando el apellido y el nombre son fragmentos distintos del mismo renglón.
    const rows = new Map();
    for (const item of content.items) {
      if (typeof item.str !== "string" || !item.str.trim()) continue;
      lines.push(item.str);
      const y = Math.round(item.transform?.[5] ?? 0);
      const row = rows.get(y) ?? [];
      row.push({ x: item.transform?.[4] ?? 0, value: item.str });
      rows.set(y, row);
    }
    for (const row of rows.values()) {
      row.sort((a, b) => a.x - b.x);
      lines.push(row.map((part) => part.value).join(" "));
    }
  }
  return lines.join("\n");
}

function start() {
  $("pdfFile").addEventListener("change", async () => {
    const file = $("pdfFile").files?.[0];
    if (!file) { setStatus(messages.noPdf); return; }
    if (file.type !== "application/pdf" && !/\.pdf$/i.test(file.name)) {
      setStatus(messages.error, true); return;
    }
    setStatus(messages.reading);
    $("loadBtn").disabled = true;
    try {
      const text = await extractPdf(file);
      const names = parseNamesFromPdfText(text);
      $("names").value = names.join("\n");
      setStatus(!text.trim() ? messages.noText : names.length ? messages.found(names.length) : messages.noNames, !text.trim());
    } catch (error) {
      setStatus(messages.error, true);
    } finally { $("loadBtn").disabled = false; }
  });
  $("loadBtn").addEventListener("click", () => $("pdfFile").click());
  $("copyBtn").addEventListener("click", async () => {
    const names = editableNames();
    if (!names) return;
    try {
      await navigator.clipboard.writeText(names.join("\n"));
      setStatus(messages.copied(names.length));
    } catch { setStatus(messages.error, true); }
  });
  $("csvBtn").addEventListener("click", () => {
    const names = editableNames();
    if (!names) return;
    const csv = "\uFEFFNombre\r\n" + names.map((n) => `"${n.replace(/"/g, '""')}"`).join("\r\n") + "\r\n";
    const url = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8" }));
    const link = document.createElement("a");
    link.href = url; link.download = "alumnado.csv"; link.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    setStatus(messages.downloaded(names.length));
  });
  $("clearBtn").addEventListener("click", () => {
    $("names").value = ""; $("pdfFile").value = ""; setStatus(messages.cleared);
  });
}

if (typeof document !== "undefined") start();
