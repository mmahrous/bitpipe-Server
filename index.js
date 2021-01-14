const HttpServer = require('./src/http_server');

const httpServer = new HttpServer(process.env.HTTP_PORT || 8000, process.env.TCP_PORT || 3000);

httpServer.listen(() => {
	console.info('Server started.')
})