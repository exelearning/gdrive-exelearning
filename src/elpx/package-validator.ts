/**
 * Validates that an extracted archive looks like an eXeLearning project.
 *
 * The viewer only needs `index.html`. Everything else is a soft signal that
 * helps us recognise the package shape and surface clearer errors when the
 * user uploaded a `.zip` that is not an eXeLearning project.
 *
 * "Legacy" packages are eXeLearning v1/v2/v3 projects produced before
 * upstream switched to the `.elpx` (`index.html`-bearing) format. Their
 * payload lives in `contentv\d+.*` files at the root of the zip and the
 * package cannot be previewed in a browser; users have to open it in the
 * editor to migrate it forward. We detect them so we can branch off the
 * unhelpful "no index.html" error and offer a clear upgrade path.
 */

const ROOT_INDEX_CANDIDATES = ['index.html', 'index.htm'];
const DIR_HINTS = ['html/', 'content/', 'libs/', 'theme/', 'idevices/'];
// `contentv3.xml`, `contentv2.foo`, `contentv1.bar`, etc., at root.
const LEGACY_MARKER_REGEX = /^contentv\d+(?:\.|$)/;

export interface PackageShape {
  indexEntry: string | null;
  hasContentXml: boolean;
  hasScreenshot: boolean;
  hintCount: number;
  legacyMarker: string | null;
}

export interface PackageValidation {
  valid: boolean;
  legacy: boolean;
  shape: PackageShape;
  error?: string;
}

/**
 * Walks the decompressed entry map and reports the shape of an eXeLearning
 * project: which root index file (if any) is present, whether helper
 * artefacts like `content.xml` / `screenshot.png` are there, how many
 * familiar directory hints (`html/`, `idevices/`, …) appear, and which
 * (if any) `contentv\d+` file at the archive root marks it as a legacy
 * pre-`.elpx` project.
 */
export function inspectPackage(
  entries: ReadonlyMap<string, Uint8Array>,
): PackageShape {
  let indexEntry: string | null = null;
  for (const candidate of ROOT_INDEX_CANDIDATES) {
    if (entries.has(candidate)) {
      indexEntry = candidate;
      break;
    }
  }
  let hintCount = 0;
  let legacyMarker: string | null = null;
  for (const entry of entries.keys()) {
    for (const dir of DIR_HINTS) {
      if (entry.startsWith(dir)) {
        hintCount += 1;
        break;
      }
    }
    if (legacyMarker === null && LEGACY_MARKER_REGEX.test(entry)) {
      legacyMarker = entry;
    }
  }
  return {
    indexEntry,
    hasContentXml: entries.has('content.xml'),
    hasScreenshot: entries.has('screenshot.png'),
    hintCount,
    legacyMarker,
  };
}

/**
 * Wraps {@link inspectPackage} with a verdict. Three outcomes:
 *
 *   - `valid: true`                 — modern `.elpx`, render in viewer.
 *   - `legacy: true`                — old eXeLearning project; cannot be
 *                                     previewed but can be migrated by
 *                                     opening it in the editor.
 *   - neither flag set              — not an eXeLearning archive at all.
 *
 * Detection is intentionally generous on the legacy side: any archive with
 * a root-level `contentv\d+` marker counts, and so does a `.elp` extension
 * without an `index.html` (covers v1/v2 projects whose payload sits in
 * non-versioned `content.*` files).
 */
export function validatePackage(
  entries: ReadonlyMap<string, Uint8Array>,
  filename = '',
): PackageValidation {
  const shape = inspectPackage(entries);
  if (shape.indexEntry !== null) {
    return { valid: true, legacy: false, shape };
  }
  const isLegacyByMarker = shape.legacyMarker !== null;
  const isLegacyByExtension = filename.toLowerCase().endsWith('.elp');
  if (isLegacyByMarker || isLegacyByExtension) {
    return {
      valid: false,
      legacy: true,
      shape,
      error:
        'This file is from an older version of eXeLearning and cannot be previewed.',
    };
  }
  return {
    valid: false,
    legacy: false,
    shape,
    error: 'The package does not contain an index.html.',
  };
}
