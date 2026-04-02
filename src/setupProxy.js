const { createProxyMiddleware } = require('http-proxy-middleware');

const stripForwardedHeaders = (proxyReq) => {
  proxyReq.removeHeader('x-forwarded-host');
  proxyReq.removeHeader('x-forwarded-for');
  proxyReq.removeHeader('x-forwarded-proto');
  proxyReq.removeHeader('x-forwarded-port');
  proxyReq.removeHeader('forwarded');
  proxyReq.removeHeader('referer');
};

module.exports = function setupProxy(app) {
  app.use(
    '/gigachat-oauth',
    createProxyMiddleware({
      target: 'https://ngw.devices.sberbank.ru:9443',
      changeOrigin: true,
      secure: false,
      pathRewrite: { '^/gigachat-oauth': '/api/v2/oauth' },
      onProxyReq(proxyReq) {
        stripForwardedHeaders(proxyReq);
        proxyReq.setHeader('host', 'ngw.devices.sberbank.ru:9443');
      },
    })
  );

  app.use(
    '/gigachat-api',
    createProxyMiddleware({
      target: 'https://gigachat.devices.sberbank.ru',
      changeOrigin: true,
      secure: false,
      pathRewrite: { '^/gigachat-api': '/api/v1/chat/completions' },
      onProxyReq(proxyReq) {
        stripForwardedHeaders(proxyReq);
        proxyReq.setHeader('host', 'gigachat.devices.sberbank.ru');
      },
    })
  );
};
