import { createInflate, createGunzip } from 'zlib';
import { Middleware, MiddlewareStore, KlasaIncomingMessage } from '@klasa/dashboard-hooks';
import type { Transform } from 'stream';

export default class extends Middleware {

	public constructor(store: MiddlewareStore, dir: string, file: string[]) {
		super(store, dir, file, { priority: 20 });
	}

	public async run(request: KlasaIncomingMessage): Promise<void> {
		if (request.method !== 'POST') return;

		const stream = this.contentStream(request);
		let body = '';

		for await (const chunk of stream) body += chunk;

		const data = JSON.parse(body);
		request.body = data;
	}

	private contentStream(request: KlasaIncomingMessage): Transform {
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
