import { describe, expect, it } from 'vitest';
import {
  LOCALE_NAMES,
  loadMessages,
  resolveLocale,
  SUPPORTED_LOCALES,
  t,
} from './index';
import en from './locales/en';

describe('resolveLocale', () => {
  it('prefers the hl query parameter', () => {
    expect(
      resolveLocale({ query: 'ca', saved: 'es', browser: ['fr-FR'] }),
    ).toBe('ca');
  });

  it('falls back to the saved choice, then the browser languages', () => {
    expect(resolveLocale({ query: null, saved: 'gl', browser: ['fr'] })).toBe(
      'gl',
    );
    expect(
      resolveLocale({ query: null, saved: null, browser: ['zh-CN', 'pt-BR'] }),
    ).toBe('pt');
  });

  it('strips the region and ignores unsupported values', () => {
    expect(resolveLocale({ query: 'es-ES', saved: null, browser: [] })).toBe(
      'es',
    );
    expect(resolveLocale({ query: 'xx', saved: 'yy', browser: ['zz'] })).toBe(
      'en',
    );
  });
});

describe('t', () => {
  it('returns the English message by default and fills placeholders', () => {
    expect(t('toolbar.save')).toBe('Save to Drive');
    expect(t('share.title', { filename: 'Photosynthesis.elpx' })).toBe(
      'Share “Photosynthesis.elpx”',
    );
  });
});

describe('locales', () => {
  it('ships a dictionary with every English key for each supported locale', async () => {
    const keys = Object.keys(en).sort();
    for (const locale of SUPPORTED_LOCALES) {
      const messages = await loadMessages(locale);
      expect(Object.keys(messages).sort(), locale).toEqual(keys);
      expect(LOCALE_NAMES[locale]).toBeTruthy();
    }
  });
});
