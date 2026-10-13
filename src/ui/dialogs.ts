import { t } from '../i18n';
import { escapeHtml } from './viewer-shell';

export type ConflictChoice = 'overwrite' | 'copy' | 'cancel';

export function confirmOverwriteRemoteChange(filename: string): ConflictChoice {
  const overwrite = window.confirm(t('conflict.changed', { filename }));
  if (overwrite) {
    return 'overwrite';
  }

  const copy = window.confirm(t('conflict.saveCopy'));
  return copy ? 'copy' : 'cancel';
}

export function showError(message: string): void {
  window.alert(message);
}

/**
 * Full-screen blocking overlay used while a save is in flight, mirroring the
 * "Saving..." modal in wp-exelearning. Prevents the user from interacting with
 * the editor while bytes are uploading to Drive.
 */
export class SavingModal {
  private element: HTMLElement | null = null;
  private titleNode: HTMLElement | null = null;
  private hintNode: HTMLElement | null = null;
  private closeButton: HTMLButtonElement | null = null;

  showSaving(message = t('saving.title')): void {
    this.ensureElement();
    this.element?.classList.remove('saving-modal--error');
    this.element?.classList.add('saving-modal--visible');
    if (this.titleNode) {
      this.titleNode.textContent = message;
    }
    if (this.hintNode) {
      this.hintNode.textContent = t('saving.hint');
    }
    if (this.closeButton) {
      this.closeButton.hidden = true;
    }
  }

  showError(message: string): void {
    this.ensureElement();
    this.element?.classList.add('saving-modal--visible', 'saving-modal--error');
    if (this.titleNode) {
      this.titleNode.textContent = t('saving.failed');
    }
    if (this.hintNode) {
      this.hintNode.textContent = message;
    }
    if (this.closeButton) {
      this.closeButton.hidden = false;
    }
  }

  hide(): void {
    this.element?.classList.remove(
      'saving-modal--visible',
      'saving-modal--error',
    );
  }

  destroy(): void {
    this.element?.remove();
    this.element = null;
    this.titleNode = null;
    this.hintNode = null;
    this.closeButton = null;
  }

  private ensureElement(): void {
    if (this.element) {
      return;
    }
    const overlay = document.createElement('div');
    overlay.className = 'saving-modal';
    overlay.setAttribute('role', 'alertdialog');
    overlay.setAttribute('aria-modal', 'true');
    overlay.innerHTML = `
      <div class="saving-modal__card">
        <div class="saving-modal__spinner" aria-hidden="true"></div>
        <h3 class="saving-modal__title"></h3>
        <p class="saving-modal__hint"></p>
        <button type="button" class="saving-modal__close" hidden>${t('common.close')}</button>
      </div>
    `;
    document.body.append(overlay);
    this.element = overlay;
    this.titleNode = overlay.querySelector<HTMLElement>('.saving-modal__title');
    this.hintNode = overlay.querySelector<HTMLElement>('.saving-modal__hint');
    this.closeButton = overlay.querySelector<HTMLButtonElement>(
      '.saving-modal__close',
    );
    this.closeButton?.addEventListener('click', () => this.hide());
  }
}

export interface ShareLinkView {
  url: string;
  driveUrl: string;
}

const ICON_ATTRS =
  'viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"';
const CLOSE_ICON = `<svg width="20" height="20" ${ICON_ATTRS}><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>`;
const LOCK_ICON = `<svg width="20" height="20" ${ICON_ATTRS}><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>`;
const GLOBE_ICON = `<svg width="20" height="20" ${ICON_ATTRS}><circle cx="12" cy="12" r="10"/><path d="M2 12h20"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>`;
const LINK_ICON = `<svg width="18" height="18" ${ICON_ATTRS}><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>`;
const CHECK_ICON = `<svg width="18" height="18" ${ICON_ATTRS}><path d="M20 6 9 17l-5-5"/></svg>`;
const ALERT_ICON = `<svg width="20" height="20" ${ICON_ATTRS}><path d="m21.73 18-8-14a2 2 0 0 0-3.46 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><path d="M12 9v4"/><path d="M12 17h.01"/></svg>`;
const EXTERNAL_ICON = `<svg width="16" height="16" ${ICON_ATTRS}><path d="M15 3h6v6"/><path d="M10 14 21 3"/><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/></svg>`;

/**
 * Share-flow modal modelled on Drive's own share dialog: confirm the
 * consequence first, then hand over the link (or explain why Drive refused).
 * One overlay per page, created lazily and re-rendered per step.
 */
export class ShareDialog {
  private element: HTMLElement | null = null;
  private pendingConfirm: ((ok: boolean) => void) | null = null;

  /** Step 1: explain that the file becomes public. Resolves `true` on confirm. */
  confirm(filename: string): Promise<boolean> {
    this.render({
      role: 'dialog',
      titleHtml: escapeHtml(t('share.title', { filename })),
      bodyHtml: `
        <div class="share-dialog__section">
          <div class="share-dialog__label">${t('share.generalAccess')}</div>
          <div class="share-dialog__access">
            <span class="share-dialog__avatar">${LOCK_ICON}</span>
            <span class="share-dialog__access-text"><strong>${t('share.restricted')}</strong><small>${t('share.restrictedHint')}</small></span>
          </div>
        </div>
        <div class="share-dialog__callout">${GLOBE_ICON}<p><strong>${t('share.calloutLead')}</strong> ${t('share.calloutBody')}</p></div>
      `,
      footerHtml: `
        <button type="button" class="share-dialog__btn share-dialog__btn--text" data-action="cancel">${t('share.cancel')}</button>
        <button type="button" class="share-dialog__btn share-dialog__btn--filled" data-action="confirm">${t('share.create')}</button>
      `,
    });
    return new Promise(resolve => {
      this.pendingConfirm = resolve;
      const confirmButton = this.query<HTMLButtonElement>(
        '[data-action="confirm"]',
      );
      confirmButton?.addEventListener('click', () => {
        for (const button of Array.from(
          this.element?.querySelectorAll('button') ?? [],
        )) {
          button.disabled = true;
        }
        confirmButton.textContent = t('share.sharing');
        this.settleConfirm(true);
      });
    });
  }

