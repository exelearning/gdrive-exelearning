/**
 * Builds the sandboxed iframe that displays a viewer session. The iframe is
 * the only point where package HTML executes, and the sandbox flags are tuned
 * to the minimum that still lets eXeLearning's iDevices run.
 *
 * External links inside the iframe are forced to open in a new tab so the
 * parent window never navigates away from the viewer.
 */

import { buildRuntimeUrl } from './paths';

const SANDBOX_FLAGS = [
  'allow-scripts',
  'allow-same-origin',
  'allow-forms',
  'allow-popups',
  'allow-downloads',
  'allow-popups-to-escape-sandbox',
] as const;

const IFRAME_ALLOW = [
  'fullscreen',
  'autoplay',
  'clipboard-read',
  'clipboard-write',
].join('; ');

export interface IframeOptions {
  runtimeBase: string;
  sessionId: string;
  indexEntry: string;
  title: string;
}

export function createPackageIframe(options: IframeOptions): HTMLIFrameElement {
  const iframe = document.createElement('iframe');
  iframe.className = 'viewer-frame';
  iframe.title = options.title;
  iframe.setAttribute('sandbox', SANDBOX_FLAGS.join(' '));
  iframe.setAttribute('allow', IFRAME_ALLOW);
  iframe.setAttribute('referrerpolicy', 'no-referrer');
  iframe.src = buildRuntimeUrl(
    options.runtimeBase,
    options.sessionId,
    options.indexEntry,
  );
  iframe.addEventListener('load', () => {
    try {
      rewireExternalLinks(iframe);
    } catch {
      // Cross-origin error: we lose the same-origin invariant when the SW is
      // bypassed. Swallow rather than break the view.
    }
  });
  return iframe;
}

/**
 * Forces every external (`scheme:` or `//host`) link inside the iframe to
 * open in a new tab with `noopener noreferrer`, so the viewer never
 * navigates the parent window.
 */
function rewireExternalLinks(iframe: HTMLIFrameElement): void {
  const doc = iframe.contentDocument;
  if (!doc) {
    return;
  }
  doc.addEventListener(
    'click',
    event => {
      const target =
        event.target instanceof HTMLElement ? event.target.closest('a') : null;
      if (!target) {
        return;
      }
      const href = target.getAttribute('href');
      if (!href) {
        return;
      }
      if (/^(?:[a-z][a-z0-9+.-]*:|\/\/)/i.test(href)) {
        target.setAttribute('target', '_blank');
        target.setAttribute('rel', 'noopener noreferrer');
      }
    },
    true,
  );
}
