# gdrive-exelearning

[![Deploy to GitHub Pages](https://github.com/exelearning/gdrive-exelearning/actions/workflows/deploy.yml/badge.svg?branch=main)](https://github.com/exelearning/gdrive-exelearning/actions/workflows/deploy.yml)
![License: AGPL v3](https://img.shields.io/badge/License-AGPLv3-blue.svg)
![Last Commit](https://img.shields.io/github/last-commit/exelearning/gdrive-exelearning)

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
  in the editor and the next save creates a fresh `.elpx` next to the
  original (the legacy file is left untouched).
- **Drive thumbnails**: after every save we publish the editor's
  generated `screenshot.png` as the file's Drive thumbnail.
- **Conflict detection**: if Drive changed the file between open and
  save, the user is offered "overwrite", "save as copy" or "cancel".
- **Read-only fallback**: if Drive reports `canEdit=false`, the editor
  opens with the save button disabled.

## Usage

After the Drive UI integration is enabled on the Google Cloud project,
end users see eXeLearning right next to Google's own apps in Drive:

1. Right-click a `.elpx` (or `.elp`) → **Open with → eXeLearning**.
2. The first time, click **Authorize and open**; subsequent visits go
   straight to the editor.
3. Edit the project. Use the **Save to Drive** button or `Ctrl/Cmd+S`.
4. Drive metadata (`modifiedTime`, thumbnail, custom mime type) is
   updated to reflect the new content.

To create a new project, pick **New → eXeLearning** from any Drive
folder; the editor opens with a blank document and the file is created
in the same folder.

## Limitations

- The app is static and runs entirely in the browser; there is no
  server-side token exchange or backend persistence.
- There is no collaborative editing.
- Large `.elpx` files are constrained by browser memory and Drive
  upload limits.

## Self-hosting

To run your own deploy (Google Cloud project, OAuth client, Drive UI
integration), see [`SELF-HOSTING.md`](SELF-HOSTING.md).

## Contributing

See [`AGENTS.md`](AGENTS.md) for the protocol details (postMessage
shape, hideUI, srcdoc/`<base>` trick, the `REQUEST_SAVE` patch for
v4.0.0). PRs welcome.

## Issues and Support

Issue tracking for this app is centralized in the main
[`exelearning/exelearning`](https://github.com/exelearning/exelearning) repository.
Please [open new issues there](https://github.com/exelearning/exelearning/issues/new),
and browse [existing `gdrive`-labeled issues](https://github.com/exelearning/exelearning/issues?q=is%3Aissue+label%3Agdrive)
before reporting a bug or requesting a feature.
