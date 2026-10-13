import { afterEach, describe, expect, it, vi } from 'vitest';
import {
  createAnyoneReaderPermission,
  DriveApiError,
  downloadPublicFile,
  getFileMetadata,
  getPublicFileMetadata,
} from './drive-api';

type Call = { url: URL; init: RequestInit };

function stubFetch(response: Response): Call[] {
  const calls: Call[] = [];
  vi.stubGlobal(
    'fetch',
    vi.fn(async (input: string | URL, init: RequestInit = {}) => {
      calls.push({ url: new URL(String(input)), init });
      return response.clone();
    }),
  );
  return calls;
}

afterEach(() => {
  vi.unstubAllGlobals();
});

describe('createAnyoneReaderPermission', () => {
  it('posts an unlisted anyone/reader permission with the bearer token', async () => {
    const calls = stubFetch(
      new Response(JSON.stringify({ id: 'anyoneWithLink' }), { status: 200 }),
    );

    await createAnyoneReaderPermission({
      token: 't0k',
      fileId: 'f1',
      resourceKey: 'rk',
    });

    const [call] = calls;
    expect(call.url.pathname).toBe('/drive/v3/files/f1/permissions');
    expect(call.init.method).toBe('POST');
    const headers = new Headers(call.init.headers);
    expect(headers.get('Authorization')).toBe('Bearer t0k');
    expect(headers.get('X-Goog-Drive-Resource-Keys')).toBe('f1/rk');
    expect(JSON.parse(String(call.init.body))).toEqual({
      type: 'anyone',
      role: 'reader',
      allowFileDiscovery: false,
    });
  });
});

describe('getPublicFileMetadata', () => {
  it('authenticates with the API key instead of a bearer token', async () => {
    const calls = stubFetch(
      new Response(JSON.stringify({ id: 'f1', name: 'a.elpx' }), {
        status: 200,
      }),
    );

    const metadata = await getPublicFileMetadata({ apiKey: 'K', fileId: 'f1' });

    expect(metadata.name).toBe('a.elpx');
    const [call] = calls;
    expect(call.url.pathname).toBe('/drive/v3/files/f1');
    expect(call.url.searchParams.get('key')).toBe('K');
    expect(new Headers(call.init.headers).has('Authorization')).toBe(false);
  });
});

describe('downloadPublicFile', () => {
  it('fetches the media with the API key and resource key header', async () => {
    const calls = stubFetch(new Response(new Uint8Array([1, 2, 3])));

    const bytes = await downloadPublicFile({
      apiKey: 'K',
      fileId: 'f1',
      resourceKey: 'rk',
    });

    expect(new Uint8Array(bytes)).toEqual(new Uint8Array([1, 2, 3]));
    const [call] = calls;
    expect(call.url.searchParams.get('alt')).toBe('media');
    expect(call.url.searchParams.get('key')).toBe('K');
    const headers = new Headers(call.init.headers);
    expect(headers.get('X-Goog-Drive-Resource-Keys')).toBe('f1/rk');
    expect(headers.has('Authorization')).toBe(false);
  });

  it('surfaces Drive errors with their HTTP status', async () => {
    stubFetch(
      new Response(JSON.stringify({ error: { message: 'File not found' } }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      }),
    );

    await expect(
      downloadPublicFile({ apiKey: 'K', fileId: 'nope' }),
    ).rejects.toMatchObject({ status: 404, message: 'File not found' });
    await expect(
      downloadPublicFile({ apiKey: 'K', fileId: 'nope' }),
    ).rejects.toBeInstanceOf(DriveApiError);
  });
});

describe('getFileMetadata', () => {
  it('asks Drive whether the user may share the file', async () => {
    const calls = stubFetch(new Response(JSON.stringify({ id: 'f1' })));

    await getFileMetadata({ token: 't', fileId: 'f1' });

    expect(calls[0].url.searchParams.get('fields')).toContain('canShare');
  });
});
