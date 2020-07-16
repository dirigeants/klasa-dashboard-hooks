import { Middleware, MiddlewareStore, KlasaIncomingMessage, KlasaServerResponse } from '@klasa/dashboard-hooks';

export default class extends Middleware {

	constructor(store: MiddlewareStore, dir: string, file: string[]) {
		super(store, dir, file, { priority: 10 });
	}

	public run(request: KlasaIncomingMessage, response: KlasaServerResponse): void {
		response.setHeader('Access-Control-Allow-Origin', this.client.options.dashboardHooks.origin);
		response.setHeader('Access-Control-Allow-Methods', 'DELETE, GET, HEAD, OPTIONS, PATCH, POST, PUT');
		response.setHeader('Access-Control-Allow-Headers', 'Authorization, User-Agent, Content-Type');
		if (request.method === 'OPTIONS') {
			response.end('Something');
			return;
		}
		response.setHeader('Content-Type', 'application/json');
	}

}
