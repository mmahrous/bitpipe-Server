const http = require('http');
const TcpServer = require('./tcp_server');
const zlib = require('zlib');

class Server {
	constructor(port, tcpPort) {
		this._port = port;
		this._http = http.createServer(this._onRequest.bind(this))
		this._tcpServer = new TcpServer(tcpPort);
	}

	_onRequest(req, res) {
		const socketId = req.headers.host.split('.')[0];
		const socket = this._tcpServer.getSocket(socketId);
		socket.resume()
		socket.write(JSON.stringify({
			url: req.url,
			method: req.method,
			headers: req.headers
		}))
		const dataListener = (chunk) => {
			const resData = JSON.parse(zlib.inflateSync(Buffer.from(chunk.toString(), 'base64')).toString())
			res.writeHead(resData.statusCode, resData.headers)
			res.end(resData.body, () => {
				socket.removeListener('data', dataListener)
				socket.pause()
			});

		}

		socket.on('data', dataListener);
	}

	listen(callback) {
		this._http.listen(this._port)
		this._tcpServer.listen(callback)
	}
}

module.exports = Server 