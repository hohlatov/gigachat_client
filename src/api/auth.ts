import { AuthCredentials } from '../types';
import { normalizeBasicAuthorizationPayload } from '../utils/basicCredentials';
import { getOAuthUrl } from '../utils/gigachatUrls';

interface OAuthResponse {
  access_token: string;
  expires_at: number;
}

const createRqUid = () => {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }
  return `${Date.now()}-${Math.random().toString(36).slice(2)}`;
};

export const requestAccessToken = async ({ credentials, scope }: AuthCredentials) => {
  const body = new URLSearchParams({ scope });
  const basicPayload = normalizeBasicAuthorizationPayload(credentials);

  const response = await fetch(getOAuthUrl(), {
    method: 'POST',
    headers: {
      Authorization: `Basic ${basicPayload}`,
      RqUID: createRqUid(),
      Accept: 'application/json',
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: body.toString(),
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`OAuth error ${response.status}: ${text || 'Unknown error'}`);
  }

  const data = (await response.json()) as OAuthResponse;
  return {
    accessToken: data.access_token,
    expiresAt: data.expires_at,
  };
};