  /** Step 2: the link exists; offer copy and the Drive page where sharing is managed. */
  showLink(filename: string, link: ShareLinkView): void {
    this.render({
      role: 'dialog',
      titleHtml: escapeHtml(t('share.title', { filename })),
      bodyHtml: `
        <div class="share-dialog__section">
          <div class="share-dialog__label">${t('share.generalAccess')}</div>
          <div class="share-dialog__access">
            <span class="share-dialog__avatar share-dialog__avatar--public">${GLOBE_ICON}</span>
            <span class="share-dialog__access-text"><strong>${t('share.anyone')}</strong><small>${t('share.anyoneHint')}</small></span>
            <span class="share-dialog__role">${t('share.viewer')}</span>
          </div>
        </div>
        <div class="share-dialog__section">
          <label class="share-dialog__label" for="share-dialog-link">${t('share.linkLabel')}</label>
          <div class="share-dialog__link">
            <input id="share-dialog-link" type="text" readonly value="${escapeHtml(link.url)}">
            <button type="button" class="share-dialog__btn share-dialog__btn--outline" data-action="copy">${LINK_ICON}<span>${t('share.copy')}</span></button>
          </div>
          <small class="share-dialog__hint">${t('share.stopHint')}</small>
        </div>
      `,
      footerHtml: `
        <a class="share-dialog__manage" href="${escapeHtml(link.driveUrl)}" target="_blank" rel="noopener">${t('share.manage')}${EXTERNAL_ICON}</a>
        <button type="button" class="share-dialog__btn share-dialog__btn--filled" data-action="close">${t('share.done')}</button>
      `,
      splitFooter: true,
    });
    const input = this.query<HTMLInputElement>('#share-dialog-link');
    input?.addEventListener('focus', () => input.select());
    const copyButton = this.query<HTMLButtonElement>('[data-action="copy"]');
    copyButton?.addEventListener('click', () => {
      void this.copy(link.url, copyButton, input);
    });
  }

  showError(message: string, hint?: string): void {
    this.render({
      role: 'alertdialog',
      titleHtml: escapeHtml(t('share.errorTitle')),
      bodyHtml: `
        <div class="share-dialog__callout share-dialog__callout--error">${ALERT_ICON}<p><strong>${t('share.errorLead')}</strong> “${escapeHtml(message)}”</p></div>
        ${hint ? `<p class="share-dialog__hint">${escapeHtml(hint)}</p>` : ''}
      `,
      footerHtml: `<button type="button" class="share-dialog__btn share-dialog__btn--filled" data-action="close">${t('common.close')}</button>`,
    });
  }

  hide(): void {
    this.settleConfirm(false);
    this.element?.classList.remove('share-dialog--visible');
  }

  private async copy(
    url: string,
    button: HTMLButtonElement,
    input: HTMLInputElement | null,
  ): Promise<void> {
    try {
      await navigator.clipboard.writeText(url);
      const label = button.innerHTML;
      button.innerHTML = `${CHECK_ICON}<span>${t('share.copied')}</span>`;
      window.setTimeout(() => {
        button.innerHTML = label;
      }, 2000);
    } catch {
      // No clipboard permission (e.g. non-secure context): leave the URL selected for Ctrl/Cmd+C.
      input?.focus();
    }
  }

  private render(view: {
    role: 'dialog' | 'alertdialog';
    titleHtml: string;
    bodyHtml: string;
    footerHtml: string;
    splitFooter?: boolean;
  }): void {
    const overlay = this.ensureElement();
    const footerClass = view.splitFooter
      ? 'share-dialog__footer share-dialog__footer--split'
      : 'share-dialog__footer';
    overlay.innerHTML = `
      <div class="share-dialog__card" role="${view.role}" aria-modal="true" aria-labelledby="share-dialog-title" tabindex="-1">
        <div class="share-dialog__header">
          <h2 id="share-dialog-title" class="share-dialog__title">${view.titleHtml}</h2>
          <button type="button" class="share-dialog__close" aria-label="${t('common.close')}" data-action="close">${CLOSE_ICON}</button>
        </div>
        ${view.bodyHtml}
        <div class="${footerClass}">${view.footerHtml}</div>
      </div>
    `;
    overlay.classList.add('share-dialog--visible');
    const dismissers = overlay.querySelectorAll<HTMLElement>(
      '[data-action="close"], [data-action="cancel"]',
    );
    for (const button of Array.from(dismissers)) {
      button.addEventListener('click', () => this.hide());
    }
    overlay.querySelector<HTMLElement>('.share-dialog__card')?.focus();
  }

  private ensureElement(): HTMLElement {
    if (this.element) {
      return this.element;
    }
    const overlay = document.createElement('div');
    overlay.className = 'share-dialog';
    overlay.addEventListener('click', event => {
      if (event.target === overlay) {
        this.hide();
      }
    });
    overlay.addEventListener('keydown', event => {
      if (event.key === 'Escape') {
        this.hide();
      }
    });
    document.body.append(overlay);
    this.element = overlay;
    return overlay;
  }

  private settleConfirm(ok: boolean): void {
    const resolve = this.pendingConfirm;
    this.pendingConfirm = null;
    resolve?.(ok);
  }

  private query<T extends Element>(selector: string): T | null {
    return this.element?.querySelector<T>(selector) ?? null;
  }
}
