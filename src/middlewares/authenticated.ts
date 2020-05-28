import { Middleware, decrypt, RESPONSES, MiddlewareStore, Route, KlasaHttp2ServerResponse, KlasaServerResponse, KlasaIncomingMessage, KlasaHttp2ServerRequest } from '@klasa/dashboard-hooks';

export default class extends Middleware {

	public constructor(store: MiddlewareStore, dir: string, file: string[]) {
		super(store, dir, file, { priority: 100 });
	}

	public async run(request: KlasaIncomingMessage | KlasaHttp2ServerRequest, response: KlasaServerResponse | KlasaHttp2ServerResponse, route: Route): Promise<void> {
		if (!route || !route.authenticated) return;
		try {
			request.auth = decrypt(request.headers.authorization as string, this.client.options.dashboardHooks.clientSecret);
			if (request.method === 'POST' && !request.auth.scope.includes(request.body.id)) throw true;
		} catch (err) {
			this.unauthorized(response);
		}
	}

	private unauthorized(response: KlasaServerResponse | KlasaHttp2ServerResponse) {
		return response.status(401).end(RESPONSES.UNAUTHORIZED);
	}

}
