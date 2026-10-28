# PDF a lista de alumnado

Herramienta estática para extraer nombres de un listado PDF, corregirlos y
copiarlos en una columna de Excel o descargarlos como CSV. Disponible en
valenciano (`/`) y castellano (`/es/`). No usa backend, almacenamiento local ni
envía el PDF a terceros. Requiere un PDF con texto seleccionable; no hace OCR.

La detección de nombres adapta la función de [EduAvisos](https://github.com/Edutictac/EduAvisos)
(licencia MIT). La lectura de PDF utiliza pdf.js 3.11.174 de Mozilla (Apache 2.0),
incluido localmente en `vendor/` para que el documento no dependa de un CDN.

La lista extraída siempre se presenta para revisión antes de copiar o descargar.
Se ha comprobado con un PDF ficticio: tres nombres, copia al portapapeles y
descarga CSV en ambas lenguas. Antes de usarla con un PDF de verReport real,
conviene verificar que su distribución de texto coincide con los casos
soportados.
