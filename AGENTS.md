<!-- AGENTS.md -->

# Agents Coding Conventions for “gdrive-exelearning”

These are natural-language guidelines for agents to follow when developing the `gdrive-exelearning` static Google Drive integration for eXeLearning.

## Project conventions

- This project is a **static Vite + TypeScript web app**. Do not add a backend, server-side session storage, server-side secrets, or refresh-token flow.
- The app is published at:
  ```text
  https://exelearning.github.io/gdrive-exelearning/
  ```
- Keep Vite configured with:
  ```ts
  base: '/gdrive-exelearning/'
  ```
- Use **plain browser APIs** and minimal dependencies. Do not introduce React, Vue, Angular, server frameworks, Google client SDKs, or state-management libraries unless explicitly requested.
- Use English for source code, identifiers, comments, documentation, and first-version UI strings.
- Keep code simple and auditable. Prefer small modules with explicit inputs and clear errors.
- Keep `.elpx` files as **binary files**. Do not inspect, parse, patch, unzip, regenerate, or edit internals such as `content.xml`.
- Do not implement a new editor. The editor is the existing eXeLearning static editor installed under `public/editor/`.
- Do not commit downloaded or built editor files. `public/editor/` should keep only `.gitkeep` tracked.

## Documentation lookup

- Use **Context7 MCP** to fetch current documentation whenever the user asks about a library, framework, SDK, API, CLI tool, or cloud service.
- This includes Vite, TypeScript, Google Identity Services, Google Drive API, GitHub Actions, GitHub Pages, and related CLI tooling.
- Start with `resolve-library-id` unless the user provides an exact `/org/project` Context7 library ID.
- Then use `query-docs` with the selected library ID and the full user question.
- Do not use Context7 for repository-local refactors, business-logic debugging, code review, or general programming concepts.

## Testing and development workflow

- Use TypeScript strict mode.
- Add focused tests for pure parsing, state, Drive helper behavior, and conflict logic.
- Keep tests under `src/**/*.test.ts` and run them with Vitest.
- Before submitting changes, run:
  ```sh
  npm ci
  npm run typecheck
  npm test
  npm run build
  make -n download-editor fetch-editor-source build-editor clean-editor build dev lint typecheck
  git diff --check
  ```
- If deployment files change, also check the GitHub Actions run:
  ```sh
  gh run list --branch main --limit 5
  gh run watch <RUN_ID> --exit-status
  curl -I https://exelearning.github.io/gdrive-exelearning/
  ```
- Do not claim a workflow, build, or deployment works without fresh command output.

## Tooling quick start

- Install dependencies:
  ```sh
  npm ci
  ```
- Create local environment:
  ```sh
  cp .env.example .env.local
  ```
- Fill in:
  ```text
  VITE_GOOGLE_CLIENT_ID=
  VITE_GOOGLE_API_KEY=
  ```
- Download the static editor:
  ```sh
  make download-editor
  ```
- Start local development:
  ```sh
  make dev
  ```
- Build the app:
  ```sh
  make build
  ```

## Makefile conventions

- Keep these targets:
  ```text
  download-editor
  fetch-editor-source
  build-editor
  clean-editor
  build
  dev
  lint
  typecheck
  ```
- Keep these variables:
  ```makefile
  EXELEARNING_EDITOR_REPO_URL ?= https://github.com/exelearning/exelearning.git
  EXELEARNING_EDITOR_REF ?= v4.0.0
  EXELEARNING_EDITOR_REF_TYPE ?= tag
  EDITOR_SOURCE_DIR := exelearning
  EDITOR_OUTPUT_DIR := $(CURDIR)/public/editor
  EDITOR_ZIP_URL ?= https://github.com/exelearning/exelearning/releases/download/$(EXELEARNING_EDITOR_REF)/exelearning-static-$(EXELEARNING_EDITOR_REF).zip
  ```
- `download-editor` must remove the old editor output, download the configured release ZIP, and extract it into `public/editor`.
- `build-editor` must remove the old editor output, shallow-clone `exelearning/exelearning`, run `bun install`, and run:
  ```sh
  OUTPUT_DIR=$(EDITOR_OUTPUT_DIR) bun run build:static
  ```

## Drive UI integration UX

- The Drive UI integration sends users to `/open?state=<URL-encoded JSON>` and
  `/create?state=<URL-encoded JSON>`. Parse the state immediately and replace
  the URL with `history.replaceState(null, '', '?fileId=…')` (or
  `?folderId=…`) so the address bar stays readable while the editor is loaded.
