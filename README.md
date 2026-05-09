# gdrive-exelearning

Static Vite TypeScript app for opening, editing, and saving eXeLearning
`.elpx` projects from Google Drive. The app is intended to be hosted as a
Google Drive UI integration: Drive launches the app with file metadata in the
URL, the app asks the user to authorize Drive access, and the bundled
eXeLearning editor handles the project content in the browser.

## Local Development

Install the Node dependencies first:

```sh
npm ci
```

Create a local environment file:

```sh
cp .env.example .env.local
```

Fill in the Google OAuth client ID and app origin values in `.env.local`, then
download the editor build and start Vite:

```sh
make download-editor
make dev
```

Useful targets:

```sh
make lint
make typecheck
make build
```

## Install or Download the Editor

The Vite app expects a static eXeLearning editor bundle under
`public/editor/`. The default `make download-editor` target downloads a zip
archive and extracts it there:

```sh
make download-editor
```

By default the Makefile downloads:

```sh
https://github.com/exelearning/exelearning/releases/download/v4.0.0/exelearning-static-v4.0.0.zip
```

Override the release or URL when needed:

```sh
EXELEARNING_EDITOR_REF=v4.0.1 make download-editor
EDITOR_ZIP_URL=https://example.com/exelearning-static.zip make download-editor
```

If the zip contains a single top-level directory, its contents are flattened
into `public/editor/`. If the zip already contains the editor files at the
root, those files are copied directly.

## Build the Editor From Source

Use these variables to point the Makefile at the upstream editor repository:

```sh
EXELEARNING_EDITOR_REPO_URL=https://github.com/exelearning/exelearning.git
EXELEARNING_EDITOR_REF=v4.0.0
EXELEARNING_EDITOR_REF_TYPE=tag
EDITOR_SOURCE_DIR=exelearning
EDITOR_OUTPUT_DIR=public/editor
```

Build and install the static editor output:

```sh
make build-editor
```

`build-editor` removes the old editor output, shallow-clones the selected
eXeLearning ref, runs `bun install`, and then runs:

```sh
OUTPUT_DIR=public/editor bun run build:static
```

`EXELEARNING_EDITOR_REF_TYPE` supports `branch`, `tag`, or `commit`.

## Google Cloud Setup

Create or choose a Google Cloud project, then configure it for Drive access.

1. Enable **Google Drive API** in **APIs & Services > Library**.
2. Configure the **OAuth consent screen**. Add the app name, support email,
   developer contact, and test users while the app is in testing mode.
3. Create an **OAuth client ID** in **APIs & Services > Credentials**.
   Choose **Web application**.
4. Add authorized JavaScript origins for every deployed origin, for example:

```text
http://localhost:5173
https://YOUR_GITHUB_USER.github.io
```

For Google Drive UI integration, open the Drive API configuration for the app
and add Drive UI URLs:

```text
Open URL: https://exelearning.github.io/gdrive-exelearning/open
New URL:  https://exelearning.github.io/gdrive-exelearning/create
```

Set the default file extension to:

```text
elpx
```

Use these scopes:

```text
https://www.googleapis.com/auth/drive.file
https://www.googleapis.com/auth/drive.install
```

Store the OAuth client ID in environment variables rather than source code:

```sh
VITE_GOOGLE_CLIENT_ID=...
VITE_GOOGLE_API_KEY=...
```

## Deploy

The included GitHub Actions workflow deploys to GitHub Pages on pushes to
`main`.

Before enabling it:

1. Add the static app package files and commit them.
2. Configure GitHub Pages to use **GitHub Actions** as the source.
3. Add any required Vite environment variables as repository variables or
   secrets.
4. Set `EDITOR_ZIP_URL` as a repository variable only if you need to override
   the default eXeLearning release URL.

The workflow runs:

```sh
npm ci
make download-editor
npm run build
```

Then it uploads and deploys the generated `dist/` directory.

## Limitations

- The app is static and runs entirely in the browser; there is no server-side
  token exchange or backend persistence.
- There is no collaborative editing.
- Access tokens live in memory only; there are no refresh tokens.
- Google OAuth origins must exactly match the deployed origin.
- Drive Picker is not implemented yet and can be added later.
- Resumable uploads are scaffolded but the first UI flow uses simple uploads.
- Drive UI integration changes can take time to propagate in Google Drive.
- Large `.elpx` files are constrained by browser memory and Drive upload limits.
