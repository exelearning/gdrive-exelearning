import { describe, expect, it } from 'vitest';
import { DriveApiError } from './drive-api';
import {
  buildDriveFileUrl,
  buildPublicViewUrl,
  describePublicViewError,
  describeShareError,
  parsePublicViewParams,
} from './public-link';

describe('buildPublicViewUrl', () => {
  it('points at the /view route of the app base with the file id', () => {
    expect(
      buildPublicViewUrl('https://example.test/gdrive-exelearning/', 'abc-123'),
    ).toBe('https://example.test/gdrive-exelearning/view?fileId=abc-123');
  });

  it('carries the resource key when the file has one', () => {
    const url = new URL(
      buildPublicViewUrl('https://example.test/app/', 'abc', '0-rk'),
    );
    expect(url.searchParams.get('fileId')).toBe('abc');
    expect(url.searchParams.get('resourceKey')).toBe('0-rk');
  });
});

describe('parsePublicViewParams', () => {
  it('reads the file id and optional resource key', () => {
    expect(
      parsePublicViewParams(new URLSearchParams('fileId=abc_1&resourceKey=rk')),
    ).toEqual({ fileId: 'abc_1', resourceKey: 'rk' });
  });

  it('omits the resource key when absent', () => {
    expect(parsePublicViewParams(new URLSearchParams('fileId=abc'))).toEqual({
      fileId: 'abc',
    });
  });

  it('rejects a missing file id', () => {
    expect(() => parsePublicViewParams(new URLSearchParams(''))).toThrow(
      'Missing fileId',
    );
  });

  it('rejects a file id with characters Drive never issues', () => {
    expect(() =>
      parsePublicViewParams(new URLSearchParams('fileId=../etc')),
    ).toThrow('Invalid fileId');
  });
});

describe('describePublicViewError', () => {
  it('explains a Drive 404 as a file that is not shared publicly', () => {
    expect(
      describePublicViewError(new DriveApiError(404, 'File not found.', null)),
    ).toContain('shared publicly');
  });

  it('explains a Drive 403 the same way', () => {
    expect(
      describePublicViewError(new DriveApiError(403, 'Forbidden', null)),
    ).toContain('shared publicly');
  });

  it('passes other errors through', () => {
    expect(describePublicViewError(new Error('boom'))).toBe('boom');
  });
});

describe('buildDriveFileUrl', () => {
  it('opens the file in the Google Drive web UI', () => {
    expect(buildDriveFileUrl('abc-123')).toBe(
      'https://drive.google.com/file/d/abc-123/view',
    );
  });
});

describe('describeShareError', () => {
  it('quotes Google and hints at the domain fallback on a 403', () => {
    const result = describeShareError(
      new DriveApiError(
        403,
        'Sharing outside of your organization is not allowed.',
        null,
      ),
    );
    expect(result.message).toBe(
      'Sharing outside of your organization is not allowed.',
    );
    expect(result.hint).toContain('Google Workspace');
  });

  it('passes other errors through without a hint', () => {
    const result = describeShareError(new Error('Network down'));
    expect(result).toEqual({ message: 'Network down' });
  });
});
