const decodeBase64 = (value: string): string | null => {
  const cleaned = value.replace(/\s/g, '');
  if (!cleaned) return null;
  try {
    const padLen = (4 - (cleaned.length % 4)) % 4;
    const padded = cleaned + '='.repeat(padLen);
    return atob(padded);
  } catch {
    return null;
  }
};

/**
 * Builds the payload for `Authorization: Basic <payload>`.
 * Accepts: raw `client_id:client_secret`, or Base64 of that string, optional leading `Basic `.
 */
export const normalizeBasicAuthorizationPayload = (input: string): string => {
  let value = input.trim();
  if (/^basic\s+/i.test(value)) {
    value = value.replace(/^basic\s+/i, '').trim();
  }
  value = value.replace(/\s/g, '');

  const decoded = decodeBase64(value);
  if (decoded !== null && decoded.includes(':')) {
    return value;
  }

  if (value.includes(':')) {
    try {
      return btoa(value);
    } catch {
      throw new Error('Не удалось закодировать client_id:client_secret в Base64');
    }
  }

  throw new Error(
    'Укажите пару client_id:client_secret или её Base64 (без префикса Basic). Сейчас строка не похожа ни на одно из ожидаемых значений.'
  );
};
