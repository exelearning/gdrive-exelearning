export const GOOGLE_DRIVE_SCOPES = [
  'https://www.googleapis.com/auth/drive.file',
  'https://www.googleapis.com/auth/drive.install',
] as const;

export const GOOGLE_DRIVE_SCOPE = GOOGLE_DRIVE_SCOPES.join(' ');

type GoogleTokenError = {
  error: string;
  error_description?: string;
  error_uri?: string;
};

type GoogleTokenResponse = Partial<GoogleTokenError> & {
  access_token?: string;
  expires_in?: number;
  scope?: string;
  token_type?: string;
};

type GoogleTokenClientConfig = {
  client_id: string;
  scope: string;
  callback: (response: GoogleTokenResponse) => void;
  error_callback?: (error: unknown) => void;
  include_granted_scopes?: boolean;
};

type GoogleTokenClient = {
  callback: (response: GoogleTokenResponse) => void;
  requestAccessToken: (overrideConfig?: {
    prompt?: string;
    scope?: string;
  }) => void;
};

declare global {
  interface Window {
    google?: {
      accounts?: {
        oauth2?: {
          initTokenClient: (
            config: GoogleTokenClientConfig,
          ) => GoogleTokenClient;
          revoke: (accessToken: string, done?: () => void) => void;
        };
      };
    };
  }
}

export type GoogleAccessToken = {
  accessToken: string;
  expiresAt: number;
  scope: string;
  tokenType: string;
};

export type GoogleTokenClientOptions = {
  clientId: string;
  scope?: string;
  now?: () => number;
  expirySkewMs?: number;
};

export type RequestGoogleAccessTokenOptions = {
  prompt?: '' | 'none' | 'consent' | 'select_account';
  scope?: string;
  interactive?: boolean;
};

export type InMemoryGoogleTokenClient = {
  getAccessToken: (
    options?: RequestGoogleAccessTokenOptions,
  ) => Promise<string>;
  getCurrentToken: () => GoogleAccessToken | null;
  clearToken: () => void;
  revokeToken: () => Promise<void>;
  hasValidToken: () => boolean;
};

const DEFAULT_EXPIRY_SKEW_MS = 60_000;
const GOOGLE_IDENTITY_SERVICES_SRC = 'https://accounts.google.com/gsi/client';
let defaultTokenClient: InMemoryGoogleTokenClient | null = null;
let googleIdentityServicesPromise: Promise<void> | null = null;

