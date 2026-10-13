import type { Messages } from '../index';

// Translated from en.ts by an AI assistant; pending review by a native speaker.
const va: Messages = {
  'home.brandSuffix': 'per a Google Drive',
  'home.nav.site': 'eXeLearning.net',
  'home.nav.source': 'Codi font',
  'home.title': 'Edita projectes d’eXeLearning en Google Drive',
  'home.lead':
    'Obri, edita i guarda fitxers .elpx des de Drive, en el teu navegador. Els teus fitxers no ixen mai del teu Drive.',
  'home.connect': 'Connecta Google Drive',
  'home.connectHint':
    'Afig eXeLearning al menú “Obri amb” de Drive. Gratuït i de codi obert.',
  'home.connected': 'Connectat a Google Drive',
  'home.openDrive': 'Obri Google Drive',
  'home.newProject': 'Projecte nou en Drive',
  'home.howItWorks': 'Com funciona',
  'home.step1.title': 'Connecta una vegada',
  'home.step1.body':
    'Inicia la sessió amb Google i permet que eXeLearning òbriga els fitxers que tries. No veu res més del teu Drive.',
  'home.step2.title': 'Obri des de Drive',
  'home.step2.body':
    'Fes clic dret en qualsevol fitxer .elpx i tria {openWith}. Per a començar de zero: Nou → Més → eXeLearning.',
  'home.step2.openWith': 'Obri amb → eXeLearning',
  'home.menu.preview': 'Previsualitza',
  'home.menu.openWith': 'Obri amb',
  'home.menu.download': 'Descarrega',
  'home.step3.title': 'Edita, guarda, compartix',
  'home.step3.body':
    'Guarda en Drive amb un clic. Compartix un enllaç de només lectura perquè l’alumnat òbriga el projecte sense compte de Google.',
  'home.check.title': 'Comprovació del sistema',
  'home.check.clientOk': 'Client de Google configurat',
  'home.check.clientMissing': 'Falta VITE_GOOGLE_CLIENT_ID',
  'home.check.editorChecking': 'Comprovant l’editor…',
  'home.check.editorReady': 'Editor a punt',
  'home.check.editorMissing': 'No s’ha trobat l’editor en {path}',
  'home.check.notConnected': 'No connectat a Google Drive',
  'home.check.requesting': 'Sol·licitant l’autorització…',
  'home.footer.tagline':
    'eXeLearning per a Google Drive · gratuït i de codi obert',
  'home.footer.privacy': 'Política de privacitat',
  'home.footer.terms': 'Condicions del servei',
  'home.language': 'Idioma',

  'toolbar.back': 'Torna a Google Drive',
  'toolbar.authorizeOpen': 'Autoritza i obri',
  'toolbar.authorizeCreate': 'Autoritza i crea',
  'toolbar.share': 'Compartix l’enllaç públic',
  'toolbar.shareUnavailable':
    'Els enllaços públics no estan configurats en este desplegament.',
  'toolbar.save': 'Guarda en Drive',
  'toolbar.edit': 'Edita en eXeLearning',
  'toolbar.cannotEdit':
    'No tens permís per a editar este fitxer en Google Drive.',
  'toolbar.editorAria': 'Editor d’eXeLearning',
  'toolbar.viewerAria': 'Visor d’eXeLearning',

  'status.connecting': 'Connectant amb Google Drive…',
  'status.clickAuthorizeOpen': 'Prem “Autoritza i obri” per a continuar.',
  'status.clickAuthorizePreview':
    'Prem “Autoritza i obri” per a previsualitzar este fitxer.',
  'status.clickAuthorizeCreate': 'Prem “Autoritza i crea” per a continuar.',
  'status.requestingAuth': 'Sol·licitant l’autorització de Google…',
  'status.fetchingMetadata': 'Obtenint les metadades de Google Drive…',
  'status.loadingTemplate': 'Carregant la plantilla .elpx en blanc…',
  'status.creatingFile': 'Creant el fitxer en Google Drive…',
  'status.loadingEditor': 'Carregant l’editor d’eXeLearning…',
  'status.openingEditor': 'Obrint l’editor…',
  'status.opening': 'Obrint…',
  'status.opened': 'Obert.',
  'status.openedReadOnly': 'Obert en mode de només lectura.',
  'status.openedLegacy':
    'Fitxer antic obert. En guardar es crearà un .elpx nou en la mateixa carpeta.',
  'status.created': 'Creat.',
  'status.unsaved': 'Canvis sense guardar.',
  'status.requestingSave': 'Sol·licitant l’.elpx actualitzat a l’editor…',
  'status.checkingRemote': 'Comprovant canvis remots…',
  'status.saveCancelled': 'Guardat cancel·lat.',
  'status.saved': 'Guardat en Google Drive.',
  'status.readingPackage': 'Llegint el paquet…',
  'status.previewLoaded': 'Previsualització carregada.',
  'status.legacyFile': 'Fitxer antic: prem Edita per a migrar-lo.',
  'status.fetchingPublic': 'Obtenint de Google Drive…',
  'status.downloading': 'Descarregant…',
  'status.loaded': 'Carregat.',
  'status.sharing': 'Compartint amb qualsevol persona amb l’enllaç…',
  'status.linkReady': 'Enllaç públic a punt.',

  'saving.title': 'Guardant en Drive…',
  'saving.hint': 'Espera mentre es guarda el fitxer.',
  'saving.failed': 'Error en guardar',
  'common.close': 'Tanca',
  'conflict.changed':
    '“{filename}” ha canviat en Google Drive des que es va obrir.\n\nPrem D’acord per a sobreescriure el fitxer de Drive, o Cancel·la per a triar una altra opció.',
  'conflict.saveCopy':
    'Vols guardar el contingut de l’editor com una còpia nova? Prem Cancel·la per a no guardar.',

  'share.title': 'Compartix “{filename}”',
  'share.generalAccess': 'Accés general',
  'share.restricted': 'Restringit',
  'share.restrictedHint':
    'Només el poden obrir les persones amb accés en Google Drive.',
  'share.calloutLead':
    'Un enllaç públic el canvia a “Qualsevol persona amb l’enllaç” com a lector en Google Drive.',
  'share.calloutBody':
    'Qualsevol persona d’Internet que tinga l’enllaç podrà vore el projecte i descarregar el fitxer .elpx, sense compte de Google.',
  'share.cancel': 'Cancel·la',
  'share.create': 'Crea l’enllaç públic',
  'share.sharing': 'Compartint…',
  'share.anyone': 'Qualsevol persona amb l’enllaç',
  'share.anyoneHint':
    'Qualsevol persona d’Internet amb l’enllaç el pot vore. No cal iniciar la sessió.',
  'share.viewer': 'Lector',
  'share.linkLabel': 'Enllaç públic per a l’alumnat',
  'share.copy': 'Copia l’enllaç',
  'share.copied': 'Copiat',
  'share.stopHint':
    'Per a deixar de compartir, torna a posar l’accés general en Restringit en Google Drive.',
  'share.manage': 'Gestiona en Google Drive',
  'share.done': 'Fet',
  'share.errorTitle': 'No s’ha pogut crear l’enllaç públic',
  'share.errorLead': 'Google Drive ha rebutjat el canvi.',
  'share.workspaceHint':
    'Pot ser que l’administrador del teu Google Workspace restringisca “Qualsevol persona amb l’enllaç”. Així i tot pots compartir el fitxer amb persones del teu domini des de Google Drive; l’obrin amb Obri amb → eXeLearning.',

  'viewer.errorTitle': 'No s’ha pogut obrir este fitxer',
  'viewer.legacyClickEdit': 'Prem Edita per a obrir-lo en l’editor.',
  'viewer.legacyUnsupported':
    'Este fitxer és d’una versió antiga d’eXeLearning i no es pot previsualitzar.',
  'viewer.packageUnreadable': 'No s’ha pogut llegir el paquet.',
  'viewer.invalidPackage':
    'No s’ha pogut llegir el fitxer com un paquet vàlid d’eXeLearning.',
  'viewer.noIndex': 'El paquet no conté cap index.html.',
  'viewer.notShared':
    'Este fitxer no està compartit públicament (“Qualsevol persona amb l’enllaç”) o ja no existix en Google Drive.',
  'viewer.downloadForbidden': 'Google Drive no permet descarregar “{name}”.',

  'error.missingClientId':
    'Falta VITE_GOOGLE_CLIENT_ID. Configura-la en el teu entorn abans d’usar Google Drive.',
  'error.publicLinksNotConfigured':
    'Els enllaços públics no estan configurats en este desplegament (falta VITE_GOOGLE_API_KEY).',
  'error.gisNotLoaded': 'Google Identity Services no està carregat.',
  'error.gisNoToken':
    'Google Identity Services no ha retornat cap testimoni d’accés.',
  'error.gisTimeout':
    'S’ha esgotat el temps d’espera en carregar Google Identity Services.',
  'error.gisNoOauth':
    'Google Identity Services s’ha carregat, però OAuth no està disponible.',
  'error.gisLoadFailed': 'No s’ha pogut carregar Google Identity Services.',
  'error.missingState': 'Falta l’estat de Google Drive.',
  'error.invalidState': 'L’estat de Google Drive no és vàlid.',
  'error.stateNoIds':
    'L’estat d’obertura de Google Drive ha d’incloure almenys un id de fitxer.',
  'error.stateIdsStrings':
    'Els ids de fitxer de Google Drive han de ser cadenes.',
  'error.resourceKeysObject':
    'Les claus de recurs de Google Drive han de ser un objecte.',
  'error.resourceKeysStrings':
    'Els valors de les claus de recurs de Google Drive han de ser cadenes.',
  'error.openOnly':
    'Este punt d’entrada només admet accions d’obertura de Google Drive.',
  'error.createOnly':
    'Este punt d’entrada només admet accions de creació de Google Drive.',
  'error.missingFileId': 'Falta fileId en l’enllaç públic.',
  'error.invalidFileId': 'El fileId de l’enllaç públic no és vàlid.',
  'error.readOnlyFile':
    'Este fitxer de Google Drive és de només lectura i no es pot sobreescriure.',
  'error.driveFailed': 'La petició a Google Drive ha fallat.',
  'error.missingContent': 'Falta el contingut del fitxer de Drive.',
  'error.noUploadSession':
    'Drive no ha retornat cap URL de sessió de pujada reprenible.',
  'error.swUnavailable':
    'Els Service Workers no estan disponibles en este context del navegador.',
  'error.swInactive': 'El Service Worker d’eXeLearning no està actiu.',
  'error.swRejected': 'El Service Worker ha rebutjat el missatge.',
  'error.notZip': 'No és un fitxer ZIP',
  'error.zipDecode': 'Error en descomprimir el ZIP',
  'error.tooManyEntries': 'El paquet té més de {max} entrades',
  'error.unsafeEntry': 'Camí d’entrada no segur: {name}',
  'error.packageTooLarge':
    'El paquet supera el límit de grandària comprimida ({size} > {max})',
  'error.decompressedTooLarge':
    'El paquet descomprimit supera el límit ({size} > {max})',
  'error.editorNotReady': 'L’editor d’eXeLearning encara no està a punt.',
  'error.editorFrameMissing': 'L’iframe de l’editor no està disponible.',
  'error.savePayloadNoBytes':
    'L’editor ha retornat un guardat sense dades binàries.',
};

export default va;
