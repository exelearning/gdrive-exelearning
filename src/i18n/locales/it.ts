import type { Messages } from '../index';

// Translated from en.ts by an AI assistant; pending review by a native speaker.
const it: Messages = {
  'home.brandSuffix': 'per Google Drive',
  'home.nav.site': 'eXeLearning.net',
  'home.nav.source': 'Codice sorgente',
  'home.title': 'Modifica i progetti eXeLearning in Google Drive',
  'home.lead':
    'Apri, modifica e salva file .elpx da Drive, nel tuo browser. I tuoi file non lasciano mai il tuo Drive.',
  'home.connect': 'Collega Google Drive',
  'home.connectHint':
    'Aggiunge eXeLearning al menu “Apri con” di Drive. Gratuito e open source.',
  'home.connected': 'Collegato a Google Drive',
  'home.openDrive': 'Apri Google Drive',
  'home.newProject': 'Nuovo progetto in Drive',
  'home.howItWorks': 'Come funziona',
  'home.step1.title': 'Collegati una volta',
  'home.step1.body':
    'Accedi con Google e consenti a eXeLearning di aprire i file che scegli. Non vede nient’altro nel tuo Drive.',
  'home.step2.title': 'Apri da Drive',
  'home.step2.body':
    'Fai clic destro su un file .elpx e scegli {openWith}. Per partire da zero: Nuovo → Altro → eXeLearning.',
  'home.step2.openWith': 'Apri con → eXeLearning',
  'home.menu.preview': 'Anteprima',
  'home.menu.openWith': 'Apri con',
  'home.menu.download': 'Scarica',
  'home.step3.title': 'Modifica, salva, condividi',
  'home.step3.body':
    'Salva su Drive con un clic. Condividi un link di sola lettura perché gli studenti aprano il progetto senza account Google.',
  'home.check.title': 'Verifica del sistema',
  'home.check.clientOk': 'Client Google configurato',
  'home.check.clientMissing': 'VITE_GOOGLE_CLIENT_ID mancante',
  'home.check.editorChecking': 'Verifica dell’editor…',
  'home.check.editorReady': 'Editor pronto',
  'home.check.editorMissing': 'Editor non trovato in {path}',
  'home.check.notConnected': 'Non collegato a Google Drive',
  'home.check.requesting': 'Richiesta di autorizzazione…',
  'home.footer.tagline':
    'eXeLearning per Google Drive · gratuito e open source',
  'home.footer.privacy': 'Informativa sulla privacy',
  'home.footer.terms': 'Termini di servizio',
  'home.language': 'Lingua',

  'toolbar.back': 'Torna a Google Drive',
  'toolbar.authorizeOpen': 'Autorizza e apri',
  'toolbar.authorizeCreate': 'Autorizza e crea',
  'toolbar.share': 'Condividi link pubblico',
  'toolbar.shareUnavailable':
    'I link pubblici non sono configurati in questa installazione.',
  'toolbar.save': 'Salva su Drive',
  'toolbar.edit': 'Modifica in eXeLearning',
  'toolbar.cannotEdit':
    'Non hai il permesso di modificare questo file in Google Drive.',
  'toolbar.editorAria': 'Editor eXeLearning',
  'toolbar.viewerAria': 'Visualizzatore eXeLearning',

  'status.connecting': 'Connessione a Google Drive…',
  'status.clickAuthorizeOpen': 'Fai clic su “Autorizza e apri” per continuare.',
  'status.clickAuthorizePreview':
    'Fai clic su “Autorizza e apri” per vedere l’anteprima di questo file.',
  'status.clickAuthorizeCreate':
    'Fai clic su “Autorizza e crea” per continuare.',
  'status.requestingAuth': 'Richiesta di autorizzazione Google…',
  'status.fetchingMetadata': 'Recupero dei metadati di Google Drive…',
  'status.loadingTemplate': 'Caricamento del modello .elpx vuoto…',
  'status.creatingFile': 'Creazione del file in Google Drive…',
  'status.loadingEditor': 'Caricamento dell’editor eXeLearning…',
  'status.openingEditor': 'Apertura dell’editor…',
  'status.opening': 'Apertura…',
  'status.opened': 'Aperto.',
  'status.openedReadOnly': 'Aperto in sola lettura.',
  'status.openedLegacy':
    'File precedente aperto. Il salvataggio creerà un nuovo .elpx nella stessa cartella.',
  'status.created': 'Creato.',
  'status.unsaved': 'Modifiche non salvate.',
  'status.requestingSave': 'Richiesta del .elpx aggiornato all’editor…',
  'status.checkingRemote': 'Verifica delle modifiche remote…',
  'status.saveCancelled': 'Salvataggio annullato.',
  'status.saved': 'Salvato su Google Drive.',
  'status.readingPackage': 'Lettura del pacchetto…',
  'status.previewLoaded': 'Anteprima caricata.',
  'status.legacyFile': 'File precedente: fai clic su Modifica per migrarlo.',
  'status.fetchingPublic': 'Recupero da Google Drive…',
  'status.downloading': 'Download…',
  'status.loaded': 'Caricato.',
  'status.sharing': 'Condivisione con chiunque abbia il link…',
  'status.linkReady': 'Link pubblico pronto.',

  'saving.title': 'Salvataggio su Drive…',
  'saving.hint': 'Attendi mentre il file viene salvato.',
  'saving.failed': 'Salvataggio non riuscito',
  'common.close': 'Chiudi',
  'conflict.changed':
    '“{filename}” è cambiato in Google Drive da quando è stato aperto.\n\nFai clic su OK per sovrascrivere il file di Drive, o su Annulla per scegliere un’altra opzione.',
  'conflict.saveCopy':
    'Salvare il contenuto dell’editor come nuova copia? Fai clic su Annulla per non salvare.',

  'share.title': 'Condividi “{filename}”',
  'share.generalAccess': 'Accesso generale',
  'share.restricted': 'Limitato',
  'share.restrictedHint':
    'Solo le persone con accesso in Google Drive possono aprirlo.',
  'share.calloutLead':
    'Un link pubblico lo imposta su “Chiunque abbia il link” come visualizzatore in Google Drive.',
  'share.calloutBody':
    'Chiunque su Internet abbia il link potrà vedere il progetto e scaricare il file .elpx, senza account Google.',
  'share.cancel': 'Annulla',
  'share.create': 'Crea link pubblico',
  'share.sharing': 'Condivisione…',
  'share.anyone': 'Chiunque abbia il link',
  'share.anyoneHint':
    'Chiunque su Internet abbia il link può vederlo. Nessun accesso richiesto.',
  'share.viewer': 'Visualizzatore',
  'share.linkLabel': 'Link pubblico per gli studenti',
  'share.copy': 'Copia link',
  'share.copied': 'Copiato',
  'share.stopHint':
    'Per interrompere la condivisione, riporta l’accesso generale su Limitato in Google Drive.',
  'share.manage': 'Gestisci in Google Drive',
  'share.done': 'Fine',
  'share.errorTitle': 'Impossibile creare un link pubblico',
  'share.errorLead': 'Google Drive ha rifiutato la modifica.',
  'share.workspaceHint':
    'L’amministratore del tuo Google Workspace potrebbe limitare “Chiunque abbia il link”. Puoi comunque condividere il file con le persone del tuo dominio da Google Drive; lo aprono con Apri con → eXeLearning.',

  'viewer.errorTitle': 'Impossibile aprire questo file',
  'viewer.legacyClickEdit': 'Fai clic su Modifica per aprirlo nell’editor.',
  'viewer.legacyUnsupported':
    'Questo file proviene da una versione precedente di eXeLearning e non può essere visualizzato in anteprima.',
  'viewer.packageUnreadable': 'Impossibile leggere il pacchetto.',
  'viewer.invalidPackage':
    'Impossibile leggere il file come pacchetto eXeLearning valido.',
  'viewer.noIndex': 'Il pacchetto non contiene un index.html.',
  'viewer.notShared':
    'Questo file non è condiviso pubblicamente (“Chiunque abbia il link”) o non esiste più in Google Drive.',
  'viewer.downloadForbidden':
    'Google Drive non consente di scaricare “{name}”.',

  'error.missingClientId':
    'VITE_GOOGLE_CLIENT_ID mancante. Configuralo nel tuo ambiente prima di usare Google Drive.',
  'error.publicLinksNotConfigured':
    'I link pubblici non sono configurati in questa installazione (VITE_GOOGLE_API_KEY mancante).',
  'error.gisNotLoaded': 'Google Identity Services non è caricato.',
  'error.gisNoToken':
    'Google Identity Services non ha restituito un token di accesso.',
  'error.gisTimeout':
    'Tempo scaduto durante il caricamento di Google Identity Services.',
  'error.gisNoOauth':
    'Google Identity Services è caricato, ma OAuth non è disponibile.',
  'error.gisLoadFailed': 'Impossibile caricare Google Identity Services.',
  'error.missingState': 'Stato di Google Drive mancante.',
  'error.invalidState': 'Stato di Google Drive non valido.',
  'error.stateNoIds':
    'Lo stato di apertura di Google Drive deve includere almeno un id di file.',
  'error.stateIdsStrings':
    'Gli id dei file di Google Drive devono essere stringhe.',
  'error.resourceKeysObject':
    'Le chiavi risorsa di Google Drive devono essere un oggetto.',
  'error.resourceKeysStrings':
    'I valori delle chiavi risorsa di Google Drive devono essere stringhe.',
  'error.openOnly':
    'Questo endpoint supporta solo azioni di apertura di Google Drive.',
  'error.createOnly':
    'Questo endpoint supporta solo azioni di creazione di Google Drive.',
  'error.missingFileId': 'fileId mancante nel link pubblico.',
  'error.invalidFileId': 'fileId non valido nel link pubblico.',
  'error.readOnlyFile':
    'Questo file di Google Drive è di sola lettura e non può essere sovrascritto.',
  'error.driveFailed': 'La richiesta a Google Drive non è riuscita.',
  'error.missingContent': 'Contenuto del file di Drive mancante.',
  'error.noUploadSession':
    'Drive non ha restituito un URL di sessione di caricamento ripristinabile.',
  'error.swUnavailable':
    'I Service Worker non sono disponibili in questo contesto del browser.',
  'error.swInactive': 'Il Service Worker di eXeLearning non è attivo.',
  'error.swRejected': 'Il Service Worker ha rifiutato il messaggio.',
  'error.notZip': 'Non è un archivio ZIP',
  'error.zipDecode': 'Decodifica ZIP non riuscita',
  'error.tooManyEntries': 'Il pacchetto ha più di {max} voci',
  'error.unsafeEntry': 'Percorso della voce non sicuro: {name}',
  'error.packageTooLarge':
    'Il pacchetto supera il limite di dimensione compressa ({size} > {max})',
  'error.decompressedTooLarge':
    'Il pacchetto decompresso supera il limite ({size} > {max})',
  'error.editorNotReady': 'L’editor eXeLearning non è ancora pronto.',
  'error.editorFrameMissing': 'L’iframe dell’editor non è disponibile.',
  'error.savePayloadNoBytes':
    'L’editor ha restituito un salvataggio senza dati binari.',
};

export default it;
