const http = require('http');
const TcpServer = require('./tcp_server');
const zlib = require('zlib');
const { nanoid } = require('nanoid');

class Server {
	constructor(port, tcpPort) {
		this._port = port;
		this._http = http.createServer(this._onRequest.bind(this))
		this._tcpServer = new TcpServer(tcpPort);
		this._responses = {}
	}

	_onRequest(req, res) {
		const socketId = req.headers.host.split('.')[0];
		const socket = this._tcpServer.getSocket(socketId);
		socket.resume()
		let id = nanoid();
		this._responses[socketId] = res;
		socket.write(JSON.stringify({
			url: req.url,
			method: req.method,
			headers: req.headers,
			id,
		}))
		
		const dataListener = (chunk) => {
			let _id
			if (chunk.toString().startsWith('CH')) {
				_id = chunk.toString().slice(2)
			} else if (chunk.toString() === 'EOR') {
				res.end(() => {
					socket.removeListener('data', dataListener)
					socket.pause()
				});
			} else {
				res.write(chunk)
			}
			// 	// let data = chunk.toString().slice(0, -3)
			// 	// console.log(data);
			// 	// if (data !== '') res.write(Buffer.from(data))
			// 	// res.end(() => {
			// 	// 	socket.removeListener('data', dataListener)
			// 	// 	socket.pause()
			// 	// });
			// 	this._sockets[socketId][id].end()

			// } else {
			// 	this._sockets[socketId][id].write(chunk)
			// }
		}

		socket.on('data', dataListener);
	}

	_inflate(data) {
		return data
		// return zlib.inflateSync(Buffer.from(data, 'base64')).toString()
	}

	listen(callback) {
		this._http.listen(this._port)
		this._tcpServer.listen(callback)
	}
}

module.exports = Server 