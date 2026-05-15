/**
 * Inline SVG icons used by the toolbars. Kept as raw strings so they can be
 * spliced into `innerHTML` without a separate network request and themed via
 * `currentColor`.
 */

export const DRIVE_ICON_SVG = `
<svg class="drive-icon" viewBox="0 0 87 78" aria-hidden="true" focusable="false">
  <path fill="#0066da" d="m6.6 66.85 3.85 6.65c.8 1.4 1.95 2.5 3.3 3.3l13.75-23.8h-27.5c0 1.55.4 3.1 1.2 4.5z"/>
  <path fill="#00ac47" d="m43.65 25-13.75-23.8c-1.35.8-2.5 1.9-3.3 3.3l-25.4 44a9.06 9.06 0 0 0-1.2 4.5h27.5z"/>
  <path fill="#ea4335" d="m73.55 76.8c1.35-.8 2.5-1.9 3.3-3.3l1.6-2.75 7.65-13.25c.8-1.4 1.2-2.95 1.2-4.5h-27.502l5.852 11.5z"/>
  <path fill="#00832d" d="m43.65 25 13.75-23.8c-1.35-.8-2.9-1.2-4.5-1.2h-18.5c-1.6 0-3.15.45-4.5 1.2z"/>
  <path fill="#2684fc" d="m59.8 53h-32.3l-13.75 23.8c1.35.8 2.9 1.2 4.5 1.2h50.8c1.6 0 3.15-.45 4.5-1.2z"/>
  <path fill="#ffba00" d="m73.4 26.5-12.7-22c-.8-1.4-1.95-2.5-3.3-3.3l-13.75 23.8 16.15 28h27.45c0-1.55-.4-3.1-1.2-4.5z"/>
</svg>`;

/**
 * Mirrors `public/icons/exelearning.svg` so the toolbar can render the
 * eXeLearning mark without a separate request. Keep the two in sync if the
 * brand mark changes.
 */
export const EXELEARNING_ICON_SVG = `
<svg class="exelearning-icon" viewBox="0 0 64 64" aria-hidden="true" focusable="false">
  <rect width="64" height="64" rx="8" fill="#f5f7fb"/>
  <path d="M18 14h22l8 8v28H18z" fill="#ffffff" stroke="#2f4b7c" stroke-width="3"/>
  <path d="M40 14v10h10" fill="none" stroke="#2f4b7c" stroke-width="3"/>
  <path d="M25 33h18M25 41h14" stroke="#2d8a57" stroke-width="4" stroke-linecap="round"/>
</svg>`;

/**
 * Material-style chevron-left used by the "Back to Drive" affordance. Single
 * path, no fill, inherits stroke color via `currentColor` so CSS can theme it.
 */
export const BACK_ICON_SVG = `
<svg class="back-icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
  <path d="M15 6l-6 6 6 6" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
</svg>`;
