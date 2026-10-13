/**
 * Source dictionary. Every other locale is typed against these keys, so a
 * missing or extra translation fails `npm run typecheck`.
 */
const en = {
  'home.brandSuffix': 'for Google Drive',
  'home.nav.site': 'eXeLearning.net',
  'home.nav.source': 'Source code',
  'home.title': 'Edit eXeLearning projects in Google Drive',
  'home.lead':
    'Open, edit and save .elpx files from Drive, in your browser. Your files never leave your Drive.',
  'home.connect': 'Connect Google Drive',
  'home.connectHint':
    'Adds eXeLearning to Drive’s “Open with” menu. Free and open source.',
  'home.connected': 'Connected to Google Drive',
  'home.openDrive': 'Open Google Drive',
  'home.newProject': 'New project in Drive',
  'home.howItWorks': 'How it works',
  'home.step1.title': 'Connect once',
  'home.step1.body':
    'Sign in with Google and allow eXeLearning to open the files you choose. Nothing else in your Drive is visible to it.',
  'home.step2.title': 'Open from Drive',
  'home.step2.body':
    'Right-click any .elpx file and choose {openWith}. To start from scratch: New → More → eXeLearning.',
  'home.step2.openWith': 'Open with → eXeLearning',
  'home.menu.preview': 'Preview',
  'home.menu.openWith': 'Open with',
  'home.menu.download': 'Download',
  'home.step3.title': 'Edit, save, share',
  'home.step3.body':
    'Save back to Drive with one click. Share a read-only link so students can open the project without a Google account.',
  'home.check.title': 'System check',
  'home.check.clientOk': 'Google client configured',
  'home.check.clientMissing': 'Missing VITE_GOOGLE_CLIENT_ID',
  'home.check.editorChecking': 'Checking editor…',
  'home.check.editorReady': 'Editor ready',
  'home.check.editorMissing': 'Editor not found at {path}',
  'home.check.notConnected': 'Not connected to Google Drive',
  'home.check.requesting': 'Requesting authorization…',
  'home.footer.tagline': 'eXeLearning for Google Drive · free and open source',
  'home.footer.privacy': 'Privacy Policy',
  'home.footer.terms': 'Terms of Service',
  'home.language': 'Language',

  'toolbar.back': 'Back to Google Drive',
  'toolbar.authorizeOpen': 'Authorize and open',
  'toolbar.authorizeCreate': 'Authorize and create',
  'toolbar.share': 'Share public link',
  'toolbar.shareUnavailable':
    'Public links are not configured on this deployment.',
  'toolbar.save': 'Save to Drive',
  'toolbar.edit': 'Edit in eXeLearning',
  'toolbar.cannotEdit':
    'You do not have permission to edit this file in Google Drive.',
  'toolbar.editorAria': 'eXeLearning editor',
  'toolbar.viewerAria': 'eXeLearning viewer',

  'status.connecting': 'Connecting to Google Drive…',
  'status.clickAuthorizeOpen': 'Click “Authorize and open” to continue.',
  'status.clickAuthorizePreview':
    'Click “Authorize and open” to preview this file.',
  'status.clickAuthorizeCreate': 'Click “Authorize and create” to continue.',
  'status.requestingAuth': 'Requesting Google authorization…',
  'status.fetchingMetadata': 'Fetching Google Drive metadata…',
  'status.loadingTemplate': 'Loading blank .elpx template…',
  'status.creatingFile': 'Creating Google Drive file…',
  'status.loadingEditor': 'Loading eXeLearning editor…',
  'status.openingEditor': 'Opening editor…',
  'status.opening': 'Opening…',
  'status.opened': 'Opened.',
  'status.openedReadOnly': 'Opened in read-only mode.',
  'status.openedLegacy':
    'Opened legacy file. Saving will create a new .elpx in the same folder.',
  'status.created': 'Created.',
  'status.unsaved': 'Unsaved changes.',
  'status.requestingSave': 'Requesting updated .elpx from the editor…',
  'status.checkingRemote': 'Checking for remote changes…',
  'status.saveCancelled': 'Save cancelled.',
  'status.saved': 'Saved to Google Drive.',
  'status.readingPackage': 'Reading package…',
  'status.previewLoaded': 'Preview loaded.',
  'status.legacyFile': 'Legacy file — click Edit to migrate it.',
  'status.fetchingPublic': 'Fetching from Google Drive…',
  'status.downloading': 'Downloading…',
  'status.loaded': 'Loaded.',
  'status.sharing': 'Sharing with anyone with the link…',
  'status.linkReady': 'Public link ready.',

  'saving.title': 'Saving to Drive…',
  'saving.hint': 'Please wait while the file is being saved.',
  'saving.failed': 'Save failed',
  'common.close': 'Close',
  'conflict.changed':
    '“{filename}” has changed in Google Drive since it was opened.\n\nPress OK to overwrite the Drive file, or Cancel to choose another option.',
  'conflict.saveCopy':
    'Save the editor contents as a new copy instead? Press Cancel to stop saving.',

  'share.title': 'Share “{filename}”',
  'share.generalAccess': 'General access',
  'share.restricted': 'Restricted',
  'share.restrictedHint':
    'Only people with access in Google Drive can open it.',
  'share.calloutLead':
    'A public link sets this to “Anyone with the link” as Viewer in Google Drive.',
  'share.calloutBody':
    'Anyone on the internet who has the link can view the project and download the .elpx file, with no Google account.',
  'share.cancel': 'Cancel',
  'share.create': 'Create public link',
  'share.sharing': 'Sharing…',
  'share.anyone': 'Anyone with the link',
  'share.anyoneHint':
    'Anyone on the internet with the link can view. No sign-in needed.',
  'share.viewer': 'Viewer',
  'share.linkLabel': 'Public link for students',
  'share.copy': 'Copy link',
  'share.copied': 'Copied',
  'share.stopHint':
    'To stop sharing, set General access back to Restricted in Google Drive.',
  'share.manage': 'Manage in Google Drive',
  'share.done': 'Done',
  'share.errorTitle': 'Couldn’t create a public link',
  'share.errorLead': 'Google Drive refused the change.',
  'share.workspaceHint':
    'Your Google Workspace administrator may restrict “Anyone with the link”. You can still share the file with people in your domain from Google Drive; they open it with Open with → eXeLearning.',

  'viewer.errorTitle': 'Could not open this file',
  'viewer.legacyClickEdit': 'Click Edit to open it in the editor.',
  'viewer.legacyUnsupported':
    'This file is from an older version of eXeLearning and cannot be previewed.',
  'viewer.packageUnreadable': 'The package could not be read.',
  'viewer.invalidPackage':
    'The file could not be read as a valid eXeLearning package.',
  'viewer.noIndex': 'The package does not contain an index.html.',
  'viewer.notShared':
    'This file is not shared publicly (“Anyone with the link”) or no longer exists in Google Drive.',
  'viewer.downloadForbidden':
    'Google Drive does not allow downloading “{name}”.',

  'error.missingClientId':
    'Missing VITE_GOOGLE_CLIENT_ID. Configure it in your environment before using Google Drive.',
  'error.publicLinksNotConfigured':
    'Public links are not configured on this deployment (missing VITE_GOOGLE_API_KEY).',
  'error.gisNotLoaded': 'Google Identity Services is not loaded.',
  'error.gisNoToken':
    'Google Identity Services did not return an access token.',
  'error.gisTimeout': 'Timed out loading Google Identity Services.',
  'error.gisNoOauth':
    'Google Identity Services loaded, but OAuth is not available.',
  'error.gisLoadFailed': 'Failed to load Google Identity Services.',
  'error.missingState': 'Missing Google Drive state.',
  'error.invalidState': 'Invalid Google Drive state.',
  'error.stateNoIds':
    'Google Drive open state must include at least one file id.',
  'error.stateIdsStrings': 'Google Drive file ids must be strings.',
  'error.resourceKeysObject': 'Google Drive resource keys must be an object.',
  'error.resourceKeysStrings':
    'Google Drive resource key values must be strings.',
  'error.openOnly': 'This endpoint only supports Google Drive open actions.',
  'error.createOnly':
    'This endpoint only supports Google Drive create actions.',
  'error.missingFileId': 'Missing fileId in the public link.',
  'error.invalidFileId': 'Invalid fileId in the public link.',
  'error.readOnlyFile':
    'This Google Drive file is read-only and cannot be overwritten.',
  'error.driveFailed': 'Google Drive request failed.',
  'error.missingContent': 'Missing Drive file content.',
  'error.noUploadSession':
    'Drive did not return a resumable upload session URL.',
  'error.swUnavailable':
    'Service Workers are not available in this browser context.',
  'error.swInactive': 'The eXeLearning Service Worker is not active.',
  'error.swRejected': 'Service Worker rejected the message.',
  'error.notZip': 'Not a ZIP archive',
  'error.zipDecode': 'ZIP decode failed',
  'error.tooManyEntries': 'Package has more than {max} entries',
  'error.unsafeEntry': 'Unsafe entry path: {name}',
  'error.packageTooLarge':
    'Package exceeds compressed-size limit ({size} > {max})',
  'error.decompressedTooLarge':
    'Decompressed package exceeds limit ({size} > {max})',
  'error.editorNotReady': 'The eXeLearning editor is not ready yet.',
  'error.editorFrameMissing': 'The editor iframe is not available.',
  'error.savePayloadNoBytes':
    'The editor returned a save payload without binary bytes.',
} as const;

export default en;
