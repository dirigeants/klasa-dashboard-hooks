const zlib = require('zlib');
const { Middleware } = require('klasa-dashboard-hooks');

module.exports = class extends Middleware {

	async run(req) {
		if (req.method !== 'POST') return;

		const stream = this.contentStream(req);
		let body = '';

		for await (const chunk of stream) body += chunk;

		const data = JSON.parse(body);
		req.body = data;
	}

	contentStream(req) {
		const length = req.headers['content-length'];
		let stream;
		switch ((req.headers['content-encoding'] || 'identity').toLowerCase()) {
			case 'deflate':
				stream = zlib.createInflate();
				req.pipe(stream);
				break;
			case 'gzip':
				stream = zlib.createGunzip();
				req.pipe(stream);
				break;
			case 'identity':
				stream = req;
				stream.length = length;
				break;
		}
		return stream;
	}

};
