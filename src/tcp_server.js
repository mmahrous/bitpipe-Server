const Net = require('net');
const { nanoid } = require('nanoid');

class Server {
	constructor(port) {
		this._port = port;
		this._server = new Net.Server();
		this._sockets = {}
	}


	getSocket(id) {
		return this._sockets[id];
	}

	_onConnect(socket) {
		const id = nanoid();
		this._sockets[id.toLowerCase()] = socket;
		socket.write(JSON.stringify({
			ack: true,
			id
		}))
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
		this._server.listen(this._port, callback);
	}
}

module.exports = Server;
