const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  app.use(
    '/api',
    createProxyMiddleware({
      target: 'http://localhost:8080',
      changeOrigin: true,
      secure: false,
      logLevel: 'info',
      headers: {
        'Connection': 'keep-alive',
      },
      onProxyReq: function(proxyReq, req, res) {
        console.log(`[PROXY] ${req.method} ${req.url} -> http://localhost:8080${req.url}`);
      },
      onProxyRes: function(proxyRes, req, res) {
        console.log(`[PROXY] Response: ${proxyRes.statusCode} for ${req.url}`);
      },
      onError: function(err, req, res) {
        console.error(`[PROXY] Error for ${req.url}:`, err.message);
        res.writeHead(500, {
          'Content-Type': 'text/plain',
        });
        res.end('Proxy Error: ' + err.message);
      },
    })
  );
};
