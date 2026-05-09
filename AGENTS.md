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
- Load the editor from `public/editor/index.html`.
- Inject a `<base>` tag pointing to the editor folder.
- Define `window.__EXE_EMBEDDING_CONFIG__` inside the iframe document.
- Inject only a tiny bridge script for:
  - Ctrl/Cmd+S forwarding.
  - readiness forwarding if needed.
  - path/config fixes if needed.
- Prefer the official neutral postMessage protocol:
  - `EXELEARNING_READY`
  - `OPEN_FILE`
  - `DOCUMENT_LOADED`
  - `DOCUMENT_CHANGED`
  - `REQUEST_SAVE`
  - `SAVE_FILE`
- Do not copy integration-specific message names such as `WP_REQUEST_SAVE`.
- Transfer `.elpx` bytes as `ArrayBuffer`.

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
