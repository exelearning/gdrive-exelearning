import type { Messages } from '../index';

// Translated from en.ts by an AI assistant; pending review by a native speaker.
const gl: Messages = {
  'home.brandSuffix': 'para Google Drive',
  'home.nav.site': 'eXeLearning.net',
  'home.nav.source': 'Código fonte',
  'home.title': 'Edita proxectos de eXeLearning en Google Drive',
  'home.lead':
    'Abre, edita e garda ficheiros .elpx desde Drive, no teu navegador. Os teus ficheiros nunca saen do teu Drive.',
  'home.connect': 'Conectar Google Drive',
  'home.connectHint':
    'Engade eXeLearning ao menú “Abrir con” de Drive. Gratuíto e de código aberto.',
  'home.connected': 'Conectado a Google Drive',
  'home.openDrive': 'Abrir Google Drive',
  'home.newProject': 'Novo proxecto en Drive',
  'home.howItWorks': 'Como funciona',
  'home.step1.title': 'Conecta unha vez',
  'home.step1.body':
    'Inicia sesión con Google e permite que eXeLearning abra os ficheiros que escollas. Non ve nada máis do teu Drive.',
  'home.step2.title': 'Abre desde Drive',
  'home.step2.body':
    'Fai clic dereito en calquera ficheiro .elpx e escolle {openWith}. Para comezar de cero: Novo → Máis → eXeLearning.',
  'home.step2.openWith': 'Abrir con → eXeLearning',
  'home.menu.preview': 'Vista previa',
  'home.menu.openWith': 'Abrir con',
  'home.menu.download': 'Descargar',
  'home.step3.title': 'Edita, garda, comparte',
  'home.step3.body':
    'Garda en Drive cun clic. Comparte unha ligazón de só lectura para que o alumnado abra o proxecto sen conta de Google.',
  'home.check.title': 'Comprobación do sistema',
  'home.check.clientOk': 'Cliente de Google configurado',
  'home.check.clientMissing': 'Falta VITE_GOOGLE_CLIENT_ID',
  'home.check.editorChecking': 'Comprobando o editor…',
  'home.check.editorReady': 'Editor listo',
  'home.check.editorMissing': 'Non se atopou o editor en {path}',
  'home.check.notConnected': 'Non conectado a Google Drive',
  'home.check.requesting': 'Solicitando autorización…',
  'home.footer.tagline':
    'eXeLearning para Google Drive · gratuíto e de código aberto',
  'home.footer.privacy': 'Política de privacidade',
  'home.footer.terms': 'Condicións do servizo',
  'home.language': 'Idioma',

  'toolbar.back': 'Volver a Google Drive',
  'toolbar.authorizeOpen': 'Autorizar e abrir',
  'toolbar.authorizeCreate': 'Autorizar e crear',
  'toolbar.share': 'Compartir ligazón pública',
  'toolbar.shareUnavailable':
    'As ligazóns públicas non están configuradas neste despregamento.',
  'toolbar.save': 'Gardar en Drive',
  'toolbar.edit': 'Editar en eXeLearning',
  'toolbar.cannotEdit':
    'Non tes permiso para editar este ficheiro en Google Drive.',
  'toolbar.editorAria': 'Editor de eXeLearning',
  'toolbar.viewerAria': 'Visor de eXeLearning',

  'status.connecting': 'Conectando con Google Drive…',
  'status.clickAuthorizeOpen': 'Preme “Autorizar e abrir” para continuar.',
  'status.clickAuthorizePreview':
    'Preme “Autorizar e abrir” para previsualizar este ficheiro.',
  'status.clickAuthorizeCreate': 'Preme “Autorizar e crear” para continuar.',
  'status.requestingAuth': 'Solicitando autorización de Google…',
  'status.fetchingMetadata': 'Obtendo metadatos de Google Drive…',
  'status.loadingTemplate': 'Cargando o modelo .elpx en branco…',
  'status.creatingFile': 'Creando o ficheiro en Google Drive…',
  'status.loadingEditor': 'Cargando o editor de eXeLearning…',
  'status.openingEditor': 'Abrindo o editor…',
  'status.opening': 'Abrindo…',
  'status.opened': 'Aberto.',
  'status.openedReadOnly': 'Aberto en modo de só lectura.',
  'status.openedLegacy':
    'Ficheiro antigo aberto. Ao gardar crearase un novo .elpx no mesmo cartafol.',
  'status.created': 'Creado.',
  'status.unsaved': 'Cambios sen gardar.',
  'status.requestingSave': 'Solicitando o .elpx actualizado ao editor…',
  'status.checkingRemote': 'Comprobando cambios remotos…',
  'status.saveCancelled': 'Gardado cancelado.',
  'status.saved': 'Gardado en Google Drive.',
  'status.readingPackage': 'Lendo o paquete…',
  'status.previewLoaded': 'Vista previa cargada.',
  'status.legacyFile': 'Ficheiro antigo: preme Editar para migralo.',
  'status.fetchingPublic': 'Obtendo de Google Drive…',
  'status.downloading': 'Descargando…',
  'status.loaded': 'Cargado.',
  'status.sharing': 'Compartindo con calquera persoa coa ligazón…',
  'status.linkReady': 'Ligazón pública lista.',

  'saving.title': 'Gardando en Drive…',
  'saving.hint': 'Agarda mentres se garda o ficheiro.',
  'saving.failed': 'Erro ao gardar',
  'common.close': 'Pechar',
  'conflict.changed':
    '“{filename}” cambiou en Google Drive desde que se abriu.\n\nPreme Aceptar para sobrescribir o ficheiro de Drive, ou Cancelar para escoller outra opción.',
  'conflict.saveCopy':
    'Gardar o contido do editor como unha copia nova? Preme Cancelar para non gardar.',

  'share.title': 'Compartir “{filename}”',
  'share.generalAccess': 'Acceso xeral',
  'share.restricted': 'Restrinxido',
  'share.restrictedHint':
    'Só poden abrilo as persoas con acceso en Google Drive.',
  'share.calloutLead':
    'Unha ligazón pública cámbiao a “Calquera persoa coa ligazón” como lector en Google Drive.',
  'share.calloutBody':
    'Calquera persoa de Internet que teña a ligazón poderá ver o proxecto e descargar o ficheiro .elpx, sen conta de Google.',
  'share.cancel': 'Cancelar',
  'share.create': 'Crear ligazón pública',
  'share.sharing': 'Compartindo…',
  'share.anyone': 'Calquera persoa coa ligazón',
  'share.anyoneHint':
    'Calquera persoa de Internet coa ligazón pode velo. Non fai falta iniciar sesión.',
  'share.viewer': 'Lector',
  'share.linkLabel': 'Ligazón pública para o alumnado',
  'share.copy': 'Copiar ligazón',
  'share.copied': 'Copiado',
  'share.stopHint':
    'Para deixar de compartir, volve poñer o acceso xeral en Restrinxido en Google Drive.',
  'share.manage': 'Xestionar en Google Drive',
  'share.done': 'Feito',
  'share.errorTitle': 'Non se puido crear a ligazón pública',
  'share.errorLead': 'Google Drive rexeitou o cambio.',
  'share.workspaceHint':
    'Pode que o administrador do teu Google Workspace restrinxa “Calquera persoa coa ligazón”. Aínda así podes compartir o ficheiro con persoas do teu dominio desde Google Drive; ábreno con Abrir con → eXeLearning.',

  'viewer.errorTitle': 'Non se puido abrir este ficheiro',
  'viewer.legacyClickEdit': 'Preme Editar para abrilo no editor.',
  'viewer.legacyUnsupported':
    'Este ficheiro é dunha versión antiga de eXeLearning e non se pode previsualizar.',
  'viewer.packageUnreadable': 'Non se puido ler o paquete.',
  'viewer.invalidPackage':
    'Non se puido ler o ficheiro como un paquete válido de eXeLearning.',
  'viewer.noIndex': 'O paquete non contén un index.html.',
  'viewer.notShared':
    'Este ficheiro non está compartido publicamente (“Calquera persoa coa ligazón”) ou xa non existe en Google Drive.',
  'viewer.downloadForbidden': 'Google Drive non permite descargar “{name}”.',

  'error.missingClientId':
    'Falta VITE_GOOGLE_CLIENT_ID. Configúrao no teu contorno antes de usar Google Drive.',
  'error.publicLinksNotConfigured':
    'As ligazóns públicas non están configuradas neste despregamento (falta VITE_GOOGLE_API_KEY).',
  'error.gisNotLoaded': 'Google Identity Services non está cargado.',
  'error.gisNoToken':
    'Google Identity Services non devolveu un token de acceso.',
  'error.gisTimeout':
    'Esgotouse o tempo de espera ao cargar Google Identity Services.',
  'error.gisNoOauth':
    'Google Identity Services cargouse, pero OAuth non está dispoñible.',
  'error.gisLoadFailed': 'Non se puido cargar Google Identity Services.',
  'error.missingState': 'Falta o estado de Google Drive.',
  'error.invalidState': 'O estado de Google Drive non é válido.',
  'error.stateNoIds':
    'O estado de apertura de Google Drive debe incluír polo menos un id de ficheiro.',
  'error.stateIdsStrings':
    'Os ids de ficheiro de Google Drive deben ser cadeas.',
  'error.resourceKeysObject':
    'As chaves de recurso de Google Drive deben ser un obxecto.',
  'error.resourceKeysStrings':
    'Os valores das chaves de recurso de Google Drive deben ser cadeas.',
  'error.openOnly':
    'Este punto de entrada só admite accións de apertura de Google Drive.',
  'error.createOnly':
    'Este punto de entrada só admite accións de creación de Google Drive.',
  'error.missingFileId': 'Falta fileId na ligazón pública.',
  'error.invalidFileId': 'O fileId da ligazón pública non é válido.',
  'error.readOnlyFile':
    'Este ficheiro de Google Drive é de só lectura e non se pode sobrescribir.',
  'error.driveFailed': 'A petición a Google Drive fallou.',
  'error.missingContent': 'Falta o contido do ficheiro de Drive.',
  'error.noUploadSession':
    'Drive non devolveu unha URL de sesión de subida retomable.',
  'error.swUnavailable':
    'Os Service Workers non están dispoñibles neste contexto do navegador.',
  'error.swInactive': 'O Service Worker de eXeLearning non está activo.',
  'error.swRejected': 'O Service Worker rexeitou a mensaxe.',
  'error.notZip': 'Non é un ficheiro ZIP',
  'error.zipDecode': 'Fallo ao descomprimir o ZIP',
  'error.tooManyEntries': 'O paquete ten máis de {max} entradas',
  'error.unsafeEntry': 'Ruta de entrada non segura: {name}',
  'error.packageTooLarge':
    'O paquete supera o límite de tamaño comprimido ({size} > {max})',
  'error.decompressedTooLarge':
    'O paquete descomprimido supera o límite ({size} > {max})',
  'error.editorNotReady': 'O editor de eXeLearning aínda non está listo.',
  'error.editorFrameMissing': 'O iframe do editor non está dispoñible.',
  'error.savePayloadNoBytes':
    'O editor devolveu un gardado sen datos binarios.',
};

export default gl;
