import type { Messages } from '../index';

// Translated from en.ts by an AI assistant; pending review by a native speaker.
const ro: Messages = {
  'home.brandSuffix': 'pentru Google Drive',
  'home.nav.site': 'eXeLearning.net',
  'home.nav.source': 'Cod sursă',
  'home.title': 'Editează proiecte eXeLearning în Google Drive',
  'home.lead':
    'Deschide, editează și salvează fișiere .elpx din Drive, în browserul tău. Fișierele tale nu părăsesc niciodată Drive-ul tău.',
  'home.connect': 'Conectează Google Drive',
  'home.connectHint':
    'Adaugă eXeLearning în meniul „Deschide cu” din Drive. Gratuit și open source.',
  'home.connected': 'Conectat la Google Drive',
  'home.openDrive': 'Deschide Google Drive',
  'home.newProject': 'Proiect nou în Drive',
  'home.howItWorks': 'Cum funcționează',
  'home.step1.title': 'Conectează-te o singură dată',
  'home.step1.body':
    'Conectează-te cu Google și permite-i lui eXeLearning să deschidă fișierele pe care le alegi. Nu vede nimic altceva din Drive-ul tău.',
  'home.step2.title': 'Deschide din Drive',
  'home.step2.body':
    'Dă clic dreapta pe orice fișier .elpx și alege {openWith}. Pentru a începe de la zero: Nou → Mai multe → eXeLearning.',
  'home.step2.openWith': 'Deschide cu → eXeLearning',
  'home.menu.preview': 'Previzualizare',
  'home.menu.openWith': 'Deschide cu',
  'home.menu.download': 'Descarcă',
  'home.step3.title': 'Editează, salvează, partajează',
  'home.step3.body':
    'Salvează înapoi în Drive cu un clic. Partajează un link doar pentru citire, ca elevii să deschidă proiectul fără cont Google.',
  'home.check.title': 'Verificarea sistemului',
  'home.check.clientOk': 'Client Google configurat',
  'home.check.clientMissing': 'Lipsește VITE_GOOGLE_CLIENT_ID',
  'home.check.editorChecking': 'Se verifică editorul…',
  'home.check.editorReady': 'Editor pregătit',
  'home.check.editorMissing': 'Editorul nu a fost găsit la {path}',
  'home.check.notConnected': 'Neconectat la Google Drive',
  'home.check.requesting': 'Se solicită autorizarea…',
  'home.footer.tagline':
    'eXeLearning pentru Google Drive · gratuit și open source',
  'home.footer.privacy': 'Politica de confidențialitate',
  'home.footer.terms': 'Termenii serviciului',
  'home.language': 'Limbă',

  'toolbar.back': 'Înapoi la Google Drive',
  'toolbar.authorizeOpen': 'Autorizează și deschide',
  'toolbar.authorizeCreate': 'Autorizează și creează',
  'toolbar.share': 'Partajează link public',
  'toolbar.shareUnavailable':
    'Linkurile publice nu sunt configurate pentru această instalare.',
  'toolbar.save': 'Salvează în Drive',
  'toolbar.edit': 'Editează în eXeLearning',
  'toolbar.cannotEdit':
    'Nu ai permisiunea de a edita acest fișier în Google Drive.',
  'toolbar.editorAria': 'Editor eXeLearning',
  'toolbar.viewerAria': 'Vizualizator eXeLearning',

  'status.connecting': 'Se conectează la Google Drive…',
  'status.clickAuthorizeOpen':
    'Dă clic pe „Autorizează și deschide” pentru a continua.',
  'status.clickAuthorizePreview':
    'Dă clic pe „Autorizează și deschide” pentru a previzualiza acest fișier.',
  'status.clickAuthorizeCreate':
    'Dă clic pe „Autorizează și creează” pentru a continua.',
  'status.requestingAuth': 'Se solicită autorizarea Google…',
  'status.fetchingMetadata': 'Se obțin metadatele Google Drive…',
  'status.loadingTemplate': 'Se încarcă șablonul .elpx gol…',
  'status.creatingFile': 'Se creează fișierul în Google Drive…',
  'status.loadingEditor': 'Se încarcă editorul eXeLearning…',
  'status.openingEditor': 'Se deschide editorul…',
  'status.opening': 'Se deschide…',
  'status.opened': 'Deschis.',
  'status.openedReadOnly': 'Deschis în modul doar pentru citire.',
  'status.openedLegacy':
    'Fișier vechi deschis. La salvare se va crea un nou .elpx în același dosar.',
  'status.created': 'Creat.',
  'status.unsaved': 'Modificări nesalvate.',
  'status.requestingSave': 'Se solicită editorului fișierul .elpx actualizat…',
  'status.checkingRemote': 'Se verifică modificările la distanță…',
  'status.saveCancelled': 'Salvare anulată.',
  'status.saved': 'Salvat în Google Drive.',
  'status.readingPackage': 'Se citește pachetul…',
  'status.previewLoaded': 'Previzualizare încărcată.',
  'status.legacyFile': 'Fișier vechi: dă clic pe Editează pentru a-l migra.',
  'status.fetchingPublic': 'Se obține din Google Drive…',
  'status.downloading': 'Se descarcă…',
  'status.loaded': 'Încărcat.',
  'status.sharing': 'Se partajează cu oricine are linkul…',
  'status.linkReady': 'Link public pregătit.',

  'saving.title': 'Se salvează în Drive…',
  'saving.hint': 'Așteaptă cât timp se salvează fișierul.',
  'saving.failed': 'Salvarea a eșuat',
  'common.close': 'Închide',
  'conflict.changed':
    '„{filename}” s-a modificat în Google Drive de când a fost deschis.\n\nDă clic pe OK pentru a suprascrie fișierul din Drive sau pe Anulează pentru a alege altă opțiune.',
  'conflict.saveCopy':
    'Salvezi conținutul editorului ca o copie nouă? Dă clic pe Anulează pentru a nu salva.',

  'share.title': 'Partajează „{filename}”',
  'share.generalAccess': 'Acces general',
  'share.restricted': 'Restricționat',
  'share.restrictedHint':
    'Doar persoanele cu acces în Google Drive îl pot deschide.',
  'share.calloutLead':
    'Un link public îl setează la „Oricine are linkul” ca cititor în Google Drive.',
  'share.calloutBody':
    'Oricine de pe internet are linkul va putea vedea proiectul și descărca fișierul .elpx, fără cont Google.',
  'share.cancel': 'Anulează',
  'share.create': 'Creează link public',
  'share.sharing': 'Se partajează…',
  'share.anyone': 'Oricine are linkul',
  'share.anyoneHint':
    'Oricine de pe internet are linkul îl poate vedea. Nu e nevoie de autentificare.',
  'share.viewer': 'Cititor',
  'share.linkLabel': 'Link public pentru elevi',
  'share.copy': 'Copiază linkul',
  'share.copied': 'Copiat',
  'share.stopHint':
    'Pentru a opri partajarea, setează accesul general înapoi la Restricționat în Google Drive.',
  'share.manage': 'Gestionează în Google Drive',
  'share.done': 'Gata',
  'share.errorTitle': 'Nu s-a putut crea un link public',
  'share.errorLead': 'Google Drive a refuzat modificarea.',
  'share.workspaceHint':
    'Administratorul Google Workspace ar putea restricționa „Oricine are linkul”. Poți totuși partaja fișierul cu persoane din domeniul tău din Google Drive; ele îl deschid cu Deschide cu → eXeLearning.',

  'viewer.errorTitle': 'Nu s-a putut deschide acest fișier',
  'viewer.legacyClickEdit':
    'Dă clic pe Editează pentru a-l deschide în editor.',
  'viewer.legacyUnsupported':
    'Acest fișier provine dintr-o versiune mai veche de eXeLearning și nu poate fi previzualizat.',
  'viewer.packageUnreadable': 'Pachetul nu a putut fi citit.',
  'viewer.invalidPackage':
    'Fișierul nu a putut fi citit ca un pachet eXeLearning valid.',
  'viewer.noIndex': 'Pachetul nu conține un index.html.',
  'viewer.notShared':
    'Acest fișier nu este partajat public („Oricine are linkul”) sau nu mai există în Google Drive.',
  'viewer.downloadForbidden': 'Google Drive nu permite descărcarea „{name}”.',

  'error.missingClientId':
    'Lipsește VITE_GOOGLE_CLIENT_ID. Configurează-l în mediul tău înainte de a folosi Google Drive.',
  'error.publicLinksNotConfigured':
    'Linkurile publice nu sunt configurate pentru această instalare (lipsește VITE_GOOGLE_API_KEY).',
  'error.gisNotLoaded': 'Google Identity Services nu este încărcat.',
  'error.gisNoToken':
    'Google Identity Services nu a returnat un token de acces.',
  'error.gisTimeout':
    'Timpul de încărcare a Google Identity Services a expirat.',
  'error.gisNoOauth':
    'Google Identity Services s-a încărcat, dar OAuth nu este disponibil.',
  'error.gisLoadFailed': 'Nu s-a putut încărca Google Identity Services.',
  'error.missingState': 'Lipsește starea Google Drive.',
  'error.invalidState': 'Starea Google Drive nu este validă.',
  'error.stateNoIds':
    'Starea de deschidere Google Drive trebuie să includă cel puțin un id de fișier.',
  'error.stateIdsStrings':
    'Id-urile de fișier Google Drive trebuie să fie șiruri.',
  'error.resourceKeysObject':
    'Cheile de resursă Google Drive trebuie să fie un obiect.',
  'error.resourceKeysStrings':
    'Valorile cheilor de resursă Google Drive trebuie să fie șiruri.',
  'error.openOnly':
    'Acest punct de intrare acceptă doar acțiuni de deschidere Google Drive.',
  'error.createOnly':
    'Acest punct de intrare acceptă doar acțiuni de creare Google Drive.',
  'error.missingFileId': 'Lipsește fileId din linkul public.',
  'error.invalidFileId': 'fileId invalid în linkul public.',
  'error.readOnlyFile':
    'Acest fișier Google Drive este doar pentru citire și nu poate fi suprascris.',
  'error.driveFailed': 'Cererea către Google Drive a eșuat.',
  'error.missingContent': 'Lipsește conținutul fișierului Drive.',
  'error.noUploadSession':
    'Drive nu a returnat un URL de sesiune de încărcare reluabilă.',
  'error.swUnavailable':
    'Service Workerii nu sunt disponibili în acest context de browser.',
  'error.swInactive': 'Service Workerul eXeLearning nu este activ.',
  'error.swRejected': 'Service Workerul a respins mesajul.',
  'error.notZip': 'Nu este o arhivă ZIP',
  'error.zipDecode': 'Decodarea ZIP a eșuat',
  'error.tooManyEntries': 'Pachetul are mai mult de {max} intrări',
  'error.unsafeEntry': 'Cale de intrare nesigură: {name}',
  'error.packageTooLarge':
    'Pachetul depășește limita de dimensiune comprimată ({size} > {max})',
  'error.decompressedTooLarge':
    'Pachetul decomprimat depășește limita ({size} > {max})',
  'error.editorNotReady': 'Editorul eXeLearning nu este încă pregătit.',
  'error.editorFrameMissing': 'Iframe-ul editorului nu este disponibil.',
  'error.savePayloadNoBytes': 'Editorul a returnat o salvare fără date binare.',
};

export default ro;
