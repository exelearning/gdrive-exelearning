# Self-hosting `gdrive-exelearning`

Deploy your own instance of the Google Drive integration.

## 1. Build and host the static site

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

## 2. Google Cloud project

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
   GitHub Pages deploys, store them as repository secrets so the
   workflow embeds them at build time.

## 3. Verify

After the first deploy:

1. Open Drive, right-click a `.elpx` file → **Open with → eXeLearning**.
2. The Drive UI should hand control to your `https://<origin>/gdrive-exelearning/open`.
3. Click **Authorize and open**, edit, and **Save to Drive**. Drive
   should show the updated `modifiedTime` and the editor's screenshot
   as the file thumbnail.
