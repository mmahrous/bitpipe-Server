const Net = require('net');
const { nanoid } = require('nanoid');
const TCPServer = require('fast-tcp').Server;

class Server {
	constructor(port) {
		this._port = port;
		// this._server = new Net.Server();
		this._server = new TCPServer();
		this._sockets = {}
	}


	getSocket(id) {
		return this._sockets[id];
	}

	_onConnect(socket) {
		const id = nanoid();
		this._sockets[id.toLowerCase()] = socket;
		socket.emit('ack', JSON.stringify({
			ack: true,
			id
		}))
		socket.on('connected', () => {
			console.log(`Client ${id} connected.`);
		});
		socket.on('end',  () => {
			console.log(`Client ${id} disconnected.`);
		});
		// Don't forget to catch error, for your own sake.
		socket.on('error', (err) => {
			console.error(err);
		});
	}

	listen(callback) {
		this._server.on('connection', this._onConnect.bind(this))
		this._server.listen(this._port);
	}
}

module.exports = Server;
