const { ServerResponse } = require('http');

class KlasaServerResponse extends ServerResponse {

	status(code) {
		this.statusCode = code;
		return this;
	}

	json(data) {
		return this.end(JSON.stringify(data));
	}

}

module.exports = KlasaServerResponse;
