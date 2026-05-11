import { describe, expect, it } from 'vitest';
import { hasRemoteRevisionChanged, parseDriveState } from './drive-state';

describe('parseDriveState', () => {
  it('accepts an open state with ids and resource keys', () => {
    const state = encodeURIComponent(
      JSON.stringify({
        action: 'open',
        ids: ['abc'],
        resourceKeys: { abc: 'rk' },
        userId: 'user',
      }),
    );

    expect(parseDriveState(state)).toEqual({
      action: 'open',
      ids: ['abc'],
      resourceKeys: { abc: 'rk' },
      userId: 'user',
    });
  });

  it('rejects an open state without file ids', () => {
    expect(() =>
      parseDriveState(JSON.stringify({ action: 'open', ids: [] })),
    ).toThrow('at least one file id');
  });
});

describe('hasRemoteRevisionChanged', () => {
  it('compares Drive versions before modified time', () => {
    expect(
      hasRemoteRevisionChanged(
        { version: '1', modifiedTime: 'a' },
        { version: '2', modifiedTime: 'a' },
      ),
    ).toBe(true);
  });
});
