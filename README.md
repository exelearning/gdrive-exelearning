# gdrive-exelearning

[![Deploy to GitHub Pages](https://github.com/exelearning/gdrive-exelearning/actions/workflows/deploy.yml/badge.svg?branch=main)](https://github.com/exelearning/gdrive-exelearning/actions/workflows/deploy.yml)
![License: AGPL v3](https://img.shields.io/badge/License-AGPLv3-blue.svg)
![Last Commit](https://img.shields.io/github/last-commit/exelearning/gdrive-exelearning)
![Open Issues](https://img.shields.io/github/issues/exelearning/gdrive-exelearning)

Edit eXeLearning `.elpx` (and legacy `.elp`) projects directly from Google
Drive. The bundled static editor opens in the browser, the file stays in
your Drive — there is no backend, no server-side storage, and no refresh
tokens.

Live deploy: <https://exelearning.github.io/gdrive-exelearning/>

## Features

- **Open with eXeLearning** from Google Drive opens the project in an
  embedded eXeLearning editor and saves the result back to the same
  Drive file.
- **Create new projects** straight from Drive's "New" menu — the file
  appears in the chosen folder with a unique `Untitled.elpx` /
  `Untitled (N).elpx` name.
- **Legacy `.elp` upgrade**: opening a v2 `.elp` project loads it
  read-only in the editor and the next save creates a fresh `.elpx`
  next to the original (the legacy file is left untouched).
- **Drive thumbnails**: after every save we publish the editor's
  generated `screenshot.png` as the file's Drive thumbnail.
- **Conflict detection**: if Drive changed the file between open and
  save, the user is offered "overwrite", "save as copy" or "cancel".
- **Read-only fallback**: if Drive reports `canEdit=false`, the editor
  opens with the save button disabled.

## Usage

After enabling the Drive UI integration on your Google Cloud project
(see below), an end user opens a `.elpx` (or `.elp`) in Drive:

1. Right-click → **Open with → eXeLearning**.
2. The first time, click **Authorize and open**; subsequent visits go
   straight to the editor.
3. Edit the project. Use the **Save to Drive** button (or `Ctrl/Cmd+S`).
4. Drive metadata (`modifiedTime`, thumbnail, custom mime type) is
   updated to reflect the new content.

To create a new project, pick **New → eXeLearning** from any Drive
folder; the editor opens with a blank document and the file is created
in the same folder.

## Google Cloud setup

1. Create or pick a Google Cloud project and enable the **Google Drive
   API**.
2. Configure the **OAuth consent screen**:
   - User type: **External**, Publishing status: **In production**.
   - Required scopes: `https://www.googleapis.com/auth/drive.file` and
     `https://www.googleapis.com/auth/drive.install`. Both are
     non-sensitive, so no Google verification is required.
   - Authorized domain: your deploy origin (for the public deploy:
     `exelearning.github.io`).
   - Add a Privacy Policy URL and Terms of Service URL — Google
     requires both before flipping consent to production.
3. Create an **OAuth 2.0 Client ID** (Web application). Add the deploy
   origin to **Authorized JavaScript origins**.
4. In the Drive API console, configure **Drive UI integration**:
   - **Open URL**: `https://<origin>/gdrive-exelearning/open`
   - **New URL**: `https://<origin>/gdrive-exelearning/create`
   - **Default file extension**: `elpx`
   - **Secondary file extensions**: `elp`
   - **MIME types**: `application/octet-stream`,
     `application/vnd.exelearning.elpx`, `application/zip`.
5. Copy the OAuth client ID into the build environment as
   `VITE_GOOGLE_CLIENT_ID` (and optionally `VITE_GOOGLE_API_KEY`). For
   the official deploy, the GitHub Pages workflow reads them from
   repository secrets.

## Self-hosting

The app is a static site; any host that serves `dist/` works. The
default GitHub Actions workflow deploys to GitHub Pages on every push
to `main`.

```sh
git clone https://github.com/exelearning/gdrive-exelearning.git
cd gdrive-exelearning
npm ci
make download-editor   # fetches the latest exelearning release
npm run build
```

`make download-editor` always tracks the **latest** GitHub release of
[`exelearning/exelearning`](https://github.com/exelearning/exelearning/releases).
Pin a specific version with `EXELEARNING_EDITOR_REF=vX.Y.Z`.

To build the editor from source instead of a release ZIP:

```sh
make build-editor                          # latest release (default)
EXELEARNING_EDITOR_REF=main \
  EXELEARNING_EDITOR_REF_TYPE=branch \
  make build-editor                         # bleeding-edge
```

## Limitations

- No collaborative editing — each user sees their own Drive.
- Access tokens live in memory only; there are no refresh tokens, so
  long-idle tabs may need to re-authorize.
- The full inline preview Drive shows for `.elpx` files is still its
  zip viewer. The custom thumbnail and mime type help, but only the
  **Open with → eXeLearning** action gives the rich editor view.

## Contributing

See [`AGENTS.md`](AGENTS.md) for the protocol details (postMessage
shape, hideUI, srcdoc/`<base>` trick, the `REQUEST_SAVE` patch for
v4.0.0). PRs welcome.
