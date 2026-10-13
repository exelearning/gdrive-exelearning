import type { Messages } from '../index';

// Translated from en.ts by an AI assistant; pending review by a native speaker.
const de: Messages = {
  'home.brandSuffix': 'für Google Drive',
  'home.nav.site': 'eXeLearning.net',
  'home.nav.source': 'Quellcode',
  'home.title': 'eXeLearning-Projekte in Google Drive bearbeiten',
  'home.lead':
    'Öffnen, bearbeiten und speichern Sie .elpx-Dateien direkt aus Drive, im Browser. Ihre Dateien verlassen Ihr Drive nie.',
  'home.connect': 'Google Drive verbinden',
  'home.connectHint':
    'Fügt eXeLearning dem Menü „Öffnen mit“ von Drive hinzu. Kostenlos und Open Source.',
  'home.connected': 'Mit Google Drive verbunden',
  'home.openDrive': 'Google Drive öffnen',
  'home.newProject': 'Neues Projekt in Drive',
  'home.howItWorks': 'So funktioniert es',
  'home.step1.title': 'Einmal verbinden',
  'home.step1.body':
    'Melden Sie sich mit Google an und erlauben Sie eXeLearning, die von Ihnen gewählten Dateien zu öffnen. Mehr sieht es von Ihrem Drive nicht.',
  'home.step2.title': 'Aus Drive öffnen',
  'home.step2.body':
    'Klicken Sie mit der rechten Maustaste auf eine .elpx-Datei und wählen Sie {openWith}. Für einen Neuanfang: Neu → Mehr → eXeLearning.',
  'home.step2.openWith': 'Öffnen mit → eXeLearning',
  'home.menu.preview': 'Vorschau',
  'home.menu.openWith': 'Öffnen mit',
  'home.menu.download': 'Herunterladen',
  'home.step3.title': 'Bearbeiten, speichern, teilen',
  'home.step3.body':
    'Mit einem Klick zurück in Drive speichern. Teilen Sie einen Nur-Lesen-Link, damit Lernende das Projekt ohne Google-Konto öffnen können.',
  'home.check.title': 'Systemprüfung',
  'home.check.clientOk': 'Google-Client konfiguriert',
  'home.check.clientMissing': 'VITE_GOOGLE_CLIENT_ID fehlt',
  'home.check.editorChecking': 'Editor wird geprüft…',
  'home.check.editorReady': 'Editor bereit',
  'home.check.editorMissing': 'Editor nicht gefunden unter {path}',
  'home.check.notConnected': 'Nicht mit Google Drive verbunden',
  'home.check.requesting': 'Autorisierung wird angefordert…',
  'home.footer.tagline':
    'eXeLearning für Google Drive · kostenlos und Open Source',
  'home.footer.privacy': 'Datenschutzerklärung',
  'home.footer.terms': 'Nutzungsbedingungen',
  'home.language': 'Sprache',

  'toolbar.back': 'Zurück zu Google Drive',
  'toolbar.authorizeOpen': 'Autorisieren und öffnen',
  'toolbar.authorizeCreate': 'Autorisieren und erstellen',
  'toolbar.share': 'Öffentlichen Link teilen',
  'toolbar.shareUnavailable':
    'Öffentliche Links sind in dieser Installation nicht konfiguriert.',
  'toolbar.save': 'In Drive speichern',
  'toolbar.edit': 'In eXeLearning bearbeiten',
  'toolbar.cannotEdit':
    'Sie haben keine Berechtigung, diese Datei in Google Drive zu bearbeiten.',
  'toolbar.editorAria': 'eXeLearning-Editor',
  'toolbar.viewerAria': 'eXeLearning-Viewer',

  'status.connecting': 'Verbindung mit Google Drive…',
  'status.clickAuthorizeOpen':
    'Klicken Sie auf „Autorisieren und öffnen“, um fortzufahren.',
  'status.clickAuthorizePreview':
    'Klicken Sie auf „Autorisieren und öffnen“, um eine Vorschau dieser Datei zu sehen.',
  'status.clickAuthorizeCreate':
    'Klicken Sie auf „Autorisieren und erstellen“, um fortzufahren.',
  'status.requestingAuth': 'Google-Autorisierung wird angefordert…',
  'status.fetchingMetadata': 'Google-Drive-Metadaten werden abgerufen…',
  'status.loadingTemplate': 'Leere .elpx-Vorlage wird geladen…',
  'status.creatingFile': 'Datei wird in Google Drive erstellt…',
  'status.loadingEditor': 'eXeLearning-Editor wird geladen…',
  'status.openingEditor': 'Editor wird geöffnet…',
  'status.opening': 'Wird geöffnet…',
  'status.opened': 'Geöffnet.',
  'status.openedReadOnly': 'Schreibgeschützt geöffnet.',
  'status.openedLegacy':
    'Alte Datei geöffnet. Beim Speichern wird eine neue .elpx im selben Ordner erstellt.',
  'status.created': 'Erstellt.',
  'status.unsaved': 'Nicht gespeicherte Änderungen.',
  'status.requestingSave': 'Aktualisierte .elpx wird vom Editor angefordert…',
  'status.checkingRemote': 'Prüfung auf Änderungen in Drive…',
  'status.saveCancelled': 'Speichern abgebrochen.',
  'status.saved': 'In Google Drive gespeichert.',
  'status.readingPackage': 'Paket wird gelesen…',
  'status.previewLoaded': 'Vorschau geladen.',
  'status.legacyFile':
    'Alte Datei: Klicken Sie auf Bearbeiten, um sie zu migrieren.',
  'status.fetchingPublic': 'Wird aus Google Drive abgerufen…',
  'status.downloading': 'Wird heruntergeladen…',
  'status.loaded': 'Geladen.',
  'status.sharing': 'Wird für alle mit dem Link freigegeben…',
  'status.linkReady': 'Öffentlicher Link bereit.',

  'saving.title': 'Wird in Drive gespeichert…',
  'saving.hint': 'Bitte warten Sie, während die Datei gespeichert wird.',
  'saving.failed': 'Speichern fehlgeschlagen',
  'common.close': 'Schließen',
  'conflict.changed':
    '„{filename}“ wurde seit dem Öffnen in Google Drive geändert.\n\nKlicken Sie auf OK, um die Drive-Datei zu überschreiben, oder auf Abbrechen, um eine andere Option zu wählen.',
  'conflict.saveCopy':
    'Den Inhalt des Editors stattdessen als neue Kopie speichern? Klicken Sie auf Abbrechen, um nicht zu speichern.',

  'share.title': '„{filename}“ teilen',
  'share.generalAccess': 'Allgemeiner Zugriff',
  'share.restricted': 'Eingeschränkt',
  'share.restrictedHint':
    'Nur Personen mit Zugriff in Google Drive können die Datei öffnen.',
  'share.calloutLead':
    'Ein öffentlicher Link stellt den Zugriff in Google Drive auf „Jeder, der über den Link verfügt“ als Betrachter um.',
  'share.calloutBody':
    'Jede Person im Internet mit dem Link kann das Projekt ansehen und die .elpx-Datei herunterladen, ohne Google-Konto.',
  'share.cancel': 'Abbrechen',
  'share.create': 'Öffentlichen Link erstellen',
  'share.sharing': 'Wird freigegeben…',
  'share.anyone': 'Jeder, der über den Link verfügt',
  'share.anyoneHint':
    'Jede Person im Internet mit dem Link kann es ansehen. Keine Anmeldung nötig.',
  'share.viewer': 'Betrachter',
  'share.linkLabel': 'Öffentlicher Link für Lernende',
  'share.copy': 'Link kopieren',
  'share.copied': 'Kopiert',
  'share.stopHint':
    'Um die Freigabe zu beenden, stellen Sie den allgemeinen Zugriff in Google Drive wieder auf Eingeschränkt.',
  'share.manage': 'In Google Drive verwalten',
  'share.done': 'Fertig',
  'share.errorTitle': 'Öffentlicher Link konnte nicht erstellt werden',
  'share.errorLead': 'Google Drive hat die Änderung abgelehnt.',
  'share.workspaceHint':
    'Möglicherweise schränkt Ihr Google-Workspace-Administrator „Jeder, der über den Link verfügt“ ein. Sie können die Datei trotzdem über Google Drive mit Personen Ihrer Domain teilen; sie öffnen sie über Öffnen mit → eXeLearning.',

  'viewer.errorTitle': 'Diese Datei konnte nicht geöffnet werden',
  'viewer.legacyClickEdit':
    'Klicken Sie auf Bearbeiten, um sie im Editor zu öffnen.',
  'viewer.legacyUnsupported':
    'Diese Datei stammt aus einer älteren eXeLearning-Version und kann nicht in der Vorschau angezeigt werden.',
  'viewer.packageUnreadable': 'Das Paket konnte nicht gelesen werden.',
  'viewer.invalidPackage':
    'Die Datei konnte nicht als gültiges eXeLearning-Paket gelesen werden.',
  'viewer.noIndex': 'Das Paket enthält keine index.html.',
  'viewer.notShared':
    'Diese Datei ist nicht öffentlich freigegeben („Jeder, der über den Link verfügt“) oder existiert in Google Drive nicht mehr.',
  'viewer.downloadForbidden':
    'Google Drive erlaubt das Herunterladen von „{name}“ nicht.',

  'error.missingClientId':
    'VITE_GOOGLE_CLIENT_ID fehlt. Konfigurieren Sie sie in Ihrer Umgebung, bevor Sie Google Drive verwenden.',
  'error.publicLinksNotConfigured':
    'Öffentliche Links sind in dieser Installation nicht konfiguriert (VITE_GOOGLE_API_KEY fehlt).',
  'error.gisNotLoaded': 'Google Identity Services ist nicht geladen.',
  'error.gisNoToken':
    'Google Identity Services hat kein Zugriffstoken zurückgegeben.',
  'error.gisTimeout':
    'Zeitüberschreitung beim Laden von Google Identity Services.',
  'error.gisNoOauth':
    'Google Identity Services wurde geladen, aber OAuth ist nicht verfügbar.',
  'error.gisLoadFailed':
    'Google Identity Services konnte nicht geladen werden.',
  'error.missingState': 'Google-Drive-Status fehlt.',
  'error.invalidState': 'Google-Drive-Status ist ungültig.',
  'error.stateNoIds':
    'Der Google-Drive-Öffnungsstatus muss mindestens eine Datei-ID enthalten.',
  'error.stateIdsStrings': 'Google-Drive-Datei-IDs müssen Zeichenketten sein.',
  'error.resourceKeysObject':
    'Google-Drive-Ressourcenschlüssel müssen ein Objekt sein.',
  'error.resourceKeysStrings':
    'Die Werte der Google-Drive-Ressourcenschlüssel müssen Zeichenketten sein.',
  'error.openOnly':
    'Dieser Endpunkt unterstützt nur Öffnen-Aktionen von Google Drive.',
  'error.createOnly':
    'Dieser Endpunkt unterstützt nur Erstellen-Aktionen von Google Drive.',
  'error.missingFileId': 'fileId fehlt im öffentlichen Link.',
  'error.invalidFileId': 'Ungültige fileId im öffentlichen Link.',
  'error.readOnlyFile':
    'Diese Google-Drive-Datei ist schreibgeschützt und kann nicht überschrieben werden.',
  'error.driveFailed': 'Die Google-Drive-Anfrage ist fehlgeschlagen.',
  'error.missingContent': 'Inhalt der Drive-Datei fehlt.',
  'error.noUploadSession':
    'Drive hat keine URL für eine fortsetzbare Upload-Sitzung zurückgegeben.',
  'error.swUnavailable':
    'Service Worker sind in diesem Browserkontext nicht verfügbar.',
  'error.swInactive': 'Der eXeLearning-Service-Worker ist nicht aktiv.',
  'error.swRejected': 'Der Service Worker hat die Nachricht abgelehnt.',
  'error.notZip': 'Kein ZIP-Archiv',
  'error.zipDecode': 'ZIP-Dekodierung fehlgeschlagen',
  'error.tooManyEntries': 'Das Paket hat mehr als {max} Einträge',
  'error.unsafeEntry': 'Unsicherer Eintragspfad: {name}',
  'error.packageTooLarge':
    'Das Paket überschreitet die komprimierte Größenbeschränkung ({size} > {max})',
  'error.decompressedTooLarge':
    'Das entpackte Paket überschreitet die Beschränkung ({size} > {max})',
  'error.editorNotReady': 'Der eXeLearning-Editor ist noch nicht bereit.',
  'error.editorFrameMissing': 'Das Editor-Iframe ist nicht verfügbar.',
  'error.savePayloadNoBytes':
    'Der Editor hat ein Speicherergebnis ohne Binärdaten zurückgegeben.',
};

export default de;
