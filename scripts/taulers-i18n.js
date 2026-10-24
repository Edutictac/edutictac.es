/*
 * EduTicTac — internacionalització dels taulers (CA base; VA només diferències).
 *
 * El text per defecte de les pàgines és valencià. Este fitxer el tradueix a
 * català central, castellà i anglés. Com en la resta d'EduTicTac, el valencià
 * hereta del català: només cal posar `va` quan la forma valenciana canvia.
 *
 * - Els textos estàtics es tradueixen pel seu text original (mapa STATIC).
 * - Els missatges dinàmics usen claus semàntiques (mapa DYNAMIC) des del JS.
 * - Compartix la galeta `edutictac_language` i `localStorage` amb la resta.
 * - Registra `window.edutictacLanguage` perquè el xip de Commons mostre CA/VA/ES/EN.
 */
(function () {
  'use strict';

  var COOKIE = 'edutictac_language';
  var STORAGE_KEY = 'edutictac-lang';
  var DEFAULT_LANG = 'ca';
  var SUPPORTED = ['ca', 'va', 'es', 'en'];
  var HTML_LANG = { ca: 'ca', va: 'ca-ES-valencia', es: 'es', en: 'en' };
  var LOCALES = { ca: 'ca-ES', va: 'ca-ES-valencia', es: 'es-ES', en: 'en-GB' };
  var LANGUAGE_NAMES = { ca: 'Català', va: 'Valencià', es: 'Español', en: 'English' };

  // Text original (valencià) -> traduccions. `va` només si canvia respecte de `ca`.
  var STATIC = {
    'Accés amb codi i PIN. El grup és intern del professorat i no forma part de l\'entrada de l\'alumnat.': {
      ca: 'Accés amb codi i PIN. El grup és intern del professorat i no forma part de l\'entrada de l\'alumnat.',
      es: 'Acceso con código y PIN. El grupo es interno del profesorado y no forma parte de la entrada del alumnado.',
      en: 'Access with a code and PIN. The group is internal to teachers and is not part of the student sign-in.'
    },
    'Activitat recent': { ca: 'Activitat recent', es: 'Actividad reciente', en: 'Recent activity' },
    'Activitats i serveis oberts per a aquesta sessió.': {
      ca: 'Activitats i serveis oberts per a aquesta sessió.',
      es: 'Actividades y servicios abiertos para esta sesión.',
      en: 'Activities and services open for this session.'
    },
    'Activitats interactives seleccionades per etapa.': {
      ca: 'Activitats interactives seleccionades per etapa.',
      es: 'Actividades interactivas seleccionadas por etapa.',
      en: 'Interactive activities selected by stage.'
    },
    'Ajuda': { ca: 'Ajuda', es: 'Ayuda', en: 'Help' },
    'Idioma': { ca: 'Idioma', es: 'Idioma', en: 'Language' },
    'Tema': { ca: 'Tema', es: 'Tema', en: 'Theme' },
    'Banc de recursos': { ca: 'Banc de recursos', es: 'Banco de recursos', en: 'Resource bank' },
    'Codi font': { ca: 'Codi font', es: 'Código fuente', en: 'Source code' },
    'Continuar': { ca: 'Continuar', es: 'Continuar', en: 'Continue' },
    'Disponible': { ca: 'Disponible', es: 'Disponible', en: 'Available' },
    'El codi identifica la sessió de treball sense mostrar dades personals.': {
      ca: 'El codi identifica la sessió de treball sense mostrar dades personals.',
      es: 'El código identifica la sesión de trabajo sin mostrar datos personales.',
      en: 'The code identifies the work session without showing personal data.'
    },
    'El professorat pot organitzar grups sense demanar-los en l\'accés.': {
      ca: 'El professorat pot organitzar grups sense demanar-los en l\'accés.',
      es: 'El profesorado puede organizar grupos sin pedirlos en el acceso.',
      en: 'Teachers can organise groups without asking for them at sign-in.'
    },
    'Entra a la teua aula': {
      ca: 'Entra a la teva aula',
      va: 'Entra a la teua aula',
      es: 'Entra en tu aula',
      en: 'Enter your classroom'
    },
    'Entrada senzilla per continuar activitats, obrir recursos de classe i accedir als serveis compatibles amb el codi d\'alumne.': {
      ca: 'Entrada senzilla per continuar activitats, obrir recursos de classe i accedir als serveis compatibles amb el codi d\'alumne.',
      es: 'Entrada sencilla para continuar actividades, abrir recursos de clase y acceder a los servicios compatibles con el código de alumno.',
      en: 'Simple entry point to continue activities, open class resources and access services that work with the student code.'
    },
    'Entrar amb codi i PIN': { ca: 'Entrar amb codi i PIN', es: 'Entrar con código y PIN', en: 'Sign in with code and PIN' },
    'Escriu el codi i el PIN que t\'ha donat el teu docent en la pàgina d\'entrada de Commons.': {
      ca: 'Escriu el codi i el PIN que t\'ha donat el teu docent en la pàgina d\'entrada de Commons.',
      es: 'Escribe el código y el PIN que te ha dado tu docente en la página de entrada de Commons.',
      en: 'Enter the code and PIN your teacher gave you on the Commons sign-in page.'
    },
    'Favorit guardat': { ca: 'Favorit guardat', es: 'Favorito guardado', en: 'Favourite saved' },
    'Fraccions amb blocs · fa 12 minuts': {
      ca: 'Fraccions amb blocs · fa 12 minuts',
      es: 'Fracciones con bloques · hace 12 minutos',
      en: 'Fractions with blocks · 12 minutes ago'
    },
    'Grup intern': { ca: 'Grup intern', es: 'Grupo interno', en: 'Internal group' },
    'Hui': { ca: 'Avui', va: 'Hui', es: 'Hoy', en: 'Today' },
    'Indicadors visibles per a l\'alumne dins del seu codi.': {
      ca: 'Indicadors visibles per a l\'alumne dins del seu codi.',
      es: 'Indicadores visibles para el alumno dentro de su código.',
      en: 'Indicators visible to the student under their code.'
    },
    'Inici': { ca: 'Inici', es: 'Inicio', en: 'Home' },
    'La resta d\'esta pàgina és una vista prèvia del disseny.': {
      ca: 'La resta d\'aquesta pàgina és una vista prèvia del disseny.',
      va: 'La resta d\'esta pàgina és una vista prèvia del disseny.',
      es: 'El resto de esta página es una vista previa del diseño.',
      en: 'The rest of this page is a design preview.'
    },
    'Labyrinth 6 · ahir': { ca: 'Labyrinth 6 · ahir', es: 'Labyrinth 6 · ayer', en: 'Labyrinth 6 · yesterday' },
    'Lectura digital · aquesta setmana': {
      ca: 'Lectura digital · aquesta setmana',
      es: 'Lectura digital · esta semana',
      en: 'Digital reading · this week'
    },
    'Obert': { ca: 'Obert', es: 'Abierto', en: 'Open' },
    'Partides i qüestionaris oberts per a la classe.': {
      ca: 'Partides i qüestionaris oberts per a la classe.',
      es: 'Partidas y cuestionarios abiertos para la clase.',
      en: 'Games and quizzes open for the class.'
    },
    'Privacitat': { ca: 'Privacitat', es: 'Privacidad', en: 'Privacy' },
    'Progrés': { ca: 'Progrés', es: 'Progreso', en: 'Progress' },
    'Pròxim': { ca: 'Pròxim', es: 'Próximo', en: 'Coming soon' },
    'Recurs completat': { ca: 'Recurs completat', es: 'Recurso completado', en: 'Resource completed' },
    'Recursos': { ca: 'Recursos', es: 'Recursos', en: 'Resources' },
    'Recursos marcats pel professorat i favorits personals.': {
      ca: 'Recursos marcats pel professorat i favorits personals.',
      es: 'Recursos marcados por el profesorado y favoritos personales.',
      en: 'Resources bookmarked by teachers and personal favourites.'
    },
    'Repte iniciat': { ca: 'Repte iniciat', es: 'Reto iniciado', en: 'Challenge started' },
    'Reptes de programació i pràctica individual.': {
      ca: 'Reptes de programació i pràctica individual.',
      es: 'Retos de programación y práctica individual.',
      en: 'Programming challenges and individual practice.'
    },
    'Sense nom ni correu': { ca: 'Sense nom ni correu', es: 'Sin nombre ni correo', en: 'No name or email' },
    'Tauler de l\'alumnat': { ca: 'Tauler de l\'alumnat', es: 'Panel del alumnado', en: 'Student dashboard' },
    'Tauler de l\'alumnat — EduTicTac Commons': {
      ca: 'Tauler de l\'alumnat — EduTicTac Commons',
      es: 'Panel del alumnado — EduTicTac Commons',
      en: 'Student dashboard — EduTicTac Commons'
    },
    'Vista ràpida de la sessió.': { ca: 'Vista ràpida de la sessió.', es: 'Vista rápida de la sesión.', en: 'Quick view of the session.' },
    'activitats': { ca: 'activitats', es: 'actividades', en: 'activities' },
    'avisos': { ca: 'avisos', es: 'avisos', en: 'alerts' },
    'favorits': { ca: 'favorits', es: 'favoritos', en: 'favourites' },
    'pendent': { ca: 'pendent', es: 'pendiente', en: 'pending' },
    '← Tornar a edutictac.es': { ca: '← Tornar a edutictac.es', es: '← Volver a edutictac.es', en: '← Back to edutictac.es' },

    'Accés docent a les eines que formen el Commons.': {
      ca: 'Accés docent a les eines que formen el Commons.',
      es: 'Acceso docente a las herramientas que forman el Commons.',
      en: 'Teacher access to the tools that make up Commons.'
    },
    'Activitats proposades': { ca: 'Activitats proposades', es: 'Actividades propuestas', en: 'Proposed activities' },
    'Actualitzar': { ca: 'Actualitzar', es: 'Actualizar', en: 'Refresh' },
    'Afegir noves credencials sense eliminar les que ja es veuen': {
      ca: 'Afegir noves credencials sense eliminar les que ja es veuen',
      es: 'Añadir nuevas credenciales sin eliminar las que ya se ven',
      en: 'Add new credentials without removing the ones already shown'
    },
    'Alumnat': { ca: 'Alumnat', es: 'Alumnado', en: 'Students' },
    'Atenció: les credencials queden guardades al servidor i funcionen encara que canvies d\'ordinador. Els PIN només es mostren en el moment de generar-los o regenerar-los; imprimeix-los o guarda\'ls abans de tancar la pestanya.': {
      ca: 'Atenció: les credencials queden guardades al servidor i funcionen encara que canviïs d\'ordinador. Els PIN només es mostren en el moment de generar-los o regenerar-los; imprimeix-los o guarda\'ls abans de tancar la pestanya.',
      va: 'Atenció: les credencials queden guardades al servidor i funcionen encara que canvies d\'ordinador. Els PIN només es mostren en el moment de generar-los o regenerar-los; imprimeix-los o guarda\'ls abans de tancar la pestanya.',
      es: 'Atención: las credenciales quedan guardadas en el servidor y funcionan aunque cambies de ordenador. Los PIN solo se muestran en el momento de generarlos o regenerarlos; imprímelos o guárdalos antes de cerrar la pestaña.',
      en: 'Note: credentials are stored on the server and keep working even if you change computers. PINs are only shown when they are generated or regenerated; print or save them before closing the tab.'
    },
    'Aules, credencials de l\'alumnat, assignacions i resultats es gestionen amb el teu compte EduTicTac en Commons. Si encara no has entrat, allí podràs iniciar sessió.': {
      ca: 'Aules, credencials de l\'alumnat, assignacions i resultats es gestionen amb el teu compte EduTicTac en Commons. Si encara no has entrat, allà podràs iniciar sessió.',
      va: 'Aules, credencials de l\'alumnat, assignacions i resultats es gestionen amb el teu compte EduTicTac en Commons. Si encara no has entrat, allí podràs iniciar sessió.',
      es: 'Aulas, credenciales del alumnado, asignaciones y resultados se gestionan con tu cuenta EduTicTac en Commons. Si aún no has entrado, allí podrás iniciar sesión.',
      en: 'Classrooms, student credentials, assignments and results are managed with your EduTicTac account in Commons. If you have not signed in yet, you can do so there.'
    },
    'Carregant activitats proposades...': { ca: 'Carregant activitats proposades...', es: 'Cargando actividades propuestas...', en: 'Loading proposed activities...' },
    'Carregant lots...': { ca: 'Carregant lots...', es: 'Cargando lotes...', en: 'Loading batches...' },
    'Clau activitat': { ca: 'Clau activitat', es: 'Clave de actividad', en: 'Activity key' },
    'Codi': { ca: 'Codi', es: 'Código', en: 'Code' },
    'Codi de l\'alumne': { ca: 'Codi de l\'alumne', es: 'Código del alumno', en: 'Student code' },
    'Com tractar la llista actual': { ca: 'Com tractar la llista actual', es: 'Cómo tratar la lista actual', en: 'How to handle the current list' },
    'Comprovant activitats...': { ca: 'Comprovant activitats...', es: 'Comprobando actividades...', en: 'Checking activities...' },
    'Comprovant credencials actives...': { ca: 'Comprovant credencials actives...', es: 'Comprobando credenciales activas...', en: 'Checking active credentials...' },
    'Comprovant lots...': { ca: 'Comprovant lots...', es: 'Comprobando lotes...', en: 'Checking batches...' },
    'Comprovant sessió docent...': { ca: 'Comprovant sessió docent...', es: 'Comprobando sesión docente...', en: 'Checking teacher session...' },
    'Connectat': { ca: 'Connectat', es: 'Conectado', en: 'Connected' },
    'Control intern de quantes credencials hi ha creades. Els PIN no es poden recuperar.': {
      ca: 'Control intern de quantes credencials hi ha creades. Els PIN no es poden recuperar.',
      es: 'Control interno de cuántas credenciales hay creadas. Los PIN no se pueden recuperar.',
      en: 'Internal count of how many credentials exist. PINs cannot be recovered.'
    },
    'Creació de codis i PIN sense demanar correu, nom ni grup visible a l\'alumne.': {
      ca: 'Creació de codis i PIN sense demanar correu, nom ni grup visible a l\'alumne.',
      es: 'Creación de códigos y PIN sin pedir correo, nombre ni grupo visible al alumno.',
      en: 'Creating codes and PINs without asking for email, name or a group visible to the student.'
    },
    'Crear activitat': { ca: 'Crear activitat', es: 'Crear actividad', en: 'Create activity' },
    'Credencials actives': { ca: 'Credencials actives', es: 'Credenciales activas', en: 'Active credentials' },
    'Credencials d\'alumnat': { ca: 'Credencials d\'alumnat', es: 'Credenciales del alumnado', en: 'Student credentials' },
    'Credencials visibles': { ca: 'Credencials visibles', es: 'Credenciales visibles', en: 'Visible credentials' },
    'Disseny': { ca: 'Disseny', es: 'Diseño', en: 'Design' },
    'El teu tauler real és a Commons': { ca: 'El teu tauler real és a Commons', es: 'Tu panel real está en Commons', en: 'Your real dashboard is in Commons' },
    'Encara no s\'han generat credencials en aquesta sessió.': {
      ca: 'Encara no s\'han generat credencials en aquesta sessió.',
      es: 'Aún no se han generado credenciales en esta sesión.',
      en: 'No credentials have been generated in this session yet.'
    },
    'Escriu el codi de l\'alumne o usa la llista. El PIN nou només es mostrarà en aquest moment.': {
      ca: 'Escriu el codi de l\'alumne o usa la llista. El PIN nou només es mostrarà en aquest moment.',
      es: 'Escribe el código del alumno o usa la lista. El PIN nuevo solo se mostrará en este momento.',
      en: 'Enter the student code or use the list. The new PIN will only be shown at this point.'
    },
    'Estat': { ca: 'Estat', es: 'Estado', en: 'Status' },
    'Evidències': { ca: 'Evidències', es: 'Evidencias', en: 'Evidence' },
    'Favorits, valoracions, recursos de classe i activitat de l\'alumnat.': {
      ca: 'Favorits, valoracions, recursos de classe i activitat de l\'alumnat.',
      es: 'Favoritos, valoraciones, recursos de clase y actividad del alumnado.',
      en: 'Favourites, ratings, class resources and student activity.'
    },
    'Forja': { ca: 'Forja', es: 'Forja', en: 'Forge' },
    'Generar alumnat': { ca: 'Generar alumnat', es: 'Generar alumnado', en: 'Generate students' },
    'Imprimir targetes': { ca: 'Imprimir targetes', es: 'Imprimir tarjetas', en: 'Print cards' },
    'Indicadors de treball per a la sessió docent.': {
      ca: 'Indicadors de treball per a la sessió docent.',
      es: 'Indicadores de trabajo para la sesión docente.',
      en: 'Work indicators for the teaching session.'
    },
    'Informes': { ca: 'Informes', es: 'Informes', en: 'Reports' },
    'Inicia sessió si no apareixen dades.': { ca: 'Inicia sessió si no apareixen dades.', es: 'Inicia sesión si no aparecen datos.', en: 'Sign in if no data appears.' },
    'Iniciar sessió': { ca: 'Iniciar sessió', es: 'Iniciar sesión', en: 'Sign in' },
    'Intents': { ca: 'Intents', es: 'Intentos', en: 'Attempts' },
    'La generació de credencials usa la sessió docent de Recursos. La resta de mòduls continua com a maqueta de treball.': {
      ca: 'La generació de credencials usa la sessió docent de Recursos. La resta de mòduls continua com a maqueta de treball.',
      es: 'La generación de credenciales usa la sesión docente de Recursos. El resto de módulos continúa como maqueta de trabajo.',
      en: 'Credential generation uses the Recursos teacher session. The rest of the modules remain a working mock-up.'
    },
    'Lectura agregada sense dades personals innecessàries.': {
      ca: 'Lectura agregada sense dades personals innecessàries.',
      es: 'Lectura agregada sin datos personales innecesarios.',
      en: 'Aggregated reading without unnecessary personal data.'
    },
    'Les credencials d\'alumnat d\'esta pàgina funcionen amb la sessió docent del Banc de recursos (el botó «Iniciar sessió» del bloc), separada del compte de dalt. La resta de mòduls és una vista prèvia del disseny.': {
      ca: 'Les credencials d\'alumnat d\'aquesta pàgina funcionen amb la sessió docent del Banc de recursos (el botó «Inicia sessió» del bloc), separada del compte de dalt. La resta de mòduls és una vista prèvia del disseny.',
      va: 'Les credencials d\'alumnat d\'esta pàgina funcionen amb la sessió docent del Banc de recursos (el botó «Iniciar sessió» del bloc), separada del compte de dalt. La resta de mòduls és una vista prèvia del disseny.',
      es: 'Las credenciales del alumnado de esta página funcionan con la sesión docente del Banco de recursos (el botón «Iniciar sesión» del bloque), separada de la cuenta de arriba. El resto de módulos es una vista previa del diseño.',
      en: 'The student credentials on this page work with the teacher session of the Resource bank (the “Sign in” button in the block), separate from the account above. The rest of the modules are a design preview.'
    },
    'Les credencials d\'alumnat d\'esta pàgina funcionen amb el teu compte EduTicTac (el mateix de dalt; el botó «Iniciar sessió» del bloc porta a entrar si encara no ho has fet). La resta de mòduls és una vista prèvia del disseny.': {
      ca: 'Les credencials d\'alumnat d\'aquesta pàgina funcionen amb el teu compte EduTicTac (el mateix de dalt; el botó «Inicia sessió» del bloc porta a entrar si encara no ho has fet). La resta de mòduls és una vista prèvia del disseny.',
      va: 'Les credencials d\'alumnat d\'esta pàgina funcionen amb el teu compte EduTicTac (el mateix de dalt; el botó «Iniciar sessió» del bloc porta a entrar si encara no ho has fet). La resta de mòduls és una vista prèvia del disseny.',
      es: 'Las credenciales del alumnado de esta página funcionan con tu cuenta EduTicTac (la misma de arriba; el botón «Iniciar sesión» del bloque lleva a entrar si aún no lo has hecho). El resto de módulos es una vista previa del diseño.',
      en: 'The student credentials on this page work with your EduTicTac account (the same one above; the “Sign in” button in the block takes you to sign in if you have not done so yet). The rest of the modules are a design preview.'
    },
    'Longitud PIN': { ca: 'Longitud PIN', es: 'Longitud del PIN', en: 'PIN length' },
    'Lot': { ca: 'Lot', es: 'Lote', en: 'Batch' },
    'Lot intern': { ca: 'Lot intern', es: 'Lote interno', en: 'Internal batch' },
    'Lots de credencials': { ca: 'Lots de credencials', es: 'Lotes de credenciales', en: 'Credential batches' },
    'Materials de referència i documentació comunitària.': {
      ca: 'Materials de referència i documentació comunitària.',
      es: 'Materiales de referencia y documentación comunitaria.',
      en: 'Reference materials and community documentation.'
    },
    'Millor puntuació': { ca: 'Millor puntuació', es: 'Mejor puntuación', en: 'Best score' },
    'Obrir el tauler de Commons': { ca: 'Obrir el tauler de Commons', es: 'Abrir el panel de Commons', en: 'Open the Commons dashboard' },
    'Ocultar': { ca: 'Amaga', va: 'Ocultar', es: 'Ocultar', en: 'Hide' },
    'Pendent': { ca: 'Pendent', es: 'Pendiente', en: 'Pending' },
    'Projectes, incidències i codi font dels serveis.': {
      ca: 'Projectes, incidències i codi font dels serveis.',
      es: 'Proyectos, incidencias y código fuente de los servicios.',
      en: 'Projects, issues and source code for the services.'
    },
    'Pròxims mòduls': { ca: 'Pròxims mòduls', es: 'Próximos módulos', en: 'Upcoming modules' },
    'Quantitat': { ca: 'Quantitat', es: 'Cantidad', en: 'Quantity' },
    'Qüestionaris, partides de classe i historial docent.': {
      ca: 'Qüestionaris, partides de classe i historial docent.',
      es: 'Cuestionarios, partidas de clase e historial docente.',
      en: 'Quizzes, class games and teaching history.'
    },
    'Recollida lleugera de treballs i captures.': {
      ca: 'Recollida lleugera de treballs i captures.',
      es: 'Recogida ligera de trabajos y capturas.',
      en: 'Lightweight collection of work and screenshots.'
    },
    'Regenerar PIN': { ca: 'Regenerar PIN', es: 'Regenerar PIN', en: 'Regenerate PIN' },
    'Registra el context docent d\'una activitat perquè els resultats queden separats per grup i professorat.': {
      ca: 'Registra el context docent d\'una activitat perquè els resultats queden separats per grup i professorat.',
      es: 'Registra el contexto docente de una actividad para que los resultados queden separados por grupo y profesorado.',
      en: 'Records the teaching context of an activity so that results stay separated by group and teacher.'
    },
    'Resultats': { ca: 'Resultats', es: 'Resultados', en: 'Results' },
    'Resultats agregats per codi pseudònim.': {
      ca: 'Resultats agregats per codi pseudònim.',
      es: 'Resultados agregados por código seudónimo.',
      en: 'Aggregated results by pseudonymous code.'
    },
    'Resum': { ca: 'Resum', es: 'Resumen', en: 'Overview' },
    'Selecciona una activitat proposada.': { ca: 'Selecciona una activitat proposada.', es: 'Selecciona una actividad propuesta.', en: 'Select a proposed activity.' },
    'Servei': { ca: 'Servei', es: 'Servicio', en: 'Service' },
    'Serveis de treball': { ca: 'Serveis de treball', es: 'Servicios de trabajo', en: 'Work services' },
    'Substituir la llista visible per la nova generació': {
      ca: 'Substituir la llista visible per la nova generació',
      es: 'Sustituir la lista visible por la nueva generación',
      en: 'Replace the visible list with the new batch'
    },
    'Tauler del professorat': { ca: 'Tauler del professorat', es: 'Panel del profesorado', en: 'Teacher dashboard' },
    'Tauler del professorat — EduTicTac Commons': {
      ca: 'Tauler del professorat — EduTicTac Commons',
      es: 'Panel del profesorado — EduTicTac Commons',
      en: 'Teacher dashboard — EduTicTac Commons'
    },
    'Títol visible': { ca: 'Títol visible', es: 'Título visible', en: 'Visible title' },
    'Vista inicial per gestionar alumnat, recursos i serveis de treball des d\'un espai propi del professorat.': {
      ca: 'Vista inicial per gestionar alumnat, recursos i serveis de treball des d\'un espai propi del professorat.',
      es: 'Vista inicial para gestionar alumnado, recursos y servicios de trabajo desde un espacio propio del profesorado.',
      en: 'Starting view to manage students, resources and work services from your own teaching space.'
    },
    'actives': { ca: 'actives', es: 'activas', en: 'active' },
    'credencials': { ca: 'credencials', es: 'credenciales', en: 'credentials' },
    'credencials actives. Usa aquest bloc només quan necessites regenerar un PIN.': {
      ca: 'credencials actives. Usa aquest bloc només quan necessites regenerar un PIN.',
      es: 'credenciales activas. Usa este bloque solo cuando necesites regenerar un PIN.',
      en: 'active credentials. Use this block only when you need to regenerate a PIN.'
    },
    'credencials amb PIN visibles en aquesta pestanya.': {
      ca: 'credencials amb PIN visibles en aquesta pestanya.',
      es: 'credenciales con PIN visibles en esta pestaña.',
      en: 'credentials with a visible PIN in this tab.'
    },
    'lots interns': { ca: 'lots interns', es: 'lotes internos', en: 'internal batches' },
    'recursos': { ca: 'recursos', es: 'recursos', en: 'resources' },
    'Últim resultat': { ca: 'Últim resultat', es: 'Último resultado', en: 'Last result' },
    'Ús previst': { ca: 'Ús previst', es: 'Uso previsto', en: 'Intended use' },
    '4 dígits': { ca: '4 dígits', es: '4 dígitos', en: '4 digits' },
    '6 dígits': { ca: '6 dígits', es: '6 dígitos', en: '6 digits' },
    'Contingut principal': { ca: 'Contingut principal', es: 'Contenido principal', en: 'Main content' },
    'Seccions del tauler': { ca: 'Seccions del tauler', es: 'Secciones del panel', en: 'Dashboard sections' },
    'Crear activitat proposada': { ca: 'Crear activitat proposada', es: 'Crear actividad propuesta', en: 'Create proposed activity' },
    'Credencials generades': { ca: 'Credencials generades', es: 'Credenciales generadas', en: 'Generated credentials' },
    'Opcions de generació': { ca: 'Opcions de generació', es: 'Opciones de generación', en: 'Generation options' },
    'Regenerar PIN per codi': { ca: 'Regenerar PIN per codi', es: 'Regenerar PIN por código', en: 'Regenerate PIN by code' },
    'Resultats de l\'activitat proposada': { ca: 'Resultats de l\'activitat proposada', es: 'Resultados de la actividad propuesta', en: 'Proposed activity results' },
    'Ex. K7P': { ca: 'Ex. K7P', es: 'Ej. K7P', en: 'e.g. K7P' },
    'Ex. Taula del 2': { ca: 'Ex. Taula del 2', es: 'Ej. Tabla del 2', en: 'e.g. Table of 2' },
    'Ex. taula-2': { ca: 'Ex. taula-2', es: 'Ej. tabla-2', en: 'e.g. table-2' },
    'Maqueta del tauler de l\'alumnat d\'EduTicTac Commons.': {
      ca: 'Maqueta del tauler de l\'alumnat d\'EduTicTac Commons.',
      es: 'Maqueta del panel del alumnado de EduTicTac Commons.',
      en: 'Mock-up of the EduTicTac Commons student dashboard.'
    },
    'Maqueta del tauler del professorat d\'EduTicTac Commons.': {
      ca: 'Maqueta del tauler del professorat d\'EduTicTac Commons.',
      es: 'Maqueta del panel del profesorado de EduTicTac Commons.',
      en: 'Mock-up of the EduTicTac Commons teacher dashboard.'
    },
    'Mostrar': { ca: 'Mostra', va: 'Mostrar', es: 'Mostrar', en: 'Show' }
  };

  var DYNAMIC = {
    'common.language': { ca: 'Idioma', es: 'Idioma', en: 'Language' },
    'common.theme': { ca: 'Tema', es: 'Tema', en: 'Theme' },
    'common.show': { ca: 'Mostra', va: 'Mostrar', es: 'Mostrar', en: 'Show' },
    'common.hide': { ca: 'Amaga', va: 'Ocultar', es: 'Ocultar', en: 'Hide' },
    'common.results': { ca: 'Resultats', es: 'Resultados', en: 'Results' },
    'common.activity': { ca: 'Activitat', es: 'Actividad', en: 'Activity' },
    'common.service': { ca: 'Servei', es: 'Servicio', en: 'Service' },
    'common.activityLower': { ca: 'activitat', es: 'actividad', en: 'activity' },
    'common.internalBatch': { ca: 'Lot intern', es: 'Lote interno', en: 'Internal batch' },
    'common.internalBatchLower': { ca: 'lot intern', es: 'lote interno', en: 'internal batch' },
    'common.centre': { ca: 'Centre', es: 'Centro', en: 'Centre' },
    'common.lotNumber': { ca: 'Lot {index}', es: 'Lote {index}', en: 'Batch {index}' },
    'common.activeCount': { ca: '{count} actives', es: '{count} activas', en: '{count} active' },
    'common.createdCount': { ca: '{count} creades · {date}', es: '{count} creadas · {date}', en: '{count} created · {date}' },
    'common.groupOption': { ca: '{label} · {count} actives', es: '{label} · {count} activas', en: '{label} · {count} active' },
    'common.printPin': { ca: 'PIN {pin}', es: 'PIN {pin}', en: 'PIN {pin}' },
    'teacher.feedback.recovered': {
      ca: '{count} credencials recuperades temporalment d\'aquesta pestanya. Es comprovarà si encara existeixen al servidor.',
      va: '{count} credencials recuperades temporalment d\'esta pestanya. Es comprovarà si encara existeixen al servidor.',
      es: '{count} credenciales recuperadas temporalmente de esta pestaña. Se comprobará si todavía existen en el servidor.',
      en: '{count} credentials temporarily restored from this tab. We will check whether they still exist on the server.'
    },
    'teacher.feedback.cleared': {
      ca: 'No hi ha cap credencial activa al servidor. S\'ha netejat la llista temporal d\'aquesta pestanya.',
      va: 'No hi ha cap credencial activa al servidor. S\'ha netejat la llista temporal d\'esta pestanya.',
      es: 'No hay ninguna credencial activa en el servidor. Se ha limpiado la lista temporal de esta pestaña.',
      en: 'There are no active credentials on the server. The temporary list for this tab has been cleared.'
    },
    'teacher.credentials.empty': { ca: 'No s\'han rebut credencials.', es: 'No se han recibido credenciales.', en: 'No credentials received.' },
    'teacher.credentials.usage': { ca: 'Banc de recursos i serveis Commons', es: 'Banco de recursos y servicios Commons', en: 'Resource bank and Commons services' },
    'teacher.credentials.created': { ca: 'Creat', es: 'Creado', en: 'Created' },
    'teacher.summary.noBatchTitle': { ca: 'Cap lot creat', es: 'Ningún lote creado', en: 'No batch created' },
    'teacher.summary.noBatchText': { ca: 'Genera credencials per començar.', es: 'Genera credenciales para empezar.', en: 'Generate credentials to start.' },
    'teacher.group.none': { ca: 'Genera credencials abans', es: 'Genera credenciales antes', en: 'Generate credentials first' },
    'teacher.assignments.emptyTitle': { ca: 'Cap activitat proposada', es: 'Ninguna actividad propuesta', en: 'No proposed activities' },
    'teacher.assignments.emptyText': {
      ca: 'Crea una activitat quan vulguis començar a separar resultats per context docent.',
      va: 'Crea una activitat quan vulgues començar a separar resultats per context docent.',
      es: 'Crea una actividad cuando quieras empezar a separar resultados por contexto docente.',
      en: 'Create an activity when you want to start separating results by teaching context.'
    },
    'teacher.assignments.resultsButton': { ca: 'Resultats', es: 'Resultados', en: 'Results' },
    'teacher.assignments.untitled': { ca: 'Activitat', es: 'Actividad', en: 'Activity' },
    'teacher.assignments.meta': { ca: '{service} · {activity} · {group}', es: '{service} · {activity} · {group}', en: '{service} · {activity} · {group}' },
    'teacher.results.meta': {
      ca: '{service} · {activity} · {count} codis amb resultat',
      es: '{service} · {activity} · {count} códigos con resultado',
      en: '{service} · {activity} · {count} codes with results'
    },
    'teacher.results.empty': { ca: 'Encara no hi ha resultats per a aquesta activitat.', es: 'Aún no hay resultados para esta actividad.', en: 'There are no results for this activity yet.' },
    'teacher.results.loading': { ca: 'Carregant resultats...', es: 'Cargando resultados...', en: 'Loading results...' },
    'teacher.results.login': { ca: 'Cal iniciar sessió com a professorat.', es: 'Hay que iniciar sesión como profesorado.', en: 'You need to sign in as a teacher.' },
    'teacher.results.notFound': { ca: 'No s\'ha trobat aquesta activitat proposada.', es: 'No se ha encontrado esta actividad propuesta.', en: 'This proposed activity was not found.' },
    'teacher.results.error': { ca: 'No s\'han pogut carregar els resultats.', es: 'No se han podido cargar los resultados.', en: 'The results could not be loaded.' },
    'teacher.results.noData': { ca: 'Sense dades disponibles.', es: 'Sin datos disponibles.', en: 'No data available.' },
    'teacher.assignments.loaded': { ca: 'Activitats proposades carregades.', es: 'Actividades propuestas cargadas.', en: 'Proposed activities loaded.' },
    'teacher.assignments.login': { ca: 'Cal iniciar sessió com a professorat per veure activitats proposades.', es: 'Hay que iniciar sesión como profesorado para ver actividades propuestas.', en: 'Sign in as a teacher to see proposed activities.' },
    'teacher.assignments.error': { ca: 'No s\'han pogut carregar les activitats proposades.', es: 'No se han podido cargar las actividades propuestas.', en: 'The proposed activities could not be loaded.' },
    'teacher.assignments.errorTitle': { ca: 'No s\'ha pogut carregar', es: 'No se ha podido cargar', en: 'Could not load' },
    'teacher.assignments.errorText': { ca: 'Comprova la sessió docent i torna-ho a provar.', es: 'Comprueba la sesión docente y vuelve a intentarlo.', en: 'Check the teacher session and try again.' },
    'teacher.create.validationGroup': { ca: 'Genera o selecciona un lot intern abans de crear l\'activitat.', es: 'Genera o selecciona un lote interno antes de crear la actividad.', en: 'Generate or select an internal batch before creating the activity.' },
    'teacher.create.validationActivity': { ca: 'Introdueix la clau de l\'activitat.', es: 'Introduce la clave de la actividad.', en: 'Enter the activity key.' },
    'teacher.create.creating': { ca: 'Creant activitat proposada...', es: 'Creando actividad propuesta...', en: 'Creating proposed activity...' },
    'teacher.create.created': { ca: 'Activitat proposada creada.', es: 'Actividad propuesta creada.', en: 'Proposed activity created.' },
    'teacher.session.invalid': { ca: 'La sessió docent no és vàlida. Inicia sessió a Recursos i torna al tauler.', es: 'La sesión docente no es válida. Inicia sesión en Recursos y vuelve al panel.', en: 'The teacher session is not valid. Sign in to Recursos and return to the dashboard.' },
    'teacher.create.batchNotFound': { ca: 'No s\'ha trobat el lot intern seleccionat.', es: 'No se ha encontrado el lote interno seleccionado.', en: 'The selected internal batch was not found.' },
    'teacher.create.error': { ca: 'No s\'ha pogut crear l\'activitat proposada.', es: 'No se ha podido crear la actividad propuesta.', en: 'The proposed activity could not be created.' },
    'teacher.identities.empty': { ca: 'No hi ha credencials actives.', es: 'No hay credenciales activas.', en: 'There are no active credentials.' },
    'teacher.identities.regenerate': { ca: 'Regenerar PIN', es: 'Regenerar PIN', en: 'Regenerate PIN' },
    'teacher.identities.error': { ca: 'No s\'han pogut carregar les credencials actives.', es: 'No se han podido cargar las credenciales activas.', en: 'The active credentials could not be loaded.' },
    'teacher.pin.confirm': { ca: 'Regenerar el PIN de {code}? El PIN anterior deixarà de funcionar.', es: '¿Regenerar el PIN de {code}? El PIN anterior dejará de funcionar.', en: 'Regenerate the PIN for {code}? The previous PIN will stop working.' },
    'teacher.pin.regenerating': { ca: 'Regenerant PIN de {code}...', es: 'Regenerando PIN de {code}...', en: 'Regenerating PIN for {code}...' },
    'teacher.pin.regenerated': { ca: 'PIN regenerat per a {code}. S\'ha afegit a la llista visible per imprimir.', es: 'PIN regenerado para {code}. Se ha añadido a la lista visible para imprimir.', en: 'PIN regenerated for {code}. It has been added to the visible list for printing.' },
    'teacher.pin.error': { ca: 'No s\'ha pogut regenerar el PIN de {code}.', es: 'No se ha podido regenerar el PIN de {code}.', en: 'The PIN for {code} could not be regenerated.' },
    'teacher.pin.enterCode': { ca: 'Introdueix el codi de l\'alumne abans de regenerar el PIN.', es: 'Introduce el código del alumno antes de regenerar el PIN.', en: 'Enter the student code before regenerating the PIN.' },
    'teacher.pin.searching': { ca: 'Buscant la credencial {code}...', es: 'Buscando la credencial {code}...', en: 'Searching for credential {code}...' },
    'teacher.pin.notFound': { ca: 'No s\'ha trobat cap credencial activa amb el codi {code}. Si venia d\'una llista antiga d\'aquesta pestanya, genera credencials noves.', va: 'No s\'ha trobat cap credencial activa amb el codi {code}. Si venia d\'una llista antiga d\'esta pestanya, genera credencials noves.', es: 'No se ha encontrado ninguna credencial activa con el código {code}. Si venía de una lista antigua de esta pestaña, genera credenciales nuevas.', en: 'No active credential was found with code {code}. If it came from an old list in this tab, generate new credentials.' },
    'teacher.pin.searchError': { ca: 'No s\'ha pogut buscar la credencial {code}.', es: 'No se ha podido buscar la credencial {code}.', en: 'Credential {code} could not be searched for.' },
    'teacher.summary.errorTitle': { ca: 'No s\'ha pogut carregar el resum', es: 'No se ha podido cargar el resumen', en: 'The summary could not be loaded' },
    'teacher.summary.errorText': { ca: 'Inicia sessió com a professorat i torna-ho a provar.', es: 'Inicia sesión como profesorado y vuelve a intentarlo.', en: 'Sign in as a teacher and try again.' },
    'teacher.session.detected': { ca: 'Sessió docent detectada. Pots generar credencials.', es: 'Sesión docente detectada. Puedes generar credenciales.', en: 'Teacher session detected. You can generate credentials.' },
    'teacher.session.loginRequired': { ca: 'Cal iniciar sessió com a professorat a Recursos abans de generar credencials.', es: 'Hay que iniciar sesión como profesorado en Recursos antes de generar credenciales.', en: 'Sign in as a teacher in Recursos before generating credentials.' },
    'teacher.session.error': { ca: 'No s\'ha pogut comprovar la sessió docent amb Recursos.', es: 'No se ha podido comprobar la sesión docente con Recursos.', en: 'The teacher session with Recursos could not be checked.' },
    'teacher.generate.working': { ca: 'Generant credencials...', es: 'Generando credenciales...', en: 'Generating credentials...' },
    'teacher.generate.added': { ca: 'afegides a la llista actual', es: 'añadidas a la lista actual', en: 'added to the current list' },
    'teacher.generate.generated': { ca: 'generades correctament', es: 'generadas correctamente', en: 'generated successfully' },
    'teacher.generate.result': { ca: '{count} credencials {action}. La llista visible conté {total} credencials.', es: '{count} credenciales {action}. La lista visible contiene {total} credenciales.', en: '{count} credentials {action}. The visible list contains {total} credentials.' },
    'teacher.generate.error': { ca: 'No s\'han pogut generar les credencials. Torna-ho a provar.', es: 'No se han podido generar las credenciales. Vuelve a intentarlo.', en: 'The credentials could not be generated. Try again.' },
    'teacher.print.title': { ca: 'Credencials alumnat', es: 'Credenciales alumnado', en: 'Student credentials' },
    'teacher.print.heading': { ca: 'EduTicTac Commons · credencials d\'alumnat', es: 'EduTicTac Commons · credenciales del alumnado', en: 'EduTicTac Commons · student credentials' }
  };

  var current = detect();

  function detect() {
    var requested = (window.location.search.match(/[?&]lang=([a-z]+)(?:&|$)/) || [])[1];
    if (SUPPORTED.indexOf(requested) !== -1) return requested;
    var cookie = (document.cookie.split(';').map(function (part) { return part.trim(); })
      .filter(function (part) { return part.indexOf(COOKIE + '=') === 0; })[0] || '').slice(COOKIE.length + 1);
    if (SUPPORTED.indexOf(cookie) !== -1) return cookie;
    try {
      var saved = window.localStorage.getItem(STORAGE_KEY);
      if (SUPPORTED.indexOf(saved) !== -1) return saved;
    } catch (error) {}
    var nav = (navigator.language || navigator.userLanguage || '').toLowerCase();
    if (nav.indexOf('valencia') !== -1) return 'va';
    if (nav.indexOf('ca') === 0) return 'ca';
    if (nav.indexOf('en') === 0) return 'en';
    if (nav.indexOf('es') === 0) return 'es';
    return DEFAULT_LANG;
  }

  function pick(entry, lang) {
    if (!entry) return null;
    if (lang === 'va') return entry.va !== undefined ? entry.va : entry.ca;
    return entry[lang] !== undefined ? entry[lang] : entry.ca;
  }

  function interpolate(text, params) {
    return String(text || '').replace(/\{(\w+)\}/g, function (all, key) {
      return params && params[key] !== undefined ? params[key] : all;
    });
  }

  function t(key, params) {
    return interpolate(pick(DYNAMIC[key], current) || key, params || {});
  }

  function translateText(value) {
    var translated = pick(STATIC[value], current);
    return translated === null || translated === undefined ? value : translated;
  }

  var textNodes = new WeakMap();
  var attributeNodes = new WeakMap();
  var docTitle = document.title;
  var docDescription = (document.querySelector('meta[name="description"]') || {}).content || '';

  function applyTextNodes() {
    if (!document.body) return;
    var walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, {
      acceptNode: function (node) {
        if (!node.nodeValue || !node.nodeValue.trim()) return NodeFilter.FILTER_REJECT;
        var parent = node.parentElement;
        if (!parent || /^(SCRIPT|STYLE|NOSCRIPT)$/.test(parent.tagName) || parent.closest('[data-no-i18n]')) return NodeFilter.FILTER_REJECT;
        return NodeFilter.FILTER_ACCEPT;
      }
    });
    var nodes = [];
    var node;
    while ((node = walker.nextNode())) nodes.push(node);
    nodes.forEach(function (item) {
      var stored = textNodes.get(item);
      if (!stored) {
        var match = item.nodeValue.match(/^(\s*)([\s\S]*?)(\s*)$/);
        if (!match) return;
        var key = match[2].replace(/\s+/g, ' ').trim();
        if (!STATIC[key]) return;
        stored = { key: key, lead: match[1], trail: match[3] };
        textNodes.set(item, stored);
      }
      item.nodeValue = stored.lead + translateText(stored.key) + stored.trail;
    });
  }

  function applyAttributes() {
    if (!document.body) return;
    document.querySelectorAll('[aria-label], [title], [placeholder]').forEach(function (element) {
      if (element.closest('[data-no-i18n]')) return;
      var stored = attributeNodes.get(element) || {};
      ['aria-label', 'title', 'placeholder'].forEach(function (attribute) {
        var value = element.getAttribute(attribute);
        if (!value) return;
        var key = stored[attribute];
        if (!key) {
          if (!STATIC[value]) return;
          key = value;
          stored[attribute] = key;
        }
        element.setAttribute(attribute, translateText(key));
      });
      attributeNodes.set(element, stored);
    });
    var description = document.querySelector('meta[name="description"]');
    if (description && STATIC[docDescription]) description.setAttribute('content', translateText(docDescription));
    if (STATIC[docTitle]) document.title = translateText(docTitle);
  }

  function apply() {
    document.documentElement.lang = HTML_LANG[current];
    document.documentElement.setAttribute('data-lang-code', current);
    applyTextNodes();
    applyAttributes();
    document.querySelectorAll('[data-lang]').forEach(function (button) {
      var active = button.getAttribute('data-lang') === current;
      button.setAttribute('aria-pressed', String(active));
      var name = LANGUAGE_NAMES[button.getAttribute('data-lang')];
      if (name) {
        button.setAttribute('aria-label', name);
        button.setAttribute('title', name);
      }
    });
    var themeButton = document.querySelector('[data-theme-cycle]');
    if (themeButton) themeButton.setAttribute('aria-label', t('common.theme'));
    document.documentElement.classList.remove('i18n-pending');
  }

  function setLang(lang, persist) {
    if (SUPPORTED.indexOf(lang) === -1) return;
    current = lang;
    if (persist !== false) {
      try { window.localStorage.setItem(STORAGE_KEY, lang); } catch (error) {}
      var domain = /(^|\.)edutictac\.es$/.test(location.hostname) ? '; Domain=edutictac.es' : '';
      var secure = location.protocol === 'https:' ? '; Secure' : '';
      document.cookie = COOKIE + '=' + lang + '; Path=/; Max-Age=31536000; SameSite=Lax' + domain + secure;
    }
    apply();
    if (typeof window.__taulersRerender === 'function') window.__taulersRerender();
    document.dispatchEvent(new CustomEvent('edutictac:langchange', { detail: { lang: lang } }));
    window.dispatchEvent(new CustomEvent('edutictac:langchange', { detail: { lang: lang } }));
  }

  function cycleTheme() {
    if (!window.edutictacTheme) return;
    var order = ['auto', 'light', 'dark'];
    var next = order[(order.indexOf(window.edutictacTheme.read()) + 1 + order.length) % order.length];
    window.edutictacTheme.remember(next);
  }

  function accountFallback() {
    document.documentElement.classList.add('account-fallback');
  }

  function watchAccount() {
    document.querySelectorAll('[data-lang]').forEach(function (button) {
      button.addEventListener('click', function () { setLang(button.getAttribute('data-lang')); });
    });
    var themeButton = document.querySelector('[data-theme-cycle]');
    if (themeButton) themeButton.addEventListener('click', cycleTheme);
    if (!window.customElements) return accountFallback();
    var timer = window.setTimeout(function () {
      if (!window.customElements.get('edutictac-account')) accountFallback();
    }, 5000);
    window.customElements.whenDefined('edutictac-account').then(function () {
      window.clearTimeout(timer);
      var tries = 0;
      (function ready() {
        if (document.querySelector('edutictac-account nav.eta')) {
          document.documentElement.classList.remove('account-fallback');
        } else if (++tries < 50) {
          window.setTimeout(ready, 100);
        } else {
          accountFallback();
        }
      })();
    });
  }

  window.TaulersI18n = {
    t: t,
    getLang: function () { return current; },
    getLocale: function () { return LOCALES[current]; },
    setLang: setLang,
    apply: apply,
    refresh: apply,
    languages: SUPPORTED,
    translate: translateText,
    staticKeys: Object.keys(STATIC),
    dynamicKeys: Object.keys(DYNAMIC)
  };

  // El xip de Commons mostra els idiomes que la pàgina sap canviar.
  window.edutictacLanguage = {
    languages: SUPPORTED,
    get: function () { return current; },
    set: function (lang) { setLang(lang); }
  };

  if (current !== 'va') {
    document.documentElement.classList.add('i18n-pending');
    window.setTimeout(function () { document.documentElement.classList.remove('i18n-pending'); }, 3000);
  }
  document.documentElement.lang = HTML_LANG[current];
  document.documentElement.setAttribute('data-lang-code', current);

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () { apply(); watchAccount(); });
  } else {
    apply();
    watchAccount();
  }
})();