- On both routes, attempt a **silent** Google authorization
  (`requestAccessToken({ prompt: 'none', interactive: false })`) on page load
  and start the open/create flow if it succeeds. This is the only way to
  bypass the intermediate "Authorize and open" click for users who have
  already granted access, since Google Identity Services rejects
  `prompt: 'consent'` calls without a user gesture for first-time consent.
- Disable the visible "Authorize and …" button while the silent attempt is
  in flight to avoid racing the same `pendingRequest` in the token client.
  Re-enable it (and surface a "Click … to continue" hint) only after the
  silent attempt has settled with an error.
- Mirror wp-exelearning's "Saving…" overlay
  (`assets/js/exelearning-editor.js`): a full-screen blocking modal with a
  spinner during `requestSave` + Drive upload, switched to an error state
  with a Close button on failure. Implementation lives in
  `src/ui/dialogs.ts` (`SavingModal`).
- The editor toolbar should show "eXeLearning – &lt;filename&gt;" on the left,
  a "Save to Drive" button with an inline Drive logo SVG, and a "Close" button
  on the right. Hide the in-editor "Save" via `hideUI` so the parent button is
  the only save affordance.

## Google OAuth and Drive conventions

- Use Google Identity Services token model:
  - Load `https://accounts.google.com/gsi/client`.
  - Use `google.accounts.oauth2.initTokenClient`.
  - Store access tokens in memory only.
  - Do not use refresh tokens.
  - Do not include a client secret.
- Required scopes:
  ```text
  https://www.googleapis.com/auth/drive.file
  https://www.googleapis.com/auth/drive.install
  ```
- Drive API calls must use `fetch`.
- Always pass:
  ```http
  Authorization: Bearer <token>
  ```
- When available, pass resource keys with:
  ```http
  X-Goog-Drive-Resource-Keys: FILE_ID/RESOURCE_KEY
  ```
- Download `.elpx` content with `files.get?alt=media`.
- Save existing files with:
  ```text
  PATCH /upload/drive/v3/files/{fileId}?uploadType=media
  ```
- Before saving, fetch metadata again and compare `version` or `modifiedTime` with the open snapshot.
- If the remote file changed, show overwrite, save as copy, and cancel choices.
- If `capabilities.canDownload` is false, stop with a clear error.
- If `capabilities.canEdit` is false, open read-only and disable saving.

## Editor integration conventions

- Embed the static editor in an iframe.
- Load the editor by fetching `public/editor/index.html` and writing the
  transformed HTML to `iframe.srcdoc`. Setting `iframe.src` directly does not
  work because the editor's `RuntimeConfig` reads
  `window.__EXE_EMBEDDING_CONFIG__` during the initial bundle load — long
  before any `iframe.load` listener could inject a script.
- Always inject these into the iframe HTML before any editor `<script>` tag:
  1. A `<base>` tag pointing at the absolute editor folder
     (`https://<host>/gdrive-exelearning/editor/`). Without it, the editor's
     relative URLs (`./libs/...`, `./app/...`) resolve against `about:srcdoc`
     and 404.
  2. A `<script>` that defines `window.__EXE_EMBEDDING_CONFIG__` with at least:
     ```js
     {
       basePath: '/gdrive-exelearning/editor', // no trailing slash
       parentOrigin: window.location.origin,
       trustedOrigins: [window.location.origin],
     }
     ```
     Without an explicit `basePath`, the editor's auto-detection uses
     `window.location.pathname` and ends up fetching i18n / static assets from
     the parent route (e.g. `/gdrive-exelearning/open/app/...`) which 404s.
- Inject only a tiny bridge script for Ctrl/Cmd+S forwarding. Do **not**
  synthesize `EXELEARNING_READY` or `DOCUMENT_LOADED` from the parent — the
  editor's own `EmbeddingBridge`
  (`public/app/core/EmbeddingBridge.js`) emits them at the right moment.
  Faking them races the editor's bootstrap and causes `OPEN_FILE` to be
  delivered before the bridge has attached its listener, so the editor opens
  an empty default document instead of the file.
