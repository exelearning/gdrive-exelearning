import type { Messages } from '../index';

// Translated from en.ts by an AI assistant; pending review by a native speaker.
const fr: Messages = {
  'home.brandSuffix': 'pour Google Drive',
  'home.nav.site': 'eXeLearning.net',
  'home.nav.source': 'Code source',
  'home.title': 'Modifiez vos projets eXeLearning dans Google Drive',
  'home.lead':
    'Ouvrez, modifiez et enregistrez des fichiers .elpx depuis Drive, dans votre navigateur. Vos fichiers ne quittent jamais votre Drive.',
  'home.connect': 'Connecter Google Drive',
  'home.connectHint':
    'Ajoute eXeLearning au menu « Ouvrir avec » de Drive. Gratuit et open source.',
  'home.connected': 'Connecté à Google Drive',
  'home.openDrive': 'Ouvrir Google Drive',
  'home.newProject': 'Nouveau projet dans Drive',
  'home.howItWorks': 'Comment ça marche',
  'home.step1.title': 'Connectez-vous une fois',
  'home.step1.body':
    'Connectez-vous avec Google et autorisez eXeLearning à ouvrir les fichiers que vous choisissez. Il ne voit rien d’autre dans votre Drive.',
  'home.step2.title': 'Ouvrez depuis Drive',
  'home.step2.body':
    'Faites un clic droit sur un fichier .elpx et choisissez {openWith}. Pour partir de zéro : Nouveau → Plus → eXeLearning.',
  'home.step2.openWith': 'Ouvrir avec → eXeLearning',
  'home.menu.preview': 'Aperçu',
  'home.menu.openWith': 'Ouvrir avec',
  'home.menu.download': 'Télécharger',
  'home.step3.title': 'Modifiez, enregistrez, partagez',
  'home.step3.body':
    'Enregistrez dans Drive en un clic. Partagez un lien en lecture seule pour que les élèves ouvrent le projet sans compte Google.',
  'home.check.title': 'Vérification du système',
  'home.check.clientOk': 'Client Google configuré',
  'home.check.clientMissing': 'VITE_GOOGLE_CLIENT_ID manquant',
  'home.check.editorChecking': 'Vérification de l’éditeur…',
  'home.check.editorReady': 'Éditeur prêt',
  'home.check.editorMissing': 'Éditeur introuvable à {path}',
  'home.check.notConnected': 'Non connecté à Google Drive',
  'home.check.requesting': 'Demande d’autorisation…',
  'home.footer.tagline':
    'eXeLearning pour Google Drive · gratuit et open source',
  'home.footer.privacy': 'Politique de confidentialité',
  'home.footer.terms': 'Conditions d’utilisation',
  'home.language': 'Langue',

  'toolbar.back': 'Retour à Google Drive',
  'toolbar.authorizeOpen': 'Autoriser et ouvrir',
  'toolbar.authorizeCreate': 'Autoriser et créer',
  'toolbar.share': 'Partager un lien public',
  'toolbar.shareUnavailable':
    'Les liens publics ne sont pas configurés sur ce déploiement.',
  'toolbar.save': 'Enregistrer dans Drive',
  'toolbar.edit': 'Modifier dans eXeLearning',
  'toolbar.cannotEdit':
    'Vous n’avez pas l’autorisation de modifier ce fichier dans Google Drive.',
  'toolbar.editorAria': 'Éditeur eXeLearning',
  'toolbar.viewerAria': 'Visionneuse eXeLearning',

  'status.connecting': 'Connexion à Google Drive…',
  'status.clickAuthorizeOpen':
    'Cliquez sur « Autoriser et ouvrir » pour continuer.',
  'status.clickAuthorizePreview':
    'Cliquez sur « Autoriser et ouvrir » pour prévisualiser ce fichier.',
  'status.clickAuthorizeCreate':
    'Cliquez sur « Autoriser et créer » pour continuer.',
  'status.requestingAuth': 'Demande d’autorisation Google…',
  'status.fetchingMetadata': 'Récupération des métadonnées Google Drive…',
  'status.loadingTemplate': 'Chargement du modèle .elpx vide…',
  'status.creatingFile': 'Création du fichier dans Google Drive…',
  'status.loadingEditor': 'Chargement de l’éditeur eXeLearning…',
  'status.openingEditor': 'Ouverture de l’éditeur…',
  'status.opening': 'Ouverture…',
  'status.opened': 'Ouvert.',
  'status.openedReadOnly': 'Ouvert en lecture seule.',
  'status.openedLegacy':
    'Ancien fichier ouvert. L’enregistrement créera un nouveau .elpx dans le même dossier.',
  'status.created': 'Créé.',
  'status.unsaved': 'Modifications non enregistrées.',
  'status.requestingSave': 'Demande du .elpx mis à jour à l’éditeur…',
  'status.checkingRemote': 'Vérification des modifications distantes…',
  'status.saveCancelled': 'Enregistrement annulé.',
  'status.saved': 'Enregistré dans Google Drive.',
  'status.readingPackage': 'Lecture du paquet…',
  'status.previewLoaded': 'Aperçu chargé.',
  'status.legacyFile': 'Ancien fichier : cliquez sur Modifier pour le migrer.',
  'status.fetchingPublic': 'Récupération depuis Google Drive…',
  'status.downloading': 'Téléchargement…',
  'status.loaded': 'Chargé.',
  'status.sharing': 'Partage avec toute personne disposant du lien…',
  'status.linkReady': 'Lien public prêt.',

  'saving.title': 'Enregistrement dans Drive…',
  'saving.hint': 'Veuillez patienter pendant l’enregistrement du fichier.',
  'saving.failed': 'Échec de l’enregistrement',
  'common.close': 'Fermer',
  'conflict.changed':
    '« {filename} » a été modifié dans Google Drive depuis son ouverture.\n\nCliquez sur OK pour écraser le fichier Drive, ou sur Annuler pour choisir une autre option.',
  'conflict.saveCopy':
    'Enregistrer le contenu de l’éditeur comme une nouvelle copie ? Cliquez sur Annuler pour ne pas enregistrer.',

  'share.title': 'Partager « {filename} »',
  'share.generalAccess': 'Accès général',
  'share.restricted': 'Limité',
  'share.restrictedHint':
    'Seules les personnes ayant accès dans Google Drive peuvent l’ouvrir.',
  'share.calloutLead':
    'Un lien public le passe en « Tous les utilisateurs disposant du lien » avec le rôle Lecteur dans Google Drive.',
  'share.calloutBody':
    'Toute personne sur Internet disposant du lien pourra consulter le projet et télécharger le fichier .elpx, sans compte Google.',
  'share.cancel': 'Annuler',
  'share.create': 'Créer un lien public',
  'share.sharing': 'Partage…',
  'share.anyone': 'Tous les utilisateurs disposant du lien',
  'share.anyoneHint':
    'Toute personne sur Internet disposant du lien peut le consulter. Aucune connexion requise.',
  'share.viewer': 'Lecteur',
  'share.linkLabel': 'Lien public pour les élèves',
  'share.copy': 'Copier le lien',
  'share.copied': 'Copié',
  'share.stopHint':
    'Pour arrêter le partage, remettez l’accès général sur Limité dans Google Drive.',
  'share.manage': 'Gérer dans Google Drive',
  'share.done': 'Terminé',
  'share.errorTitle': 'Impossible de créer un lien public',
  'share.errorLead': 'Google Drive a refusé la modification.',
  'share.workspaceHint':
    'Votre administrateur Google Workspace restreint peut-être « Tous les utilisateurs disposant du lien ». Vous pouvez tout de même partager le fichier avec les personnes de votre domaine depuis Google Drive ; elles l’ouvrent avec Ouvrir avec → eXeLearning.',

  'viewer.errorTitle': 'Impossible d’ouvrir ce fichier',
  'viewer.legacyClickEdit':
    'Cliquez sur Modifier pour l’ouvrir dans l’éditeur.',
  'viewer.legacyUnsupported':
    'Ce fichier provient d’une ancienne version d’eXeLearning et ne peut pas être prévisualisé.',
  'viewer.packageUnreadable': 'Le paquet n’a pas pu être lu.',
  'viewer.invalidPackage':
    'Le fichier n’a pas pu être lu comme un paquet eXeLearning valide.',
  'viewer.noIndex': 'Le paquet ne contient pas de fichier index.html.',
  'viewer.notShared':
    'Ce fichier n’est pas partagé publiquement (« Tous les utilisateurs disposant du lien ») ou n’existe plus dans Google Drive.',
  'viewer.downloadForbidden':
    'Google Drive n’autorise pas le téléchargement de « {name} ».',

  'error.missingClientId':
    'VITE_GOOGLE_CLIENT_ID manquant. Configurez-le dans votre environnement avant d’utiliser Google Drive.',
  'error.publicLinksNotConfigured':
    'Les liens publics ne sont pas configurés sur ce déploiement (VITE_GOOGLE_API_KEY manquant).',
  'error.gisNotLoaded': 'Google Identity Services n’est pas chargé.',
  'error.gisNoToken':
    'Google Identity Services n’a pas renvoyé de jeton d’accès.',
  'error.gisTimeout':
    'Délai dépassé lors du chargement de Google Identity Services.',
  'error.gisNoOauth':
    'Google Identity Services est chargé, mais OAuth n’est pas disponible.',
  'error.gisLoadFailed': 'Échec du chargement de Google Identity Services.',
  'error.missingState': 'État Google Drive manquant.',
  'error.invalidState': 'État Google Drive non valide.',
  'error.stateNoIds':
    'L’état d’ouverture Google Drive doit inclure au moins un identifiant de fichier.',
  'error.stateIdsStrings':
    'Les identifiants de fichier Google Drive doivent être des chaînes.',
  'error.resourceKeysObject':
    'Les clés de ressource Google Drive doivent être un objet.',
  'error.resourceKeysStrings':
    'Les valeurs des clés de ressource Google Drive doivent être des chaînes.',
  'error.openOnly':
    'Ce point d’entrée ne prend en charge que les actions d’ouverture de Google Drive.',
  'error.createOnly':
    'Ce point d’entrée ne prend en charge que les actions de création de Google Drive.',
  'error.missingFileId': 'fileId manquant dans le lien public.',
  'error.invalidFileId': 'fileId non valide dans le lien public.',
  'error.readOnlyFile':
    'Ce fichier Google Drive est en lecture seule et ne peut pas être écrasé.',
  'error.driveFailed': 'La requête Google Drive a échoué.',
  'error.missingContent': 'Contenu du fichier Drive manquant.',
  'error.noUploadSession':
    'Drive n’a pas renvoyé d’URL de session d’envoi reprenable.',
  'error.swUnavailable':
    'Les Service Workers ne sont pas disponibles dans ce contexte de navigateur.',
  'error.swInactive': 'Le Service Worker eXeLearning n’est pas actif.',
  'error.swRejected': 'Le Service Worker a rejeté le message.',
  'error.notZip': 'Ce n’est pas une archive ZIP',
  'error.zipDecode': 'Échec du décodage ZIP',
  'error.tooManyEntries': 'Le paquet contient plus de {max} entrées',
  'error.unsafeEntry': 'Chemin d’entrée non sûr : {name}',
  'error.packageTooLarge':
    'Le paquet dépasse la limite de taille compressée ({size} > {max})',
  'error.decompressedTooLarge':
    'Le paquet décompressé dépasse la limite ({size} > {max})',
  'error.editorNotReady': 'L’éditeur eXeLearning n’est pas encore prêt.',
  'error.editorFrameMissing': 'L’iframe de l’éditeur n’est pas disponible.',
  'error.savePayloadNoBytes':
    'L’éditeur a renvoyé un enregistrement sans données binaires.',
};

export default fr;