export function createGoogleTokenClient(
  options: GoogleTokenClientOptions,
): InMemoryGoogleTokenClient {
  const scope = options.scope ?? GOOGLE_DRIVE_SCOPE;
  const now = options.now ?? Date.now;
  const expirySkewMs = options.expirySkewMs ?? DEFAULT_EXPIRY_SKEW_MS;
  let tokenClient: GoogleTokenClient | null = null;
  let currentToken: GoogleAccessToken | null = null;
  let pendingRequest: Promise<string> | null = null;
  let pendingReject: ((error: Error) => void) | null = null;

  const getOauth2 = () => {
    const oauth2 = window.google?.accounts?.oauth2;
    if (!oauth2) {
      throw new Error('Google Identity Services is not loaded.');
    }
    return oauth2;
  };

  const getValidToken = (): GoogleAccessToken | null =>
    currentToken !== null && currentToken.expiresAt - expirySkewMs > now()
      ? currentToken
      : null;

  const hasValidToken = () => getValidToken() !== null;

  const getTokenClient = () => {
    if (tokenClient) {
      return tokenClient;
    }

    tokenClient = getOauth2().initTokenClient({
      client_id: options.clientId,
      scope,
      callback: () => undefined,
      include_granted_scopes: true,
      error_callback: error => {
        pendingRequest = null;
        pendingReject?.(
          new Error(`Google authorization failed: ${String(error)}`),
        );
        pendingReject = null;
      },
    });

    return tokenClient;
  };

  const requestToken = async (
    requestOptions: RequestGoogleAccessTokenOptions = {},
  ) => {
    await loadGoogleIdentityServices();

    return new Promise<string>((resolve, reject) => {
      const client = getTokenClient();
      pendingReject = reject;

      client.callback = response => {
        pendingRequest = null;
        pendingReject = null;

        if (response.error) {
          reject(new Error(response.error_description ?? response.error));
          return;
        }

        if (!response.access_token) {
          reject(
            new Error(
              'Google Identity Services did not return an access token.',
            ),
          );
          return;
        }

        currentToken = {
          accessToken: response.access_token,
          expiresAt: now() + (response.expires_in ?? 0) * 1000,
          scope: response.scope ?? requestOptions.scope ?? scope,
          tokenType: response.token_type ?? 'Bearer',
        };
        resolve(currentToken.accessToken);
      };

      client.requestAccessToken({
        prompt: requestOptions.prompt ?? (currentToken ? '' : 'consent'),
        scope: requestOptions.scope,
      });
    });
  };

  return {
    getAccessToken: requestOptions => {
      const validToken = getValidToken();
      if (validToken) {
        return Promise.resolve(validToken.accessToken);
      }

      pendingRequest ??= requestToken(requestOptions);
      return pendingRequest;
    },
    getCurrentToken: () => currentToken,
    clearToken: () => {
      currentToken = null;
      pendingRequest = null;
    },
    revokeToken: () =>
      new Promise(resolve => {
        const accessToken = currentToken?.accessToken;
        currentToken = null;
        pendingRequest = null;

        if (!accessToken) {
          resolve();
          return;
        }

        getOauth2().revoke(accessToken, resolve);
      }),
    hasValidToken,
  };
}

export function getDefaultGoogleTokenClient(): InMemoryGoogleTokenClient {
  defaultTokenClient ??= createGoogleTokenClient({
    clientId: getRequiredGoogleClientId(),
  });

  return defaultTokenClient;
}

export function requestAccessToken(
  options: RequestGoogleAccessTokenOptions = {},
): Promise<string> {
  return getDefaultGoogleTokenClient().getAccessToken({
    ...options,
    prompt: options.prompt ?? (options.interactive ? 'consent' : undefined),
  });
}

export function authorizeGoogle(): Promise<string> {
  return requestAccessToken({ interactive: true });
}

function getRequiredGoogleClientId(): string {
  const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

  if (!clientId) {
    throw new Error(
      'Missing VITE_GOOGLE_CLIENT_ID. Configure it before using Google Drive.',
    );
  }

  return clientId;
}

async function loadGoogleIdentityServices(): Promise<void> {
  if (window.google?.accounts?.oauth2) {
    return;
  }

  googleIdentityServicesPromise ??= new Promise<void>((resolve, reject) => {
    const existingScript = document.querySelector<HTMLScriptElement>(
      `script[src="${GOOGLE_IDENTITY_SERVICES_SRC}"]`,
    );
    const script = existingScript ?? document.createElement('script');

    const timeout = window.setTimeout(() => {
      reject(new Error('Timed out loading Google Identity Services.'));
    }, 10_000);

    const finish = () => {
      window.clearTimeout(timeout);
      if (window.google?.accounts?.oauth2) {
        resolve();
        return;
      }
      reject(
        new Error(
          'Google Identity Services loaded, but OAuth is not available.',
        ),
      );
    };

    script.addEventListener('load', finish, { once: true });
    script.addEventListener(
      'error',
      () => {
        window.clearTimeout(timeout);
        reject(new Error('Failed to load Google Identity Services.'));
      },
      { once: true },
    );

    if (!existingScript) {
      script.src = GOOGLE_IDENTITY_SERVICES_SRC;
      script.async = true;
      script.defer = true;
      document.head.append(script);
      return;
    }

    if (window.google?.accounts?.oauth2) {
      finish();
    }
  }).catch((error: unknown) => {
    googleIdentityServicesPromise = null;
    throw error;
  });

  await googleIdentityServicesPromise;
}