- Use the official postMessage protocol exactly:
  - `EXELEARNING_READY` — Stage 1, infrastructure ready, capabilities listed.
  - `OPEN_FILE` (parent → editor): `{ type, requestId, data: { bytes, filename } }`.
  - `OPEN_FILE_SUCCESS` / `OPEN_FILE_ERROR` (editor → parent, correlated by `requestId`).
  - `DOCUMENT_LOADED` — Stage 2, fired exactly **once** during the editor's
    initial empty-project bootstrap. Subsequent `OPEN_FILE` calls do **not**
    re-emit it (the underlying `documentReady` Promise can only resolve one
    time). Treat `OPEN_FILE_SUCCESS` as the "file is ready" signal: the
    editor sends it from `EmbeddingBridge.handleOpenFile` only after
    `project.refreshAfterDirectImport()` has completed.
  - `REQUEST_SAVE` (parent → editor): `{ type, requestId }`.
  - `SAVE_FILE` (editor → parent): `{ type, requestId, bytes, filename, size }` with fields at the top level (not under `data`).
  - `EXELEARNING_EVENT` carries change notifications such as
    `event: 'PROJECT_DIRTY' | 'PROJECT_SAVED'` under `data.isDirty`.
- `__EXE_EMBEDDING_CONFIG__.hideUI` is the canonical way to hide the editor's
  built-in toolbar (file menu, save button, user menu). Mirror the same list
  with a defensive `display: none !important` style sheet (see
  `editor-boot.ts` `FORCE_HIDE_SELECTORS`) so a re-render in the editor cannot
  accidentally bring the duplicate "Save" button back. The parent UI must own
  the only "Save" affordance the user sees.
- After receiving `EXELEARNING_READY`, send a `CONFIGURE` message with the
  same `hideUI` payload as a defensive re-application. The editor's bridge
  applies it via `applyHideUI` regardless of when it arrives.
- Do not copy integration-specific message names such as `WP_REQUEST_SAVE`.
- Transfer `.elpx` bytes as `ArrayBuffer` and pass them to `postMessage` in the
  transferable list to avoid large copies.
- Use `'*'` as the `targetOrigin` when posting to the iframe. Because the
  iframe is loaded via `srcdoc`, its effective origin is `null` and a strict
  origin check on the parent side would silently drop every message.

### Reference

The canonical embedding documentation lives in the eXeLearning repository at
`doc/development/embedding.md`. The bridge implementation it describes lives
at `public/app/core/EmbeddingBridge.js`, and the runtime configuration that
reads `window.__EXE_EMBEDDING_CONFIG__` is at
`public/app/core/RuntimeConfig.js`. When in doubt about message shape or
lifecycle, read those files in the cloned editor source rather than guessing.

## Route conventions

- `/` is the home page:
  - app title
  - authorize Google button
  - disabled/open-later Drive Picker button
  - editor installation diagnostics
- `/open` is the Google Drive Open URL endpoint.
- `/create` is the Google Drive New URL endpoint.
- Parse and validate Google Drive `state` parameters before requesting OAuth tokens.
- Keep route code thin; put reusable auth, Drive, editor, and UI behavior in their own modules.

## Repository structure

```text
.
├── README.md
├── LICENSE
├── Makefile
├── package.json
├── vite.config.ts
├── index.html
├── .env.example
├── .github/workflows/deploy.yml
├── public/
│   ├── editor/
│   ├── templates/
│   │   └── blank.elpx
│   └── icons/
└── src/
    ├── main.ts
    ├── config.ts
    ├── pages/
    ├── auth/
    ├── drive/
    ├── editor/
    └── ui/
```

## Code style and structure

- Prefer explicit TypeScript interfaces for Drive metadata, Drive state, editor messages, and save payloads.
- Keep browser globals typed in the module that uses them.
- Keep DOM creation simple; avoid framework-like abstractions.
- Use `URL` and `URLSearchParams` for URL manipulation.
- Use structured APIs for JSON parsing and request building.
- Avoid ad hoc string manipulation except where building multipart upload bodies or injected iframe bootstrap HTML requires it.
- Keep comments short and only where they explain non-obvious integration behavior.
- Do not add broad abstractions until there are at least two real call sites that benefit from them.

## GitHub Pages deployment

- Deploy through `.github/workflows/deploy.yml`.
- The workflow must:
  1. run on push to `main`;
  2. install Node;
  3. run `npm ci`;
  4. run `make download-editor`;
  5. run `npm run build`;
  6. deploy `dist/` to GitHub Pages.
- If the workflow fails at `Configure Pages` because the Pages site does not exist, enable Pages with workflow build type and rerun.

## Aider-specific usage

- Always load `AGENTS.md` as the conventions file, for example with `/read AGENTS.md` or via config.
- Use `/ask` mode to plan large changes, then `/code` or `/architect` to apply.
- Review every diff before accepting it.
- Add only relevant files to the chat context.
