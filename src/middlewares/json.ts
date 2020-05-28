import { createInflate, createGunzip } from 'zlib';
import { Middleware, MiddlewareStore, KlasaIncomingMessage, KlasaHttp2ServerRequest } from '@klasa/dashboard-hooks';
import { Transform } from 'stream';

export default class extends Middleware {

	public constructor(store: MiddlewareStore, dir: string, file: string[]) {
		super(store, dir, file, { priority: 20 });
	}

	public async run(request: KlasaIncomingMessage | KlasaHttp2ServerRequest): Promise<void> {
		if (request.method !== 'POST') return;

		const stream = this.contentStream(request);
		let body = '';

		for await (const chunk of stream) body += chunk;

		const data = JSON.parse(body);
		request.body = data;
	}

	private contentStream(request: KlasaIncomingMessage | KlasaHttp2ServerRequest): Transform {
		// const length = request.headers['content-length'];
		let stream;
		switch ((request.headers['content-encoding'] || 'identity').toLowerCase()) {
			case 'deflate':
				stream = createInflate();
				request.pipe(stream);
				break;
			case 'gzip':
				stream = createGunzip();
				request.pipe(stream);
				break;
			case 'identity':
				stream = request;
				// stream.length = length;
				break;
		}
		return stream as Transform;
	}

}
