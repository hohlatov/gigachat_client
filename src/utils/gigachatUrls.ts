const useDevProxy =
  process.env.NODE_ENV === 'development' && process.env.REACT_APP_DISABLE_DEV_PROXY !== 'true';

export const getOAuthUrl = () => {
  if (process.env.REACT_APP_GIGACHAT_OAUTH_URL) {
    return process.env.REACT_APP_GIGACHAT_OAUTH_URL;
  }
  if (useDevProxy) {
    return '/gigachat-oauth';
  }
  return 'https://ngw.devices.sberbank.ru:9443/api/v2/oauth';
};

export const getChatCompletionsUrl = () => {
  if (process.env.REACT_APP_GIGACHAT_API_URL) {
    return process.env.REACT_APP_GIGACHAT_API_URL;
  }
  if (useDevProxy) {
    return '/gigachat-api';
  }
  return 'https://gigachat.devices.sberbank.ru/api/v1/chat/completions';
};
