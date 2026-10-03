/*
 * EduTicTac — sistema d'internacionalització lleuger (català / valencià / castellà).
 * El valencià (va) és una capa sobre el català: només es defineix on difereix.
 *
 * El text per defecte viu a l'HTML en català (funciona sense JavaScript).
 * Aquest fitxer tradueix els elements marcats amb:
 *   - data-i18n            -> textContent
 *   - data-i18n-html       -> innerHTML (per a textos amb enllaços o <strong>)
 *   - data-i18n-aria-label -> atribut aria-label
 *   - data-i18n-placeholder-> atribut placeholder
 *   - data-i18n-title      -> atribut title
 *   - data-i18n-content    -> atribut content (meta description)
 * i els botons de canvi d'idioma amb data-lang.
 */
(function () {
  'use strict';

  var STORAGE_KEY = 'edutictac-lang';
  var DEFAULT_LANG = 'ca';
  var SUPPORTED = ['ca', 'va', 'es'];
  var HTML_LANG = { ca: 'ca', va: 'ca-ES-valencia', es: 'es' };

  var TRANSLATIONS = {
    /* ---------- Compartit ---------- */
    'lang.group': { ca: `Idioma`, es: `Idioma` },
    'lang.option.ca': { ca: `Català`, es: `Catalán` },
    'lang.option.va': {
      ca: `Valencià`,
      es: `Valenciano`
    },
    'lang.option.es': { ca: `Castellà`, es: `Castellano` },
    'theme.label.dark': { ca: `Mode fosc`, es: `Modo oscuro` },
    'theme.label.light': { ca: `Mode clar`, es: `Modo claro` },
    'theme.aria.dark': { ca: `Activa el mode fosc`, es: `Activa el modo oscuro` },
    'theme.aria.light': { ca: `Activa el mode clar`, es: `Activa el modo claro` },
    'common.copy': { ca: `Copia`, es: `Copia` },
    'common.copied': { ca: `Copiat`, es: `Copiado` },
    'common.copyError': { ca: `No s'ha pogut copiar`, es: `No se ha podido copiar` },
    'footer.help': { ca: `Ajuda`, es: `Ayuda` },
    'footer.privacy': { ca: `Privacitat`, es: `Privacidad` },
    'footer.source': { ca: `Codi font`, es: `Código fuente` },

    /* ---------- Portada ---------- */
    'home.docTitle': { ca: `Comunitat EduTicTac`, es: `Comunidad EduTicTac` },
    'home.metaDescription': {
      ca: `EduTicTac - Una comunitat per compartir, un espai per desenvolupar, un lloc per aprendre`,
      va: `EduTicTac - Una comunitat per a compartir, un espai per a desenvolupar, un lloc per a aprendre`,
      es: `EduTicTac - Una comunidad para compartir, un espacio para desarrollar, un lugar para aprender`
    },
    'home.nav.label': { ca: `Serveis EduTicTac`, es: `Servicios EduTicTac` },
    'home.h1': { ca: `Comunitat EduTicTac`, es: `Comunidad EduTicTac` },
    'home.subtitle': {
      ca: `Porta d'entrada als serveis lliures de la comunitat: recursos, documentació, codi, núvol i aplicacions educatives.`,
      es: `Puerta de entrada a los servicios libres de la comunidad: recursos, documentación, código, nube y aplicaciones educativas.`
    },
    'home.teacherGuide': {
      ca: `Què és i com fer-ho servir · Guia del professorat`,
      va: `Què és i com s'utilitza · Guia del professorat`,
      es: `Qué es y cómo usarlo · Guía del profesorado`
    },
    'home.nav.resources': { ca: `Banc de recursos`, es: `Banco de recursos` },
    'home.nav.blogs': { ca: `Blogs`, es: `Blogs` },
    'home.nav.nextcloud': { ca: `Nextcloud`, es: `Nextcloud` },
    'home.nav.wikimanuals': { ca: `Wikimanuals`, es: `Wikimanuals` },
    'home.nav.eduhoot': { ca: `EduHoot`, es: `EduHoot` },
    'home.nav.blockly': { ca: `Blockly Games`, es: `Blockly Games` },
    'home.nav.blocs': { ca: `Blocs`, es: `Blocs` },
    'home.nav.blocsJunior': { ca: `Blocs Junior`, es: `Blocs Junior` },
    'home.nav.jclic': { ca: `JClic`, es: `JClic` },
    'home.identity.eyebrow': { ca: `Compte comú`, es: `Cuenta común` },
    'home.identity.title': {
      ca: `Una mateixa identitat per als serveis de treball`,
      es: `Una misma identidad para los servicios de trabajo`
    },
    'home.identity.text': {
      ca: `Els serveis col·laboratius s'estan connectant a Authentik per reduir comptes dispersos. La forja i els wikimanuals ja permeten iniciar sessió amb el compte EduTicTac; Nextcloud i altres serveis s'aniran alineant dins del Commons.`,
      va: `Els serveis col·laboratius s'estan connectant a Authentik per a reduir comptes dispersos. La forja i els wikimanuals ja permeten iniciar sessió amb el compte EduTicTac; Nextcloud i altres serveis s'aniran alineant dins del Commons.`,
      es: `Los servicios colaborativos se están conectando a Authentik para reducir cuentas dispersas. La forja y los wikimanuales ya permiten iniciar sesión con la cuenta EduTicTac; Nextcloud y otros servicios se irán alineando dentro del Commons.`
    },
    'home.services.eyebrow': { ca: `EduTicTac Commons`, es: `EduTicTac Commons` },
    'home.services.title': { ca: `Serveis de la comunitat`, es: `Servicios de la comunidad` },
    'home.services.text': {
      ca: `Espais per trobar recursos, publicar, documentar, compartir fitxers i desenvolupar programari educatiu lliure.`,
      va: `Espais per a trobar recursos, publicar, documentar, compartir fitxers i desenvolupar programari educatiu lliure.`,
      es: `Espacios para encontrar recursos, publicar, documentar, compartir archivos y desarrollar software educativo libre.`
    },
    'home.services.resources.title': { ca: `Banc de recursos`, es: `Banco de recursos` },
    'home.services.resources.desc': {
      ca: `Directori de jocs educatius filtrables per etapa, matèria i idioma.`,
      es: `Directorio de juegos educativos filtrables por etapa, materia e idioma.`
    },
    'home.services.blogs.title': { ca: `Blogs`, es: `Blogs` },
    'home.services.blogs.desc': {
      ca: `Publicacions, experiències i recursos compartits per la comunitat EduTicTac.`,
      es: `Publicaciones, experiencias y recursos compartidos por la comunidad EduTicTac.`
    },
    'home.services.nextcloud.title': { ca: `Nextcloud`, es: `Nextcloud` },
    'home.services.nextcloud.desc': {
      ca: `Núvol privat amb fitxers, edició col·laborativa i formularis per al treball docent.`,
      es: `Nube privada con archivos, edición colaborativa y formularios para el trabajo docente.`
    },
    'home.services.wikimanuals.title': { ca: `Wikimanuals`, es: `Wikimanuals` },
    'home.services.wikimanuals.desc': {
      ca: `Documentació col·laborativa sobre programari lliure, aula digital i eines educatives.`,
      va: `Documentació col·laborativa sobre programari lliure, aula digital i ferramentes educatives.`,
      es: `Documentación colaborativa sobre software libre, aula digital y herramientas educativas.`
    },
    'home.services.forge.title': { ca: `Forja`, es: `Forja` },
    'home.services.forge.desc': {
      ca: `Repositoris de codi EduTicTac (Forgejo): el codi font de les aplicacions i projectes de la comunitat.`,
      es: `Repositorios de código EduTicTac (Forgejo): el código fuente de las aplicaciones y proyectos de la comunidad.`
    },
    'home.services.telegram.title': { ca: `Telegram`, es: `Telegram` },
    'home.services.telegram.desc': {
      ca: `Canal de conversa per compartir dubtes, novetats i recursos amb la comunitat.`,
      va: `Canal de conversa per a compartir dubtes, novetats i recursos amb la comunitat.`,
      es: `Canal de conversación para compartir dudas, novedades y recursos con la comunidad.`
    },
    'home.services.install.title': { ca: `Instal·la Commons`, es: `Instala Commons` },
    'home.services.install.desc': {
      ca: `Guia per instal·lar EduTicTac Commons al teu propi servidor.`,
      va: `Guia per a instal·lar EduTicTac Commons en el teu propi servidor.`,
      es: `Guía para instalar EduTicTac Commons en tu propio servidor.`
    },
    'home.apps.eyebrow': { ca: `Aula i aprenentatge`, es: `Aula y aprendizaje` },
    'home.apps.title': { ca: `Aplicacions educatives`, es: `Aplicaciones educativas` },
    'home.apps.text': {
      ca: `Eines i activitats accessibles des del navegador per crear, jugar i treballar competències digitals sense plataformes publicitàries.`,
      va: `Ferramentes i activitats accessibles des del navegador per a crear, jugar i treballar competències digitals sense plataformes publicitàries.`,
      es: `Herramientas y actividades accesibles desde el navegador para crear, jugar y trabajar competencias digitales sin plataformas publicitarias.`
    },
    'home.apps.eduhoot.title': { ca: `EduHoot`, es: `EduHoot` },
    'home.apps.eduhoot.desc': {
      ca: `Joc de preguntes tipus concurs per crear activitats ràpides i participatives.`,
      va: `Joc de preguntes tipus concurs per a crear activitats ràpides i participatives.`,
      es: `Juego de preguntas tipo concurso para crear actividades rápidas y participativas.`
    },
    'home.apps.prompt.title': { ca: `EduTicTac Prompt`, es: `EduTicTac Prompt` },
    'home.apps.prompt.desc': {
      ca: `Construeix, organitza i reutilitza prompts educatius amb formularis guiats i funcionament local.`,
      es: `Construye, organiza y reutiliza prompts educativos con formularios guiados y funcionamiento local.`
    },
    'home.apps.play.title': { ca: `EduTicTac Play`, es: `EduTicTac Play` },
    'home.apps.play.desc': {
      ca: `Crea jocs i activitats interactives H5P al navegador i descarrega'ls per a l'aula o Aules.`,
      es: `Crea juegos y actividades interactivas H5P en el navegador y descárgalos para el aula o Aules.`
    },
    'home.apps.jclic.title': { ca: `JClic`, es: `JClic` },
    'home.apps.jclic.desc': {
      ca: `Biblioteca d'activitats educatives JClic accessibles des del navegador.`,
      es: `Biblioteca de actividades educativas JClic accesibles desde el navegador.`
    },
    'home.apps.edumusic.title': { ca: `EduMusic`, es: `EduMusic` },
    'home.apps.edumusic.desc': {
      ca: `Recursos musicals i activitats interactives per treballar ritme, lectura i creació sonora.`,
      va: `Recursos musicals i activitats interactives per a treballar ritme, lectura i creació sonora.`,
      es: `Recursos musicales y actividades interactivas para trabajar ritmo, lectura y creación sonora.`
    },
    'home.apps.educraft.title': { ca: `EduCraft`, es: `EduCraft` },
    'home.apps.educraft.desc': {
      ca: `Entorn de construcció i exploració inspirat en mons voxel per a activitats creatives.`,
      es: `Entorno de construcción y exploración inspirado en mundos voxel para actividades creativas.`
    },
    'home.pc.eyebrow': { ca: `Programació i robòtica`, es: `Programación y robótica` },
    'home.pc.title': { ca: `Pensament computacional i robòtica`, es: `Pensamiento computacional y robótica` },
    'home.pc.text': {
      ca: `Entorns lliures per programar amb blocs i treballar la robòtica educativa des del navegador, sense comptes ni plataformes publicitàries.`,
      va: `Entorns lliures per a programar amb blocs i treballar la robòtica educativa des del navegador, sense comptes ni plataformes publicitàries.`,
      es: `Entornos libres para programar con bloques y trabajar la robótica educativa desde el navegador, sin cuentas ni plataformas publicitarias.`
    },
    'home.pc.linkText': {
      ca: `Tens activitats llestes per a l'aula a la col·lecció de <a href="https://recursos.edutictac.es/" class="text-blue-600 hover:underline transition">pensament computacional i robòtica del Banc de recursos</a>.`,
      es: `Tienes actividades listas para el aula en la colección de <a href="https://recursos.edutictac.es/" class="text-blue-600 hover:underline transition">pensamiento computacional y robótica del Banco de recursos</a>.`
    },
    'home.pc.blockly.title': { ca: `Blockly Games`, es: `Blockly Games` },
    'home.pc.blockly.desc': {
      ca: `Jocs progressius per iniciar-se en la programació amb blocs i JavaScript.`,
      va: `Jocs progressius per a iniciar-se en la programació amb blocs i JavaScript.`,
      es: `Juegos progresivos para iniciarse en la programación con bloques y JavaScript.`
    },
    'home.pc.blocs.title': { ca: `EduTicTac Blocs`, es: `EduTicTac Blocs` },
    'home.pc.blocs.desc': {
      ca: `Editor de programació per blocs compatible amb Scratch, lliure, sense rastrejadors i sense comptes.`,
      es: `Editor de programación por bloques compatible con Scratch, libre, sin rastreadores y sin cuentas.`
    },
    'home.pc.blocsJunior.title': { ca: `EduTicTac Blocs Junior`, es: `EduTicTac Blocs Junior` },
    'home.pc.blocsJunior.desc': {
      ca: `Programació visual per blocs per a Educació Infantil i primers cursos de Primària, inspirada en ScratchJr.`,
      es: `Programación visual por bloques para Educación Infantil y primeros cursos de Primaria, inspirada en ScratchJr.`
    },
    'home.pc.robotics.title': { ca: `Robòtica`, es: `Robótica` },
    'home.pc.robotics.desc': {
      ca: `Simulador de micro:bit al navegador per programar i provar robots sense maquinari.`,
      va: `Simulador de micro:bit en el navegador per a programar i provar robots sense maquinari.`,
      es: `Simulador de micro:bit en el navegador para programar y probar robots sin hardware.`
    },
    'home.pc.roberta.title': { ca: `Open Roberta Lab`, es: `Open Roberta Lab` },
    'home.pc.roberta.desc': {
      ca: `Entorn de programació per blocs i text per a micro:bit, Arduino i altres robots, amb simulador.`,
      es: `Entorno de programación por bloques y texto para micro:bit, Arduino y otros robots, con simulador.`
    },
    'home.pc.link.title': { ca: `EduTicTac Link`, es: `EduTicTac Link` },
    'home.pc.link.desc': {
      ca: `Connecta el micro:bit amb Blocs i Scratch des de Linux, sense Scratch Link de Windows/macOS.`,
      es: `Conecta el micro:bit con Blocs y Scratch desde Linux, sin Scratch Link de Windows/macOS.`
    },

    /* ---------- Commons (guia del professorat) ---------- */
    'commons.docTitle': {
      ca: `EduTicTac Commons — Guia del professorat`,
      es: `EduTicTac Commons — Guía del profesorado`
    },
    'commons.metaDescription': {
      ca: `Què és EduTicTac Commons, quins serveis inclou i com fer-los servir a l'aula, amb guia per al professorat.`,
      va: `Què és EduTicTac Commons, quins serveis inclou i com utilitzar-los en l'aula, amb guia per al professorat.`,
      es: `Qué es EduTicTac Commons, qué servicios incluye y cómo usarlos en el aula, con guía para el profesorado.`
    },
    'commons.h1': { ca: `EduTicTac Commons`, es: `EduTicTac Commons` },
    'commons.subtitle': {
      ca: `Què és, què hi trobaràs i com començar a fer-lo servir a l'aula.`,
      va: `Què és, què hi trobaràs i com començar a utilitzar-lo en l'aula.`,
      es: `Qué es, qué encontrarás y cómo empezar a usarlo en el aula.`
    },
    'commons.backHome': { ca: `Torna a la portada`, es: `Volver a la portada` },
    'commons.what.eyebrow': { ca: `El projecte`, es: `El proyecto` },
    'commons.what.title': { ca: `Què és EduTicTac Commons`, es: `Qué es EduTicTac Commons` },
    'commons.what.text': {
      ca: `EduTicTac és una comunitat de docents que treballa amb programari lliure. El Commons és el conjunt de serveis digitals que la comunitat s'autogestiona: un núvol privat per compartir fitxers, una forja per al codi, documentació col·laborativa i aplicacions educatives, sense plataformes publicitàries ni rastreig. Tot està autoallotjat i publicat amb llicències lliures.`,
      va: `EduTicTac és una comunitat de docents que treballa amb programari lliure. El Commons és el conjunt de serveis digitals que la comunitat s'autogestiona: un núvol privat per a compartir fitxers, una forja per al codi, documentació col·laborativa i aplicacions educatives, sense plataformes publicitàries ni rastreig. Tot està autoallotjat i publicat amb llicències lliures.`,
      es: `EduTicTac es una comunidad de docentes que trabaja con software libre. El Commons es el conjunto de servicios digitales que la comunidad autogestiona: una nube privada para compartir archivos, una forja para el código, documentación colaborativa y aplicaciones educativas, sin plataformas publicitarias ni rastreo. Todo está autoalojado y publicado con licencias libres.`
    },
    'commons.feature.free.title': { ca: `Lliure`, es: `Libre` },
    'commons.feature.free.desc': {
      ca: `Programari de codi obert amb llicències lliures (AGPL, MIT, Apache, EUPL).`,
      es: `Software de código abierto con licencias libres (AGPL, MIT, Apache, EUPL).`
    },
    'commons.feature.private.title': { ca: `Privat per disseny`, es: `Privado por diseño` },
    'commons.feature.private.desc': {
      ca: `Sense rastreig publicitari, fonts i recursos autoallotjats, mínim de dades personals.`,
      es: `Sin rastreo publicitario, fuentes y recursos autoalojados, mínimo de datos personales.`
    },
    'commons.feature.community.title': { ca: `Comunitari`, es: `Comunitario` },
    'commons.feature.community.desc': {
      ca: `Fet i mantingut per docents, per a la comunitat educativa.`,
      es: `Hecho y mantenido por docentes, para la comunidad educativa.`
    },
    'commons.feature.noprofiles.title': { ca: `Sense perfils d'alumnat`, es: `Sin perfiles de alumnado` },
    'commons.feature.noprofiles.desc': {
      ca: `L'alumnat accedeix amb codi i PIN, sense correu electrònic ni noms.`,
      es: `El alumnado accede con código y PIN, sin correo electrónico ni nombres.`
    },
    'commons.identity.eyebrow': { ca: `Compte comú`, es: `Cuenta común` },
    'commons.identity.title': { ca: `Una sola identitat per entrar-hi`, es: `Una sola identidad para entrar` },
    'commons.identity.text': {
      ca: `Els serveis de treball comparteixen un compte comú (Authentik, a <a href="https://id.edutictac.es/" class="text-blue-600 hover:underline transition">id.edutictac.es</a>). Amb una única contrasenya pots accedir als serveis que ja estan connectats.`,
      es: `Los servicios de trabajo comparten una cuenta común (Authentik, en <a href="https://id.edutictac.es/" class="text-blue-600 hover:underline transition">id.edutictac.es</a>). Con una única contraseña puedes acceder a los servicios que ya están conectados.`
    },
    'commons.identity.resources.title': { ca: `Banc de recursos`, es: `Banco de recursos` },
    'commons.identity.resources.desc': {
      ca: `Connectat · favorits, valoracions i panell docent amb el compte comú.`,
      es: `Conectado · favoritos, valoraciones y panel docente con la cuenta común.`
    },
    'commons.identity.forge.title': { ca: `Forja`, es: `Forja` },
    'commons.identity.forge.desc': {
      ca: `Connectat · codi font i incidències amb inici de sessió pel compte comú.`,
      es: `Conectado · código fuente e incidencias con inicio de sesión por la cuenta común.`
    },
    'commons.identity.wikimanuals.title': { ca: `Wikimanuals`, es: `Wikimanuals` },
    'commons.identity.wikimanuals.desc': {
      ca: `Connectat · documentació col·laborativa amb el compte comú.`,
      es: `Conectado · documentación colaborativa con la cuenta común.`
    },
    'commons.identity.nextcloud.title': { ca: `Nextcloud`, es: `Nextcloud` },
    'commons.identity.nextcloud.desc': {
      ca: `En camí · el núvol privat s'anirà alineant amb el compte comú.`,
      es: `En camino · la nube privada se irá alineando con la cuenta común.`
    },
    'commons.identity.blogs.title': { ca: `Blogs`, es: `Blogs` },
    'commons.identity.blogs.desc': {
      ca: `En camí · les publicacions de la comunitat s'aniran connectant.`,
      es: `En camino · las publicaciones de la comunidad se irán conectando.`
    },
    'commons.services.eyebrow': { ca: `Serveis de la comunitat`, es: `Servicios de la comunidad` },
    'commons.services.title': { ca: `Espais per trobar, publicar i compartir`, va: `Espais per a trobar, publicar i compartir`, es: `Espacios para encontrar, publicar y compartir` },
    'commons.services.text': {
      ca: `Recursos, publicacions, fitxers, documentació i codi: els serveis col·laboratius del Commons.`,
      es: `Recursos, publicaciones, archivos, documentación y código: los servicios colaborativos del Commons.`
    },
    'commons.services.resources.title': { ca: `Banc de recursos`, es: `Banco de recursos` },
    'commons.services.resources.desc': {
      ca: `Directori de jocs i activitats educatives filtrables per etapa, matèria i idioma.`,
      es: `Directorio de juegos y actividades educativas filtrables por etapa, materia e idioma.`
    },
    'commons.services.blogs.title': { ca: `Blogs`, es: `Blogs` },
    'commons.services.blogs.desc': {
      ca: `Publicacions, experiències i recursos compartits per la comunitat.`,
      es: `Publicaciones, experiencias y recursos compartidos por la comunidad.`
    },
    'commons.services.nextcloud.title': { ca: `Nextcloud`, es: `Nextcloud` },
    'commons.services.nextcloud.desc': {
      ca: `Núvol privat amb fitxers, edició col·laborativa i formularis.`,
      es: `Nube privada con archivos, edición colaborativa y formularios.`
    },
    'commons.services.wikimanuals.title': { ca: `Wikimanuals`, es: `Wikimanuals` },
    'commons.services.wikimanuals.desc': {
      ca: `Documentació col·laborativa sobre programari lliure i aula digital.`,
      es: `Documentación colaborativa sobre software libre y aula digital.`
    },
    'commons.services.forge.title': { ca: `Forja`, es: `Forja` },
    'commons.services.forge.desc': {
      ca: `Repositoris de codi (Forgejo): el codi font de les aplicacions i projectes.`,
      es: `Repositorios de código (Forgejo): el código fuente de las aplicaciones y proyectos.`
    },
    'commons.services.telegram.title': { ca: `Telegram`, es: `Telegram` },
    'commons.services.telegram.desc': {
      ca: `Canal de conversa per compartir dubtes, novetats i recursos.`,
      va: `Canal de conversa per a compartir dubtes, novetats i recursos.`,
      es: `Canal de conversación para compartir dudas, novedades y recursos.`
    },
    'commons.apps.eyebrow': { ca: `Aula i aprenentatge`, es: `Aula y aprendizaje` },
    'commons.apps.title': { ca: `Aplicacions educatives`, es: `Aplicaciones educativas` },
    'commons.apps.text': {
      ca: `Eines i activitats accessibles des del navegador per crear, jugar, programar i treballar competències digitals.`,
      va: `Ferramentes i activitats accessibles des del navegador per a crear, jugar, programar i treballar competències digitals.`,
      es: `Herramientas y actividades accesibles desde el navegador para crear, jugar, programar y trabajar competencias digitales.`
    },
    'commons.apps.eduhoot.title': { ca: `EduHoot`, es: `EduHoot` },
    'commons.apps.eduhoot.desc': {
      ca: `Joc de preguntes tipus concurs per crear activitats ràpides i participatives.`,
      va: `Joc de preguntes tipus concurs per a crear activitats ràpides i participatives.`,
      es: `Juego de preguntas tipo concurso para crear actividades rápidas y participativas.`
    },
    'commons.apps.blockly.title': { ca: `Blockly Games`, es: `Blockly Games` },
    'commons.apps.blockly.desc': {
      ca: `Jocs progressius per iniciar-se en la programació amb blocs i JavaScript.`,
      va: `Jocs progressius per a iniciar-se en la programació amb blocs i JavaScript.`,
      es: `Juegos progresivos para iniciarse en la programación con bloques y JavaScript.`
    },
    'commons.apps.jclic.title': { ca: `JClic`, es: `JClic` },
    'commons.apps.jclic.desc': {
      ca: `Biblioteca d'activitats educatives JClic accessibles des del navegador.`,
      es: `Biblioteca de actividades educativas JClic accesibles desde el navegador.`
    },
    'commons.apps.edumusic.title': { ca: `EduMusic`, es: `EduMusic` },
    'commons.apps.edumusic.desc': {
      ca: `Recursos musicals i activitats per treballar ritme, lectura i creació sonora.`,
      va: `Recursos musicals i activitats per a treballar ritme, lectura i creació sonora.`,
      es: `Recursos musicales y actividades para trabajar ritmo, lectura y creación sonora.`
    },
    'commons.apps.educraft.title': { ca: `EduCraft`, es: `EduCraft` },
    'commons.apps.educraft.desc': {
      ca: `Entorn de construcció i exploració inspirat en mons voxel.`,
      es: `Entorno de construcción y exploración inspirado en mundos voxel.`
    },
    'commons.apps.robotics.title': { ca: `Robòtica`, es: `Robótica` },
    'commons.apps.robotics.desc': {
      ca: `Simulador de micro:bit al navegador per programar i provar robots sense maquinari.`,
      va: `Simulador de micro:bit en el navegador per a programar i provar robots sense maquinari.`,
      es: `Simulador de micro:bit en el navegador para programar y probar robots sin hardware.`
    },
    'commons.guide.eyebrow': { ca: `Guia ràpida`, es: `Guía rápida` },
    'commons.guide.title': { ca: `Com començar a utilitzar-lo`, es: `Cómo empezar a usarlo` },
    'commons.guide.step1.title': { ca: `Entra al portal`, es: `Entra en el portal` },
    'commons.guide.step1.desc': {
      ca: `Des d'edutictac.es tria el servei o l'aplicació que necessites.`,
      es: `Desde edutictac.es elige el servicio o la aplicación que necesitas.`
    },
    'commons.guide.step2.title': { ca: `Inicia sessió amb el compte comú`, es: `Inicia sesión con la cuenta común` },
    'commons.guide.step2.desc': {
      ca: `Als serveis connectats, fes servir la mateixa identitat (Authentik).`,
      va: `En els serveis connectats, utilitza la mateixa identitat (Authentik).`,
      es: `En los servicios conectados, usa la misma identidad (Authentik).`
    },
    'commons.guide.step3.title': { ca: `Prepara la classe`, es: `Prepara la clase` },
    'commons.guide.step3.desc': {
      ca: `Cerca activitats al Banc de recursos, crea un qüestionari amb EduHoot o treballa la programació amb Blockly Games i Robòtica.`,
      va: `Busca activitats en el Banc de recursos, crea un qüestionari amb EduHoot o treballa la programació amb Blockly Games i Robòtica.`,
      es: `Busca actividades en el Banco de recursos, crea un cuestionario con EduHoot o trabaja la programación con Blockly Games y Robótica.`
    },
    'commons.guide.step4.title': { ca: `Dona accés a l'alumnat`, es: `Da acceso al alumnado` },
    'commons.guide.step4.desc': {
      ca: `Des del tauler del professorat genera codis i PIN per al teu grup, sense correu ni noms.`,
      es: `Desde el panel del profesorado genera códigos y PIN para tu grupo, sin correo ni nombres.`
    },
    'commons.guide.step5.title': { ca: `Fes el seguiment`, es: `Haz el seguimiento` },
    'commons.guide.step5.desc': {
      ca: `Consulta el resum de credencials i l'activitat des del tauler del professorat.`,
      es: `Consulta el resumen de credenciales y la actividad desde el panel del profesorado.`
    },
    'commons.students.eyebrow': { ca: `Alumnat`, es: `Alumnado` },
    'commons.students.title': { ca: `Com entra l'alumnat`, es: `Cómo entra el alumnado` },
    'commons.students.text': {
      ca: `L'alumnat no necessita correu electrònic ni nom real: entra amb un <strong>codi públic i un PIN</strong> que generes des del tauler. Així treballem sense recollir dades personals innecessàries.`,
      es: `El alumnado no necesita correo electrónico ni nombre real: entra con un <strong>código público y un PIN</strong> que generas desde el panel. Así trabajamos sin recoger datos personales innecesarios.`
    },
    'commons.students.teacher.title': { ca: `Tauler del professorat`, es: `Panel del profesorado` },
    'commons.students.teacher.desc': {
      ca: `Genera codis i PIN, i consulta el resum de credencials i serveis.`,
      es: `Genera códigos y PIN, y consulta el resumen de credenciales y servicios.`
    },
    'commons.students.student.title': { ca: `Tauler de l'alumnat`, es: `Panel del alumnado` },
    'commons.students.student.desc': {
      ca: `Vista de l'alumnat per entrar amb el codi i el PIN i accedir a les activitats.`,
      va: `Vista de l'alumnat per a entrar amb el codi i el PIN i accedir a les activitats.`,
      es: `Vista del alumnado para entrar con el código y el PIN y acceder a las actividades.`
    },

    /* ---------- Privacitat ---------- */
    'privacy.docTitle': {
      ca: `Política de privacitat — Comunitat EduTicTac`,
      es: `Política de privacidad — Comunidad EduTicTac`
    },
    'privacy.metaDescription': {
      ca: `Política de privacitat de les aplicacions de la Comunitat EduTicTac: quines dades demanem, per a què i com controlar-les.`,
      es: `Política de privacidad de las aplicaciones de la Comunidad EduTicTac: qué datos pedimos, para qué y cómo controlarlos.`
    },
    'privacy.h1': { ca: `Política de privacitat`, es: `Política de privacidad` },
    'privacy.subtitle': {
      ca: `Què fem amb les teves dades a les aplicacions de la Comunitat EduTicTac.`,
      va: `Què fem amb les teues dades en les aplicacions de la Comunitat EduTicTac.`,
      es: `Qué hacemos con tus datos en las aplicaciones de la Comunidad EduTicTac.`
    },
    'privacy.principles.eyebrow': { ca: `En quatre línies`, es: `En cuatro líneas` },
    'privacy.principles.title': { ca: `Principis de la comunitat`, es: `Principios de la comunidad` },
    'privacy.principle.free': {
      ca: `<strong class="text-slate-900">Programari lliure.</strong> El codi font de totes les aplicacions és públic i es pot auditar a <a class="text-blue-600 hover:underline" href="https://git.edutictac.es" target="_blank" rel="noopener">git.edutictac.es</a>.`,
      es: `<strong class="text-slate-900">Software libre.</strong> El código fuente de todas las aplicaciones es público y se puede auditar en <a class="text-blue-600 hover:underline" href="https://git.edutictac.es" target="_blank" rel="noopener">git.edutictac.es</a>.`
    },
    'privacy.principle.ads': {
      ca: `<strong class="text-slate-900">Sense publicitat ni venda de dades.</strong> No mostrem anuncis ni compartim ni venem dades a cap empresa.`,
      es: `<strong class="text-slate-900">Sin publicidad ni venta de datos.</strong> No mostramos anuncios ni compartimos ni vendemos datos a ninguna empresa.`
    },
    'privacy.principle.minimal': {
      ca: `<strong class="text-slate-900">Dades mínimes.</strong> Cada aplicació només demana el que necessita per funcionar; la majoria no demanen res.`,
      va: `<strong class="text-slate-900">Dades mínimes.</strong> Cada aplicació només demana el que necessita per a funcionar; la majoria no demanen res.`,
      es: `<strong class="text-slate-900">Datos mínimos.</strong> Cada aplicación solo pide lo que necesita para funcionar; la mayoría no piden nada.`
    },
    'privacy.principle.servers': {
      ca: `<strong class="text-slate-900">Servidors propis.</strong> Les aplicacions s'allotgen en infraestructura pròpia de la comunitat, no en serveis de tercers com Google o Firebase.`,
      es: `<strong class="text-slate-900">Servidores propios.</strong> Las aplicaciones se alojan en infraestructura propia de la comunidad, no en servicios de terceros como Google o Firebase.`
    },
    'privacy.apps.eyebrow': { ca: `Servei a servei`, es: `Servicio a servicio` },
    'privacy.apps.title': { ca: `Aplicacions`, es: `Aplicaciones` },
    'privacy.apps.resources.name': { ca: `Banc de recursos`, es: `Banco de recursos` },
    'privacy.apps.resources.p1': {
      ca: `Directori de jocs educatius. No cal crear cap compte: la identitat és anònima (una cookie tècnica sense dades personals) i s'usa només per a recordar les teves valoracions i favorits.`,
      va: `Directori de jocs educatius. No cal crear cap compte: la identitat és anònima (una cookie tècnica sense dades personals) i s'usa només per a recordar les teues valoracions i favorits.`,
      es: `Directorio de juegos educativos. No hace falta crear ninguna cuenta: la identidad es anónima (una cookie técnica sin datos personales) y se usa solo para recordar tus valoraciones y favoritos.`
    },
    'privacy.apps.resources.p2': {
      ca: `<strong class="text-slate-900">Dades:</strong> valoracions, avisos d'enllaços trencats i favorits, associats a la cookie anònima. Sense seguiment, sense publicitat, sense tercers.`,
      es: `<strong class="text-slate-900">Datos:</strong> valoraciones, reportes de enlaces rotos y favoritos, asociados a la cookie anónima. Sin seguimiento, sin publicidad, sin terceros.`
    },
    'privacy.apps.resources.license': { ca: `Programari lliure · codi a`, es: `Software libre · código en` },
    'privacy.apps.edumusic.name': { ca: `EduMusic`, es: `EduMusic` },
    'privacy.apps.edumusic.p1': {
      ca: `Jocs musicals interactius. No cal crear cap compte per a jugar.`,
      es: `Juegos musicales interactivos. No hace falta crear ninguna cuenta para jugar.`
    },
    'privacy.apps.edumusic.p2': {
      ca: `<strong class="text-slate-900">Dades:</strong> si vols aparèixer al rànquing, tries lliurement un pseudònim; només es guarda aquest nom i la puntuació, mai dades personals. Sense seguiment, sense publicitat, sense tercers.`,
      va: `<strong class="text-slate-900">Dades:</strong> si vols aparéixer en el rànquing, tries lliurement un pseudònim; només es guarda eixe nom i la puntuació, mai dades personals. Sense seguiment, sense publicitat, sense tercers.`,
      es: `<strong class="text-slate-900">Datos:</strong> si quieres aparecer en la clasificación, eliges libremente un seudónimo; solo se guarda ese nombre y la puntuación, nunca datos personales. Sin seguimiento, sin publicidad, sin terceros.`
    },
    'privacy.apps.edumusic.license': { ca: `Programari lliure · codi a`, es: `Software libre · código en` },
    'privacy.apps.eduhoot.name': { ca: `EduHoot`, es: `EduHoot` },
    'privacy.apps.eduhoot.p1': {
      ca: `Joc de preguntes tipus concurs. L'alumnat que juga no necessita cap compte: només tria un pseudònim per a aquesta partida, que desapareix en acabar.`,
      va: `Joc de preguntes tipus concurs. L'alumnat que juga no necessita cap compte: només tria un pseudònim per a eixa partida, que desapareix en acabar.`,
      es: `Juego de preguntas tipo concurso. El alumnado que juega no necesita ninguna cuenta: solo elige un seudónimo para esa partida, que desaparece al terminar.`
    },
    'privacy.apps.eduhoot.p2': {
      ca: `<strong class="text-slate-900">Dades:</strong> el professorat que crea qüestionaris té un accés propi (correu) per gestionar el seu material. Sense publicitat, sense tercers.`,
      va: `<strong class="text-slate-900">Dades:</strong> el professorat que crea qüestionaris té un accés propi (correu) per a gestionar el seu material. Sense publicitat, sense tercers.`,
      es: `<strong class="text-slate-900">Datos:</strong> el profesorado que crea cuestionarios tiene un acceso propio (correo) para gestionar su material. Sin publicidad, sin terceros.`
    },
    'privacy.apps.eduhoot.license': { ca: `Programari lliure (AGPL-3.0) · codi a`, es: `Software libre (AGPL-3.0) · código en` },
    'privacy.apps.jclic.name': { ca: `JClic`, es: `JClic` },
    'privacy.apps.jclic.p1': {
      ca: `Biblioteca d'activitats educatives. No es demana cap dada: no cal compte ni identificar-se per a fer les activitats.`,
      es: `Biblioteca de actividades educativas. No se pide ningún dato: no hace falta cuenta ni identificarse para hacer las actividades.`
    },
    'privacy.apps.jclic.license': { ca: `Programari lliure · codi a`, es: `Software libre · código en` },
    'privacy.apps.blockly.name': { ca: `Blockly Games`, es: `Blockly Games` },
    'privacy.apps.blockly.p1': {
      ca: `Jocs de programació per blocs. No cal cap compte; el progrés queda només al navegador de l'alumne.`,
      es: `Juegos de programación por bloques. No hace falta ninguna cuenta; el progreso queda solo en el navegador del alumno.`
    },
    'privacy.apps.blockly.license': { ca: `Programari lliure (Apache-2.0) · codi a`, es: `Software libre (Apache-2.0) · código en` },
    'privacy.apps.robotics.name': { ca: `Robòtica`, es: `Robótica` },
    'privacy.apps.robotics.p1': {
      ca: `Simulador de micro:bit i ESP32 al navegador. No hi ha cap servidor de dades: el progrés i el pseudònim de l'alumnat es guarden només en l'ordinador o tauleta de l'aula (<code>localStorage</code>).`,
      es: `Simulador de micro:bit y ESP32 en el navegador. No hay ningún servidor de datos: el progreso y el seudónimo del alumnado se guardan solo en el ordenador o tableta del aula (<code>localStorage</code>).`
    },
    'privacy.apps.robotics.license': { ca: `Programari lliure (MIT) · codi a`, es: `Software libre (MIT) · código en` },
    'privacy.rights.title': { ca: `Exportar o eliminar les teves dades`, va: `Exportar o eliminar les teues dades`, es: `Exportar o eliminar tus datos` },
    'privacy.rights.p1': {
      ca: `Com que la majoria d'aplicacions no et demanen cap dada personal, no hi ha res a exportar ni a eliminar. On sí que es guarda alguna cosa (valoracions o rànquings sota un pseudònim o cookie anònima), pots demanar-ne l'eliminació escrivint a la comunitat pel canal de <a class="text-blue-600 hover:underline" href="https://telegram.me/joinchat/AF9KBj1o0IXttv35k7NAug" target="_blank" rel="noopener">Telegram</a> o obrint una incidència a la <a class="text-blue-600 hover:underline" href="https://git.edutictac.es" target="_blank" rel="noopener">forja</a>.`,
      es: `Como la mayoría de aplicaciones no te piden ningún dato personal, no hay nada que exportar ni eliminar. Donde sí se guarda algo (valoraciones o clasificaciones bajo un seudónimo o cookie anónima), puedes pedir su eliminación escribiendo a la comunidad por el canal de <a class="text-blue-600 hover:underline" href="https://telegram.me/joinchat/AF9KBj1o0IXttv35k7NAug" target="_blank" rel="noopener">Telegram</a> o abriendo una incidencia en la <a class="text-blue-600 hover:underline" href="https://git.edutictac.es" target="_blank" rel="noopener">forja</a>.`
    },
    'privacy.rights.p2': {
      ca: `La documentació completa del projecte —incloent-hi la metodologia de revisió de privacitat servei a servei— és pública al repositori <a class="text-blue-600 hover:underline" href="https://git.edutictac.es/Edutictac/edutictac-commons" target="_blank" rel="noopener">edutictac-commons</a>.`,
      es: `La documentación completa del proyecto —incluida la metodología de revisión de privacidad servicio a servicio— es pública en el repositorio <a class="text-blue-600 hover:underline" href="https://git.edutictac.es/Edutictac/edutictac-commons" target="_blank" rel="noopener">edutictac-commons</a>.`
    },
    'privacy.lastReview': {
      ca: `Última revisió: setembre de 2026 · <a class="hover:underline" href="index.html">Tornar a l'inici</a>`,
      es: `Última revisión: septiembre de 2026 · <a class="hover:underline" href="index.html">Volver al inicio</a>`
    },

    /* ---------- Instal·la Commons ---------- */
    'install.docTitle': { ca: `Instal·la EduTicTac Commons`, es: `Instala EduTicTac Commons` },
    'install.metaDescription': {
      ca: `Descarrega i instal·la EduTicTac Commons en un servidor Debian o Ubuntu.`,
      es: `Descarga e instala EduTicTac Commons en un servidor Debian o Ubuntu.`
    },
    'install.eyebrow': { ca: `Instal·lació autònoma`, es: `Instalación autónoma` },
    'install.h1': { ca: `EduTicTac Commons`, es: `EduTicTac Commons` },
    'install.subtitle': {
      ca: `Instal·la al teu propi servidor un conjunt d'eines educatives lliures, amb identitat comuna, recursos, activitats i taulers per a l'aula.`,
      va: `Instal·la en el teu propi servidor un conjunt de ferramentes educatives lliures, amb identitat comuna, recursos, activitats i taulers per a l'aula.`,
      es: `Instala en tu propio servidor un conjunto de herramientas educativas libres, con identidad común, recursos, actividades y paneles para el aula.`
    },
    'install.downloadBtn': { ca: `Descarrega l'instal·lador (.deb)`, es: `Descarga el instalador (.deb)` },
    'install.backBtn': { ca: `Torna a edutictac.es`, es: `Volver a edutictac.es` },
    'install.version': { ca: `Versió actual: 0.1.1-alpha26 · Debian/Ubuntu amd64`, es: `Versión actual: 0.1.1-alpha26 · Debian/Ubuntu amd64` },
    'install.what.eyebrow': { ca: `Què instal·la`, es: `Qué instala` },
    'install.what.title': { ca: `Un Commons per al teu centre`, es: `Un Commons para tu centro` },
    'install.what.text': {
      ca: `L'instal·lador prepara un desplegament Docker gestionat per systemd. Els serveis funcionen al teu servidor i les dades queden sota el teu control, sense dependre d'una plataforma publicitària.`,
      va: `L'instal·lador prepara un desplegament Docker gestionat per systemd. Els serveis funcionen en el teu servidor i les dades queden sota el teu control, sense dependre d'una plataforma publicitària.`,
      es: `El instalador prepara un despliegue Docker gestionado por systemd. Los servicios funcionan en tu servidor y los datos quedan bajo tu control, sin depender de una plataforma publicitaria.`
    },
    'install.what.commons.title': { ca: `Commons`, es: `Commons` },
    'install.what.commons.desc': {
      ca: `Portal, identitat pseudònima, codis i PIN per a organitzar activitats.`,
      es: `Portal, identidad pseudónima, códigos y PIN para organizar actividades.`
    },
    'install.what.eduhoot.title': { ca: `EduHoot`, es: `EduHoot` },
    'install.what.eduhoot.desc': { ca: `Qüestionaris i partides participatives per a l'aula.`, es: `Cuestionarios y partidas participativas para el aula.` },
    'install.what.resources.title': { ca: `Recursos i Play`, es: `Recursos y Play` },
    'install.what.resources.desc': {
      ca: `Banc de recursos i creació d'activitats H5P senzilles.`,
      es: `Banco de recursos y creación de actividades H5P sencillas.`
    },
    'install.install.eyebrow': { ca: `Instal·lació`, es: `Instalación` },
    'install.install.title': { ca: `Com posar-lo en marxa`, es: `Cómo ponerlo en marcha` },
    'install.install.step1': {
      ca: `Utilitza un servidor Debian o Ubuntu de 64 bits amb Docker i connexió a Internet.`,
      es: `Usa un servidor Debian o Ubuntu de 64 bits con Docker y conexión a Internet.`
    },
    'install.install.step2': {
      ca: `Descarrega l'instal·lador i executa'l amb permisos d'administració:`,
      es: `Descarga el instalador y ejecútalo con permisos de administración:`
    },
    'install.install.commandLabel': { ca: `Ordre d'instal·lació`, es: `Comando de instalación` },
    'install.install.step3': {
      ca: `L'instal·lador genera els secrets, descarrega les imatges i activa el servei.`,
      es: `El instalador genera los secretos, descarga las imágenes y activa el servicio.`
    },
    'install.install.step4': {
      ca: `Obre l'adreça que mostra l'instal·lador i utilitza el codi d'activació d'un sol ús.`,
      va: `Obri l'adreça que mostra l'instal·lador i utilitza el codi d'activació d'un sol ús.`,
      es: `Abre la dirección que muestra el instalador y usa el código de activación de un solo uso.`
    },
    'install.install.step5': {
      ca: `Canvia la contrasenya inicial d'administració i comença a configurar el teu centre.`,
      es: `Cambia la contraseña inicial de administración y empieza a configurar tu centro.`
    },
    'install.download.eyebrow': { ca: `Descàrrega i actualitzacions`, es: `Descarga y actualizaciones` },
    'install.download.title': { ca: `Instal·lador més recent`, es: `Instalador más reciente` },
    'install.download.text': {
      ca: `La versió publicada actualment és <strong>0.1.1-alpha26</strong>. Pots descarregar el paquet directament o afegir el repositori signat d'EduTicTac per a rebre les properes versions des d'APT.`,
      va: `La versió publicada actualment és <strong>0.1.1-alpha26</strong>. Pots descarregar el paquet directament o afegir el repositori signat d'EduTicTac per a rebre les pròximes versions des d'APT.`,
      es: `La versión publicada actualmente es <strong>0.1.1-alpha26</strong>. Puedes descargar el paquete directamente o añadir el repositorio firmado de EduTicTac para recibir las próximas versiones desde APT.`
    },
    'install.download.btn': { ca: `Descarrega 0.1.1-alpha26 (.deb)`, es: `Descarga 0.1.1-alpha26 (.deb)` },
    'install.sourceBtn': { ca: `Consulta el codi font`, es: `Consulta el código fuente` },
    'install.apt.title': { ca: `Afegeix el repositori APT`, va: `Afig el repositori APT`, es: `Añade el repositorio APT` },
    'install.apt.text': {
      ca: `Així podràs instal·lar i actualitzar Commons amb les actualitzacions signades del projecte:`,
      es: `Así podrás instalar y actualizar Commons con las actualizaciones firmadas del proyecto:`
    },
    'install.apt.commandLabel': { ca: `Ordres del repositori APT`, es: `Comandos del repositorio APT` },
    'install.apt.updateText': {
      ca: `En instal·lacions posteriors, actualitza amb <code class="bg-slate-100 rounded px-1.5 py-0.5">sudo apt update &amp;&amp; sudo apt install --only-upgrade edutictac-commons</code>.`,
      es: `En instalaciones posteriores, actualiza con <code class="bg-slate-100 rounded px-1.5 py-0.5">sudo apt update &amp;&amp; sudo apt install --only-upgrade edutictac-commons</code>.`
    },
    'install.how.eyebrow': { ca: `Funcionament`, es: `Funcionamiento` },
    'install.how.title': { ca: `Què passa després`, es: `Qué pasa después` },
    'install.how.step1.title': { ca: `1. Identitat comuna`, es: `1. Identidad común` },
    'install.how.step1.desc': {
      ca: `El professorat inicia sessió amb un compte comú en els serveis connectats.`,
      es: `El profesorado inicia sesión con una cuenta común en los servicios conectados.`
    },
    'install.how.step2.title': { ca: `2. Aula sense perfils`, es: `2. Aula sin perfiles` },
    'install.how.step2.desc': {
      ca: `L'alumnat entra amb un codi i un PIN, sense haver d'utilitzar correu ni nom real.`,
      es: `El alumnado entra con un código y un PIN, sin tener que usar correo ni nombre real.`
    },
    'install.how.step3.title': { ca: `3. Dades locals`, es: `3. Datos locales` },
    'install.how.step3.desc': {
      ca: `Les bases de dades, activitats i còpies es guarden en el servidor del centre.`,
      es: `Las bases de datos, actividades y copias se guardan en el servidor del centro.`
    },
    'install.req.title': { ca: `Abans d'instal·lar`, es: `Antes de instalar` },
    'install.req.1': {
      ca: `Servidor Debian/Ubuntu amd64 amb almenys 2 GB de RAM lliures.`,
      es: `Servidor Debian/Ubuntu amd64 con al menos 2 GB de RAM libres.`
    },
    'install.req.2': {
      ca: `Docker Engine, Docker Compose v2 i accés de sortida a Internet.`,
      va: `Docker Engine, Docker Compose v2 i accés d'eixida a Internet.`,
      es: `Docker Engine, Docker Compose v2 y acceso de salida a Internet.`
    },
    'install.req.3': {
      ca: `Els ports 80, 8084, 8086, 8090, 9000 i 9443 han d'estar disponibles.`,
      es: `Los puertos 80, 8084, 8086, 8090, 9000 y 9443 deben estar disponibles.`
    },
    'install.req.4': {
      ca: `Per a utilitzar-lo fora de la xarxa local, configura HTTPS i un proxy invers.`,
      es: `Para usarlo fuera de la red local, configura HTTPS y un proxy inverso.`
    },
    'install.footer': {
      ca: `Codi i documentació: <a href="https://git.edutictac.es/Edutictac/edutictac-commons" class="text-blue-600 hover:underline">repositori d'EduTicTac Commons</a>.`,
      es: `Código y documentación: <a href="https://git.edutictac.es/Edutictac/edutictac-commons" class="text-blue-600 hover:underline">repositorio de EduTicTac Commons</a>.`
    },

    /* ---------- EduTicTac Link ---------- */
    'link.docTitle': {
      ca: `EduTicTac Link — Maquinari educatiu amb Scratch i Blocs`,
      es: `EduTicTac Link — Hardware educativo con Scratch y Blocs`
    },
    'link.metaDescription': {
      ca: `Connecta el micro:bit (i altre maquinari) amb Scratch i EduTicTac Blocs des de Linux, sense Scratch Link de Windows/macOS.`,
      es: `Conecta el micro:bit (y otro hardware) con Scratch y EduTicTac Blocs desde Linux, sin Scratch Link de Windows/macOS.`
    },
    'link.eyebrow': { ca: `Maquinari educatiu`, es: `Hardware educativo` },
    'link.h1': { ca: `EduTicTac Link`, es: `EduTicTac Link` },
    'link.subtitle': {
      ca: `Connecta el <strong>micro:bit</strong> amb <strong>EduTicTac Blocs</strong> i Scratch des de Linux, sense dependre de l'aplicació Scratch Link de Windows/macOS.`,
      es: `Conecta el <strong>micro:bit</strong> con <strong>EduTicTac Blocs</strong> y Scratch desde Linux, sin depender de la aplicación Scratch Link de Windows/macOS.`
    },
    'link.openBlocs': { ca: `Obre EduTicTac Blocs`, va: `Obri EduTicTac Blocs`, es: `Abre EduTicTac Blocs` },
    'link.backBtn': { ca: `Torna a edutictac.es`, es: `Volver a edutictac.es` },
    'link.what.eyebrow': { ca: `Què és`, es: `Qué es` },
    'link.what.title': { ca: `Scratch i maquinari, de manera lliure`, es: `Scratch y hardware, de forma libre` },
    'link.what.p1': {
      ca: `Scratch Link és l'aplicació que connecta Scratch amb plaques i robots per Bluetooth, però només s'ofereix per a Windows i macOS. EduTicTac Link és una alternativa lliure per a Linux (Debian, Ubuntu, LliureX i derivats) que connecta el micro:bit —i, de manera experimental, LEGO EV3— amb Scratch i EduTicTac Blocs.`,
      va: `Scratch Link és l'aplicació que connecta Scratch amb plaques i robots per Bluetooth, però només s'oferix per a Windows i macOS. EduTicTac Link és una alternativa lliure per a Linux (Debian, Ubuntu, LliureX i derivats) que connecta el micro:bit —i, de manera experimental, LEGO EV3— amb Scratch i EduTicTac Blocs.`,
      es: `Scratch Link es la aplicación que conecta Scratch con placas y robots por Bluetooth, pero solo se ofrece para Windows y macOS. EduTicTac Link es una alternativa libre para Linux (Debian, Ubuntu, LliureX y derivados) que conecta el micro:bit —y, de forma experimental, LEGO EV3— con Scratch y EduTicTac Blocs.`
    },
    'link.what.p2': {
      ca: `Hi ha <strong>dos camins</strong>. Tots dos funcionen; el primer no requereix instal·lar res.`,
      va: `Hi ha <strong>dos camins</strong>. Tots dos funcionen; el primer no requerix instal·lar res.`,
      es: `Hay <strong>dos caminos</strong>. Ambos funcionan; el primero no requiere instalar nada.`
    },
    'link.optionA.eyebrow': { ca: `Opció A · recomanada`, es: `Opción A · recomendada` },
    'link.optionA.title': { ca: `Sense instal·lar res (només navegador)`, es: `Sin instalar nada (solo navegador)` },
    'link.optionA.p1': {
      ca: `Amb <strong>EduTicTac Blocs</strong> i un navegador Chromium (Chrome o Edge), la connexió es fa directament pel navegador (Web Bluetooth). No cal instal·lar cap programa.`,
      es: `Con <strong>EduTicTac Blocs</strong> y un navegador Chromium (Chrome o Edge), la conexión se hace directamente por el navegador (Web Bluetooth). No hace falta instalar ningún programa.`
    },
    'link.optionA.step1': {
      ca: `Utilitza <strong>Chrome o Edge</strong>. (A Linux, activa Web Bluetooth a <code class="bg-slate-100 rounded px-1.5 py-0.5">chrome://flags</code>: «Web Bluetooth» i «Experimental Web Platform Features».)`,
      es: `Usa <strong>Chrome o Edge</strong>. (En Linux, activa Web Bluetooth en <code class="bg-slate-100 rounded px-1.5 py-0.5">chrome://flags</code>: «Web Bluetooth» y «Experimental Web Platform Features».)`
    },
    'link.optionA.step2': {
      ca: `Obre <a href="https://blocs.edutictac.es" class="text-blue-600 hover:underline">blocs.edutictac.es</a>, prem <strong>Afegeix una extensió</strong> i tria <strong>micro:bit (Bluetooth)</strong>.`,
      va: `Obri <a href="https://blocs.edutictac.es" class="text-blue-600 hover:underline">blocs.edutictac.es</a>, prem <strong>Afig una extensió</strong> i tria <strong>micro:bit (Bluetooth)</strong>.`,
      es: `Abre <a href="https://blocs.edutictac.es" class="text-blue-600 hover:underline">blocs.edutictac.es</a>, pulsa <strong>Añadir una extensión</strong> y elige <strong>micro:bit (Bluetooth)</strong>.`
    },
    'link.optionA.step3': {
      ca: `Arrossega el bloc <strong>connecta el micro:bit</strong>, fes-hi clic i tria la placa al diàleg.`,
      va: `Arrossega el bloc <strong>connecta el micro:bit</strong>, fes clic damunt i tria la placa en el diàleg.`,
      es: `Arrastra el bloque <strong>conecta el micro:bit</strong>, haz clic sobre él y elige la placa en el diálogo.`
    },
    'link.optionA.step4': {
      ca: `Ja pots fer servir els blocs (botons, inclinació, pantalla, gestos...).`,
      va: `Ja pots utilitzar els blocs (botons, inclinació, pantalla, gestos...).`,
      es: `Ya puedes usar los bloques (botones, inclinación, pantalla, gestos...).`
    },
    'link.optionA.note': {
      ca: `<strong>Important:</strong> el navegador ha d'estar en el <strong>mateix ordinador</strong> on està connectat el micro:bit, i la placa ha de tenir el <strong>firmware de Scratch</strong> (vegeu més avall). Amb Firefox aquest camí no està disponible.`,
      va: `<strong>Important:</strong> el navegador ha d'estar en el <strong>mateix ordinador</strong> on està connectat el micro:bit, i la placa ha de tindre el <strong>firmware de Scratch</strong> (vegeu més avall). En Firefox este camí no està disponible.`,
      es: `<strong>Importante:</strong> el navegador debe estar en el <strong>mismo ordenador</strong> donde está conectado el micro:bit, y la placa debe tener el <strong>firmware de Scratch</strong> (ver más abajo). En Firefox este camino no está disponible.`
    },
    'link.optionB.eyebrow': { ca: `Opció B · avançada`, es: `Opción B · avanzada` },
    'link.optionB.title': { ca: `Instal·lar el daemon (Firefox i Chromium)`, es: `Instalar el daemon (Firefox y Chromium)` },
    'link.optionB.p1': {
      ca: `El daemon <strong>edutictac-link</strong> funciona en segon pla i connecta el micro:bit amb Scratch o Blocs igual que ho faria Scratch Link. Funciona també amb <strong>Firefox</strong> i descobreix la placa automàticament. Disponible com a paquet <code class="bg-slate-100 rounded px-1.5 py-0.5">.deb</code> signat.`,
      va: `El daemon <strong>edutictac-link</strong> funciona en segon pla i connecta el micro:bit amb Scratch o Blocs igual que ho faria Scratch Link. Funciona també amb <strong>Firefox</strong> i descobrix la placa automàticament. Disponible com a paquet <code class="bg-slate-100 rounded px-1.5 py-0.5">.deb</code> signat.`,
      es: `El daemon <strong>edutictac-link</strong> funciona en segundo plano y conecta el micro:bit con Scratch o Blocs igual que lo haría Scratch Link. Funciona también con <strong>Firefox</strong> y descubre la placa automáticamente. Disponible como paquete <code class="bg-slate-100 rounded px-1.5 py-0.5">.deb</code> firmado.`
    },
    'link.optionB.check': { ca: `Comprova l'entorn i inicia'l:`, va: `Comprova l'entorn i arranca'l:`, es: `Comprueba el entorno y arráncalo:` },
    'link.usageLabel': { ca: `Ús`, es: `Uso` },
    'link.optionB.p2': {
      ca: `Després, en EduTicTac Blocs o Scratch, afegeix l'extensió <strong>micro:bit</strong> (la de Scratch) i connecta. El daemon pot quedar-se com a servei d'usuari: <code class="bg-slate-100 rounded px-1.5 py-0.5">systemctl --user enable --now edutictac-link</code>.`,
      va: `Després, en EduTicTac Blocs o Scratch, afig l'extensió <strong>micro:bit</strong> (la de Scratch) i connecta. El daemon pot quedar-se com a servei d'usuari: <code class="bg-slate-100 rounded px-1.5 py-0.5">systemctl --user enable --now edutictac-link</code>.`,
      es: `Después, en EduTicTac Blocs o Scratch, añade la extensión <strong>micro:bit</strong> (la de Scratch) y conecta. El daemon puede quedarse como servicio de usuario: <code class="bg-slate-100 rounded px-1.5 py-0.5">systemctl --user enable --now edutictac-link</code>.`
    },
    'link.firmware.title': { ca: `El micro:bit necessita el firmware de Scratch`, es: `El micro:bit necesita el firmware de Scratch` },
    'link.firmware.p1': {
      ca: `Perquè la placa parli amb Scratch o Blocs cal gravar-li el firmware de Scratch:`,
      va: `Perquè la placa parle amb Scratch o Blocs cal gravar-li el firmware de Scratch:`,
      es: `Para que la placa hable con Scratch o Blocs hay que grabarle el firmware de Scratch:`
    },
    'link.firmware.step1': {
      ca: `Descarrega <a href="https://blocs.edutictac.es/microbit/scratch-microbit-1.2.0.hex" class="text-blue-600 hover:underline">scratch-microbit-1.2.0.hex</a>.`,
      es: `Descarga <a href="https://blocs.edutictac.es/microbit/scratch-microbit-1.2.0.hex" class="text-blue-600 hover:underline">scratch-microbit-1.2.0.hex</a>.`
    },
    'link.firmware.step2': {
      ca: `Connecta el micro:bit per USB: apareixerà una unitat anomenada <strong>MICROBIT</strong>.`,
      es: `Conecta el micro:bit por USB: aparecerá una unidad llamada <strong>MICROBIT</strong>.`
    },
    'link.firmware.step3': {
      ca: `Copia el fitxer <code class="bg-white rounded px-1.5 py-0.5">.hex</code> a aquesta unitat. La placa es reiniciarà i mostrarà un nom de 5 caràcters (p. ex. <em>petov</em>).`,
      va: `Copia el fitxer <code class="bg-white rounded px-1.5 py-0.5">.hex</code> a eixa unitat. La placa es reiniciarà i mostrarà un nom de 5 caràcters (p. ex. <em>petov</em>).`,
      es: `Copia el archivo <code class="bg-white rounded px-1.5 py-0.5">.hex</code> a esa unidad. La placa se reiniciará y mostrará un nombre de 5 caracteres (p. ej. <em>petov</em>).`
    },
    'link.firmware.p2': {
      ca: `Si veus una <strong>cara trista</strong> a la matriu, és normal: el firmware la mostra quan està desconnectat. En connectar, canvia.`,
      es: `Si ves una <strong>cara triste</strong> en la matriz, es normal: el firmware la muestra cuando está desconectado. Al conectar, cambia.`
    },
    'link.more.title': { ca: `Més informació`, es: `Más información` },
    'link.more.sourceBtn': { ca: `Codi font i documentació`, es: `Código fuente y documentación` },
    'link.more.packagesBtn': { ca: `Paquets EduTicTac`, es: `Paquetes EduTicTac` },
    'link.footer': {
      ca: `Codi i documentació: <a href="https://git.edutictac.es/Edutictac/edutictac-link" class="text-blue-600 hover:underline">repositori d'EduTicTac Link</a> · <a href="privacitat.html" class="text-blue-600 hover:underline">Privacitat</a> · <a href="index.html" class="text-blue-600 hover:underline">edutictac.es</a>`,
      es: `Código y documentación: <a href="https://git.edutictac.es/Edutictac/edutictac-link" class="text-blue-600 hover:underline">repositorio de EduTicTac Link</a> · <a href="privacitat.html" class="text-blue-600 hover:underline">Privacidad</a> · <a href="index.html" class="text-blue-600 hover:underline">edutictac.es</a>`
    }
  };

  function isSupported(lang) {
    return SUPPORTED.indexOf(lang) !== -1;
  }

  function detectLang() {
    var saved = null;
    try {
      saved = window.localStorage.getItem(STORAGE_KEY);
    } catch (error) {
      saved = null;
    }
    if (saved && isSupported(saved)) return saved;

    var nav = '';
    if (window.navigator) {
      nav = (window.navigator.language || window.navigator.userLanguage || '').toLowerCase();
    }
    if (nav.indexOf('valencia') !== -1) return 'va';
    if (nav.indexOf('es') === 0) return 'es';
    return DEFAULT_LANG;
  }

  function t(lang, key) {
    var entry = TRANSLATIONS[key];
    if (!entry) return undefined;
    if (typeof entry[lang] === 'string') return entry[lang];
    if (lang === 'va' && typeof entry.ca === 'string') return entry.ca;
    return entry[DEFAULT_LANG];
  }

  function setAttributeFromKey(node, attribute, key, lang) {
    var value = t(lang, key);
    if (typeof value === 'string') node.setAttribute(attribute, value);
  }

  var ATTRIBUTE_BINDINGS = [
    ['data-i18n-aria-label', 'aria-label'],
    ['data-i18n-placeholder', 'placeholder'],
    ['data-i18n-title', 'title'],
    ['data-i18n-content', 'content']
  ];

  function apply(lang) {
    if (!isSupported(lang)) lang = DEFAULT_LANG;

    var nodes = document.querySelectorAll('[data-i18n]');
    for (var i = 0; i < nodes.length; i++) {
      var text = t(lang, nodes[i].getAttribute('data-i18n'));
      if (typeof text === 'string') nodes[i].textContent = text;
    }

    nodes = document.querySelectorAll('[data-i18n-html]');
    for (var j = 0; j < nodes.length; j++) {
      var html = t(lang, nodes[j].getAttribute('data-i18n-html'));
      if (typeof html === 'string') nodes[j].innerHTML = html;
    }

    for (var b = 0; b < ATTRIBUTE_BINDINGS.length; b++) {
      var binding = ATTRIBUTE_BINDINGS[b];
      var bound = document.querySelectorAll('[' + binding[0] + ']');
      for (var k = 0; k < bound.length; k++) {
        setAttributeFromKey(bound[k], binding[1], bound[k].getAttribute(binding[0]), lang);
      }
    }

    var buttons = document.querySelectorAll('[data-lang]');
    for (var m = 0; m < buttons.length; m++) {
      var pressed = buttons[m].getAttribute('data-lang') === lang;
      buttons[m].setAttribute('aria-pressed', String(pressed));
    }

    document.documentElement.lang = HTML_LANG[lang];
    document.documentElement.setAttribute('data-lang-code', lang);
    document.documentElement.classList.remove('i18n-pending');
  }

  function setLang(lang) {
    if (!isSupported(lang)) lang = DEFAULT_LANG;
    try {
      window.localStorage.setItem(STORAGE_KEY, lang);
    } catch (error) {
      /* El canvi d'idioma funciona igualment sense persistir-lo. */
    }
    apply(lang);
    document.dispatchEvent(new CustomEvent('edutictac:langchange', { detail: { lang: lang } }));
  }

  function init() {
    document.querySelectorAll('[data-lang]').forEach(function (button) {
      button.addEventListener('click', function () {
        setLang(button.getAttribute('data-lang'));
      });
    });
    apply(detectLang());
  }

  window.EduTicTacI18n = {
    detectLang: detectLang,
    getLang: function () {
      var code = document.documentElement.getAttribute('data-lang-code');
      return isSupported(code) ? code : DEFAULT_LANG;
    },
    apply: apply,
    setLang: setLang,
    t: t
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
