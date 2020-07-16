import { Middleware, decrypt, RESPONSES, MiddlewareStore, Route, KlasaServerResponse, KlasaIncomingMessage } from '@klasa/dashboard-hooks';

export default class extends Middleware {

	public constructor(store: MiddlewareStore, dir: string, file: string[]) {
		super(store, dir, file, { priority: 100 });
	}

	public async run(request: KlasaIncomingMessage, response: KlasaServerResponse, route: Route): Promise<void> {
		if (!route || !route.authenticated) return;
		try {
			request.auth = decrypt(request.headers.authorization as string, this.client.options.dashboardHooks.clientSecret);
			if (request.method === 'POST' && !request.auth.scope.includes(request.body.id)) throw true;
		} catch (err) {
			this.unauthorized(response);
		}
	}

	private unauthorized(response: KlasaServerResponse) {
		return response.status(401).end(RESPONSES.UNAUTHORIZED);
	}

}
