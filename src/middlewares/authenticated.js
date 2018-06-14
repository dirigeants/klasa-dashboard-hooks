const { Middleware, util: { decrypt }, constants: { RESPONSES } } = require('klasa-dashboard-hooks');

module.exports = class extends Middleware {

	constructor(...args) {
		super(...args, { priority: 100 });
	}

	async run(request, response, route) {
		if (!route || !route.authenticated) return;
		try {
			request.auth = decrypt(request.headers.authorization, this.client.options.clientSecret);
			if (request.method === 'POST' && !request.auth.scope.includes(request.body.id)) throw true;
		} catch (err) {
			this.unauthorized(response);
		}
	}

	unauthorized(response) {
		response.writeHead(401);
		return response.end(RESPONSES.UNAUTHORIZED);
	}

};
