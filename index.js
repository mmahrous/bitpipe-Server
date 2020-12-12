const HttpServer = require('./src/http_server');

const httpServer = new HttpServer(3000, 1234);

httpServer.listen(() => {
	console.info('Server started.')
})