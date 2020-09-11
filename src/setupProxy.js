
const proxy = require('http-proxy-middleware');

module.exports = function(app) {
  app.use(proxy.createProxyMiddleware('/api', { 
       target: 'http://hou.mengdodo.com/' ,
       secure: false,
       changeOrigin: true,
       pathRewrite: {
        "^/api": "/api"
       },
       router: {
        'http://hou.mengdodo.com/': 'http://localhost:3000/',
       }
    }));

};