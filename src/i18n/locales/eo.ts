import type { Messages } from '../index';

// Translated from en.ts by an AI assistant; pending review by a native speaker.
const eo: Messages = {
  'home.brandSuffix': 'por Google Drive',
  'home.nav.site': 'eXeLearning.net',
  'home.nav.source': 'Fontkodo',
  'home.title': 'Redaktu eXeLearning-projektojn en Google Drive',
  'home.lead':
    'Malfermu, redaktu kaj konservu .elpx-dosierojn el Drive, en via retumilo. Viaj dosieroj neniam forlasas vian Drive.',
  'home.connect': 'Konekti Google Drive',
  'home.connectHint':
    'Aldonas eXeLearning al la menuo “Malfermi per” de Drive. Senpaga kaj malfermkoda.',
  'home.connected': 'Konektita al Google Drive',
  'home.openDrive': 'Malfermi Google Drive',
  'home.newProject': 'Nova projekto en Drive',
  'home.howItWorks': 'Kiel ĝi funkcias',
  'home.step1.title': 'Konektu unufoje',
  'home.step1.body':
    'Ensalutu per Google kaj permesu al eXeLearning malfermi la dosierojn, kiujn vi elektas. Ĝi vidas nenion alian en via Drive.',
  'home.step2.title': 'Malfermu el Drive',
  'home.step2.body':
    'Dekstre alklaku iun ajn .elpx-dosieron kaj elektu {openWith}. Por komenci de nulo: Nova → Pli → eXeLearning.',
  'home.step2.openWith': 'Malfermi per → eXeLearning',
  'home.menu.preview': 'Antaŭrigardo',
  'home.menu.openWith': 'Malfermi per',
  'home.menu.download': 'Elŝuti',
  'home.step3.title': 'Redaktu, konservu, kunhavigu',
  'home.step3.body':
    'Konservu en Drive per unu klako. Kunhavigu nurlegan ligilon, por ke lernantoj malfermu la projekton sen Google-konto.',
  'home.check.title': 'Sistema kontrolo',
  'home.check.clientOk': 'Google-kliento agordita',
  'home.check.clientMissing': 'Mankas VITE_GOOGLE_CLIENT_ID',
  'home.check.editorChecking': 'Kontrolante la redaktilon…',
  'home.check.editorReady': 'Redaktilo preta',
  'home.check.editorMissing': 'Redaktilo ne trovita ĉe {path}',
  'home.check.notConnected': 'Ne konektita al Google Drive',
  'home.check.requesting': 'Petante rajtigon…',
  'home.footer.tagline':
    'eXeLearning por Google Drive · senpaga kaj malfermkoda',
  'home.footer.privacy': 'Privateca politiko',
  'home.footer.terms': 'Kondiĉoj de uzo',
  'home.language': 'Lingvo',

  'toolbar.back': 'Reen al Google Drive',
  'toolbar.authorizeOpen': 'Rajtigi kaj malfermi',
  'toolbar.authorizeCreate': 'Rajtigi kaj krei',
  'toolbar.share': 'Kunhavigi publikan ligilon',
  'toolbar.shareUnavailable':
    'Publikaj ligiloj ne estas agorditaj en ĉi tiu instalaĵo.',
  'toolbar.save': 'Konservi en Drive',
  'toolbar.edit': 'Redakti en eXeLearning',
  'toolbar.cannotEdit':
    'Vi ne rajtas redakti ĉi tiun dosieron en Google Drive.',
  'toolbar.editorAria': 'eXeLearning-redaktilo',
  'toolbar.viewerAria': 'eXeLearning-vidilo',

  'status.connecting': 'Konektante al Google Drive…',
  'status.clickAuthorizeOpen': 'Alklaku “Rajtigi kaj malfermi” por daŭrigi.',
  'status.clickAuthorizePreview':
    'Alklaku “Rajtigi kaj malfermi” por antaŭrigardi ĉi tiun dosieron.',
  'status.clickAuthorizeCreate': 'Alklaku “Rajtigi kaj krei” por daŭrigi.',
  'status.requestingAuth': 'Petante Google-rajtigon…',
  'status.fetchingMetadata': 'Ricevante metadatumojn de Google Drive…',
  'status.loadingTemplate': 'Ŝargante malplenan .elpx-ŝablonon…',
  'status.creatingFile': 'Kreante dosieron en Google Drive…',
  'status.loadingEditor': 'Ŝargante la eXeLearning-redaktilon…',
  'status.openingEditor': 'Malfermante la redaktilon…',
  'status.opening': 'Malfermante…',
  'status.opened': 'Malfermita.',
  'status.openedReadOnly': 'Malfermita en nurlega reĝimo.',
  'status.openedLegacy':
    'Malnova dosiero malfermita. Konservado kreos novan .elpx en la sama dosierujo.',
  'status.created': 'Kreita.',
  'status.unsaved': 'Nekonservitaj ŝanĝoj.',
  'status.requestingSave': 'Petante la ĝisdatigitan .elpx de la redaktilo…',
  'status.checkingRemote': 'Kontrolante forajn ŝanĝojn…',
  'status.saveCancelled': 'Konservado nuligita.',
  'status.saved': 'Konservita en Google Drive.',
  'status.readingPackage': 'Legante la pakaĵon…',
  'status.previewLoaded': 'Antaŭrigardo ŝargita.',
  'status.legacyFile': 'Malnova dosiero: alklaku Redakti por migri ĝin.',
  'status.fetchingPublic': 'Ricevante el Google Drive…',
  'status.downloading': 'Elŝutante…',
  'status.loaded': 'Ŝargita.',
  'status.sharing': 'Kunhavigante kun ĉiu, kiu havas la ligilon…',
  'status.linkReady': 'Publika ligilo preta.',

  'saving.title': 'Konservante en Drive…',
  'saving.hint': 'Bonvolu atendi dum la dosiero estas konservata.',
  'saving.failed': 'Konservado malsukcesis',
  'common.close': 'Fermi',
  'conflict.changed':
    '“{filename}” ŝanĝiĝis en Google Drive post kiam ĝi estis malfermita.\n\nAlklaku OK por anstataŭigi la Drive-dosieron, aŭ Nuligi por elekti alian eblon.',
  'conflict.saveCopy':
    'Ĉu konservi la enhavon de la redaktilo kiel novan kopion? Alklaku Nuligi por ne konservi.',

  'share.title': 'Kunhavigi “{filename}”',
  'share.generalAccess': 'Ĝenerala aliro',
  'share.restricted': 'Limigita',
  'share.restrictedHint':
    'Nur personoj kun aliro en Google Drive povas malfermi ĝin.',
  'share.calloutLead':
    'Publika ligilo ŝanĝas ĝin al “Ĉiu, kiu havas la ligilon” kiel leganto en Google Drive.',
  'share.calloutBody':
    'Ĉiu en Interreto, kiu havas la ligilon, povos vidi la projekton kaj elŝuti la .elpx-dosieron, sen Google-konto.',
  'share.cancel': 'Nuligi',
  'share.create': 'Krei publikan ligilon',
  'share.sharing': 'Kunhavigante…',
  'share.anyone': 'Ĉiu, kiu havas la ligilon',
  'share.anyoneHint':
    'Ĉiu en Interreto kun la ligilo povas vidi ĝin. Ensaluto ne necesas.',
  'share.viewer': 'Leganto',
  'share.linkLabel': 'Publika ligilo por lernantoj',
  'share.copy': 'Kopii ligilon',
  'share.copied': 'Kopiita',
  'share.stopHint':
    'Por ĉesi kunhavigi, remetu la ĝeneralan aliron al Limigita en Google Drive.',
  'share.manage': 'Administri en Google Drive',
  'share.done': 'Farita',
  'share.errorTitle': 'Ne eblis krei publikan ligilon',
  'share.errorLead': 'Google Drive rifuzis la ŝanĝon.',
  'share.workspaceHint':
    'Eble via administranto de Google Workspace limigas “Ĉiu, kiu havas la ligilon”. Vi tamen povas kunhavigi la dosieron kun personoj de via domajno el Google Drive; ili malfermas ĝin per Malfermi per → eXeLearning.',

  'viewer.errorTitle': 'Ne eblis malfermi ĉi tiun dosieron',
  'viewer.legacyClickEdit': 'Alklaku Redakti por malfermi ĝin en la redaktilo.',
  'viewer.legacyUnsupported':
    'Ĉi tiu dosiero devenas de pli malnova versio de eXeLearning kaj ne povas esti antaŭrigardata.',
  'viewer.packageUnreadable': 'Ne eblis legi la pakaĵon.',
  'viewer.invalidPackage':
    'Ne eblis legi la dosieron kiel validan eXeLearning-pakaĵon.',
  'viewer.noIndex': 'La pakaĵo ne enhavas index.html.',
  'viewer.notShared':
    'Ĉi tiu dosiero ne estas publike kunhavigita (“Ĉiu, kiu havas la ligilon”) aŭ ne plu ekzistas en Google Drive.',
  'viewer.downloadForbidden': 'Google Drive ne permesas elŝuti “{name}”.',

  'error.missingClientId':
    'Mankas VITE_GOOGLE_CLIENT_ID. Agordu ĝin en via medio antaŭ ol uzi Google Drive.',
  'error.publicLinksNotConfigured':
    'Publikaj ligiloj ne estas agorditaj en ĉi tiu instalaĵo (mankas VITE_GOOGLE_API_KEY).',
  'error.gisNotLoaded': 'Google Identity Services ne estas ŝargita.',
  'error.gisNoToken': 'Google Identity Services ne redonis alirĵetonon.',
  'error.gisTimeout':
    'Tempolimo superita dum ŝargado de Google Identity Services.',
  'error.gisNoOauth':
    'Google Identity Services ŝargiĝis, sed OAuth ne disponeblas.',
  'error.gisLoadFailed': 'Malsukcesis ŝargi Google Identity Services.',
  'error.missingState': 'Mankas la stato de Google Drive.',
  'error.invalidState': 'Nevalida stato de Google Drive.',
  'error.stateNoIds':
    'La malferma stato de Google Drive devas enhavi almenaŭ unu dosieran identigilon.',
  'error.stateIdsStrings':
    'Dosieraj identigiloj de Google Drive devas esti ĉenoj.',
  'error.resourceKeysObject':
    'Rimedoŝlosiloj de Google Drive devas esti objekto.',
  'error.resourceKeysStrings':
    'Valoroj de rimedoŝlosiloj de Google Drive devas esti ĉenoj.',
  'error.openOnly':
    'Ĉi tiu enirpunkto subtenas nur malfermajn agojn de Google Drive.',
  'error.createOnly':
    'Ĉi tiu enirpunkto subtenas nur kreajn agojn de Google Drive.',
  'error.missingFileId': 'Mankas fileId en la publika ligilo.',
  'error.invalidFileId': 'Nevalida fileId en la publika ligilo.',
  'error.readOnlyFile':
    'Ĉi tiu dosiero de Google Drive estas nurlega kaj ne povas esti anstataŭigita.',
  'error.driveFailed': 'La peto al Google Drive malsukcesis.',
  'error.missingContent': 'Mankas la enhavo de la Drive-dosiero.',
  'error.noUploadSession':
    'Drive ne redonis URL de rekomencebla alŝuta seanco.',
  'error.swUnavailable':
    'Service Workers ne disponeblas en ĉi tiu retumila kunteksto.',
  'error.swInactive': 'La Service Worker de eXeLearning ne estas aktiva.',
  'error.swRejected': 'La Service Worker rifuzis la mesaĝon.',
  'error.notZip': 'Ne estas ZIP-arkivo',
  'error.zipDecode': 'ZIP-malkodado malsukcesis',
  'error.tooManyEntries': 'La pakaĵo havas pli ol {max} erojn',
  'error.unsafeEntry': 'Nesekura vojo de ero: {name}',
  'error.packageTooLarge':
    'La pakaĵo superas la limon de densigita grandeco ({size} > {max})',
  'error.decompressedTooLarge':
    'La maldensigita pakaĵo superas la limon ({size} > {max})',
  'error.editorNotReady': 'La eXeLearning-redaktilo ankoraŭ ne estas preta.',
  'error.editorFrameMissing': 'La iframe de la redaktilo ne disponeblas.',
  'error.savePayloadNoBytes':
    'La redaktilo redonis konservaĵon sen binaraj datumoj.',
};

export default eo;
