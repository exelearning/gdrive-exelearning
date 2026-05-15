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
 * Mirrors `public/icons/exelearning.svg` (the eXeLearning brand mark — a
 * teal "X" glyph) so the toolbar can render it without a separate request.
 * Keep the two in sync if the brand mark changes upstream.
 */
export const EXELEARNING_ICON_SVG = `
<svg class="exelearning-icon" viewBox="0 -0.519 60.17152 60.17152" aria-hidden="true" focusable="false">
  <g transform="translate(-109.80208,-121.17917)">
    <path d="m 120.63912,121.17916 c 2.50296,0 5.17684,0.9102 8.02111,2.7306 2.78765,1.7635 6.62755,4.89233 11.5197,9.38644 8.4193,-7.05406 12.91034,-8.64301 17.23363,-8.64301 2.78765,0 5.17684,0.76798 7.16783,2.30394 3.66792,2.80477 4.27963,9.21022 1.71,13.42157 -2.04787,3.35637 -4.72175,6.96873 -8.02111,10.83701 7.50914,8.53308 11.70332,14.673 11.70332,18.88279 0,3.01492 -0.93874,5.31892 -2.81596,6.91171 -1.93411,1.59279 -4.35187,2.38919 -7.25303,2.38919 -4.38044,0 -11.24849,-3.3237 -19.72468,-10.43464 -4.83526,4.2664 -8.64685,7.22471 -11.43424,8.87439 -2.84453,1.64967 -5.54672,2.47465 -8.10657,2.47465 -3.41323,0 -6.0585,-1.1094 -7.93578,-3.32793 -1.93418,-2.27568 -2.90126,-4.9493 -2.90126,-8.02111 0,-1.99126 0.28443,-3.72613 0.85331,-5.20541 0.56888,-1.47903 1.62129,-3.1287 3.15725,-4.94904 1.53596,-1.87748 3.98213,-4.46563 7.33845,-7.76525 -3.24254,-3.29936 -5.63181,-5.94471 -7.1678,-7.93576 -1.59284,-2.04795 -2.67369,-3.83992 -3.24257,-5.37588 -0.62577,-1.53596 -0.93864,-3.24257 -0.93864,-5.11987 0,-1.99107 0.42664,-3.8399 1.27995,-5.54651 0.85334,-1.76353 2.10484,-3.18572 3.7546,-4.26658 1.64973,-1.08087 3.58391,-1.6213 5.80249,-1.6213 z" fill="#26ddc7"/>
  </g>
</svg>`;

/**
 * Material-style chevron-left used by the "Back to Drive" affordance. Single
 * path, no fill, inherits stroke color via `currentColor` so CSS can theme it.
 */
export const BACK_ICON_SVG = `
<svg class="back-icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
  <path d="M15 6l-6 6 6 6" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
</svg>`;
