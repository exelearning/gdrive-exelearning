import type { Messages } from '../index';

// Translated from en.ts by an AI assistant; pending review by a native speaker.
const es: Messages = {
  'home.brandSuffix': 'para Google Drive',
  'home.nav.site': 'eXeLearning.net',
  'home.nav.source': 'Código fuente',
  'home.title': 'Edita proyectos de eXeLearning en Google Drive',
  'home.lead':
    'Abre, edita y guarda archivos .elpx desde Drive, en tu navegador. Tus archivos nunca salen de tu Drive.',
  'home.connect': 'Conectar Google Drive',
  'home.connectHint':
    'Añade eXeLearning al menú “Abrir con” de Drive. Gratis y de código abierto.',
  'home.connected': 'Conectado a Google Drive',
  'home.openDrive': 'Abrir Google Drive',
  'home.newProject': 'Nuevo proyecto en Drive',
  'home.howItWorks': 'Cómo funciona',
  'home.step1.title': 'Conecta una vez',
  'home.step1.body':
    'Inicia sesión con Google y permite que eXeLearning abra los archivos que elijas. No ve nada más de tu Drive.',
  'home.step2.title': 'Abre desde Drive',
  'home.step2.body':
    'Haz clic derecho en cualquier archivo .elpx y elige {openWith}. Para empezar de cero: Nuevo → Más → eXeLearning.',
  'home.step2.openWith': 'Abrir con → eXeLearning',
  'home.menu.preview': 'Vista previa',
  'home.menu.openWith': 'Abrir con',
  'home.menu.download': 'Descargar',
  'home.step3.title': 'Edita, guarda, comparte',
  'home.step3.body':
    'Guarda en Drive con un clic. Comparte un enlace de solo lectura para que el alumnado abra el proyecto sin cuenta de Google.',
  'home.check.title': 'Comprobación del sistema',
  'home.check.clientOk': 'Cliente de Google configurado',
  'home.check.clientMissing': 'Falta VITE_GOOGLE_CLIENT_ID',
  'home.check.editorChecking': 'Comprobando el editor…',
  'home.check.editorReady': 'Editor listo',
  'home.check.editorMissing': 'Editor no encontrado en {path}',
  'home.check.notConnected': 'No conectado a Google Drive',
  'home.check.requesting': 'Solicitando autorización…',
  'home.footer.tagline':
    'eXeLearning para Google Drive · gratis y de código abierto',
  'home.footer.privacy': 'Política de privacidad',
  'home.footer.terms': 'Condiciones del servicio',
  'home.language': 'Idioma',

  'toolbar.back': 'Volver a Google Drive',
  'toolbar.authorizeOpen': 'Autorizar y abrir',
  'toolbar.authorizeCreate': 'Autorizar y crear',
  'toolbar.share': 'Compartir enlace público',
  'toolbar.shareUnavailable':
    'Los enlaces públicos no están configurados en este despliegue.',
  'toolbar.save': 'Guardar en Drive',
  'toolbar.edit': 'Editar en eXeLearning',
  'toolbar.cannotEdit':
    'No tienes permiso para editar este archivo en Google Drive.',
  'toolbar.editorAria': 'Editor de eXeLearning',
  'toolbar.viewerAria': 'Visor de eXeLearning',

  'status.connecting': 'Conectando con Google Drive…',
  'status.clickAuthorizeOpen': 'Pulsa “Autorizar y abrir” para continuar.',
  'status.clickAuthorizePreview':
    'Pulsa “Autorizar y abrir” para previsualizar este archivo.',
  'status.clickAuthorizeCreate': 'Pulsa “Autorizar y crear” para continuar.',
  'status.requestingAuth': 'Solicitando autorización de Google…',
  'status.fetchingMetadata': 'Obteniendo metadatos de Google Drive…',
  'status.loadingTemplate': 'Cargando plantilla .elpx en blanco…',
  'status.creatingFile': 'Creando archivo en Google Drive…',
  'status.loadingEditor': 'Cargando el editor de eXeLearning…',
  'status.openingEditor': 'Abriendo el editor…',
  'status.opening': 'Abriendo…',
  'status.opened': 'Abierto.',
  'status.openedReadOnly': 'Abierto en modo de solo lectura.',
  'status.openedLegacy':
    'Archivo antiguo abierto. Al guardar se creará un nuevo .elpx en la misma carpeta.',
  'status.created': 'Creado.',
  'status.unsaved': 'Cambios sin guardar.',
  'status.requestingSave': 'Solicitando el .elpx actualizado al editor…',
  'status.checkingRemote': 'Comprobando cambios remotos…',
  'status.saveCancelled': 'Guardado cancelado.',
  'status.saved': 'Guardado en Google Drive.',
  'status.readingPackage': 'Leyendo el paquete…',
  'status.previewLoaded': 'Vista previa cargada.',
  'status.legacyFile': 'Archivo antiguo: pulsa Editar para migrarlo.',
  'status.fetchingPublic': 'Obteniendo de Google Drive…',
  'status.downloading': 'Descargando…',
  'status.loaded': 'Cargado.',
  'status.sharing': 'Compartiendo con cualquier persona con el enlace…',
  'status.linkReady': 'Enlace público listo.',

  'saving.title': 'Guardando en Drive…',
  'saving.hint': 'Espera mientras se guarda el archivo.',
  'saving.failed': 'Error al guardar',
  'common.close': 'Cerrar',
  'conflict.changed':
    '“{filename}” ha cambiado en Google Drive desde que se abrió.\n\nPulsa Aceptar para sobrescribir el archivo de Drive, o Cancelar para elegir otra opción.',
  'conflict.saveCopy':
    '¿Guardar el contenido del editor como una copia nueva? Pulsa Cancelar para no guardar.',

  'share.title': 'Compartir “{filename}”',
  'share.generalAccess': 'Acceso general',
  'share.restricted': 'Restringido',
  'share.restrictedHint':
    'Solo pueden abrirlo las personas con acceso en Google Drive.',
  'share.calloutLead':
    'Un enlace público lo cambia a “Cualquier persona con el enlace” como lector en Google Drive.',
  'share.calloutBody':
    'Cualquier persona de Internet que tenga el enlace podrá ver el proyecto y descargar el archivo .elpx, sin cuenta de Google.',
  'share.cancel': 'Cancelar',
  'share.create': 'Crear enlace público',
  'share.sharing': 'Compartiendo…',
  'share.anyone': 'Cualquier persona con el enlace',
  'share.anyoneHint':
    'Cualquier persona de Internet con el enlace puede verlo. No hace falta iniciar sesión.',
  'share.viewer': 'Lector',
  'share.linkLabel': 'Enlace público para el alumnado',
  'share.copy': 'Copiar enlace',
  'share.copied': 'Copiado',
  'share.stopHint':
    'Para dejar de compartir, vuelve a poner el acceso general en Restringido en Google Drive.',
  'share.manage': 'Gestionar en Google Drive',
  'share.done': 'Hecho',
  'share.errorTitle': 'No se pudo crear el enlace público',
  'share.errorLead': 'Google Drive rechazó el cambio.',
  'share.workspaceHint':
    'Puede que el administrador de tu Google Workspace restrinja “Cualquier persona con el enlace”. Aun así puedes compartir el archivo con personas de tu dominio desde Google Drive; lo abren con Abrir con → eXeLearning.',

  'viewer.errorTitle': 'No se pudo abrir este archivo',
  'viewer.legacyClickEdit': 'Pulsa Editar para abrirlo en el editor.',
  'viewer.legacyUnsupported':
    'Este archivo es de una versión antigua de eXeLearning y no se puede previsualizar.',
  'viewer.packageUnreadable': 'No se pudo leer el paquete.',
  'viewer.invalidPackage':
    'No se pudo leer el archivo como un paquete válido de eXeLearning.',
  'viewer.noIndex': 'El paquete no contiene un index.html.',
  'viewer.notShared':
    'Este archivo no está compartido públicamente (“Cualquier persona con el enlace”) o ya no existe en Google Drive.',
  'viewer.downloadForbidden': 'Google Drive no permite descargar “{name}”.',

  'error.missingClientId':
    'Falta VITE_GOOGLE_CLIENT_ID. Configúralo en tu entorno antes de usar Google Drive.',
  'error.publicLinksNotConfigured':
    'Los enlaces públicos no están configurados en este despliegue (falta VITE_GOOGLE_API_KEY).',
  'error.gisNotLoaded': 'Google Identity Services no está cargado.',
  'error.gisNoToken':
    'Google Identity Services no devolvió un token de acceso.',
  'error.gisTimeout':
    'Tiempo de espera agotado al cargar Google Identity Services.',
  'error.gisNoOauth':
    'Google Identity Services se cargó, pero OAuth no está disponible.',
  'error.gisLoadFailed': 'No se pudo cargar Google Identity Services.',
  'error.missingState': 'Falta el estado de Google Drive.',
  'error.invalidState': 'El estado de Google Drive no es válido.',
  'error.stateNoIds':
    'El estado de apertura de Google Drive debe incluir al menos un id de archivo.',
  'error.stateIdsStrings':
    'Los ids de archivo de Google Drive deben ser cadenas.',
  'error.resourceKeysObject':
    'Las claves de recurso de Google Drive deben ser un objeto.',
  'error.resourceKeysStrings':
    'Los valores de las claves de recurso de Google Drive deben ser cadenas.',
  'error.openOnly':
    'Este punto de entrada solo admite acciones de apertura de Google Drive.',
  'error.createOnly':
    'Este punto de entrada solo admite acciones de creación de Google Drive.',
  'error.missingFileId': 'Falta fileId en el enlace público.',
  'error.invalidFileId': 'El fileId del enlace público no es válido.',
  'error.readOnlyFile':
    'Este archivo de Google Drive es de solo lectura y no se puede sobrescribir.',
  'error.driveFailed': 'La petición a Google Drive falló.',
  'error.missingContent': 'Falta el contenido del archivo de Drive.',
  'error.noUploadSession':
    'Drive no devolvió una URL de sesión de subida reanudable.',
  'error.swUnavailable':
    'Los Service Workers no están disponibles en este contexto del navegador.',
  'error.swInactive': 'El Service Worker de eXeLearning no está activo.',
  'error.swRejected': 'El Service Worker rechazó el mensaje.',
  'error.notZip': 'No es un archivo ZIP',
  'error.zipDecode': 'Fallo al descomprimir el ZIP',
  'error.tooManyEntries': 'El paquete tiene más de {max} entradas',
  'error.unsafeEntry': 'Ruta de entrada no segura: {name}',
  'error.packageTooLarge':
    'El paquete supera el límite de tamaño comprimido ({size} > {max})',
  'error.decompressedTooLarge':
    'El paquete descomprimido supera el límite ({size} > {max})',
  'error.editorNotReady': 'El editor de eXeLearning aún no está listo.',
  'error.editorFrameMissing': 'El iframe del editor no está disponible.',
  'error.savePayloadNoBytes':
    'El editor devolvió un guardado sin datos binarios.',
};

export default es;
