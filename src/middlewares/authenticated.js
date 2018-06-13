const { Middleware } = require('klasa-dashboard-hooks');

module.exports = class extends Middleware {

	async run(request, response, route) {
		if (!route || !route.authenticated) return;
		const auth = request.headers.authorization;
		if (!auth || !this.client.configs.sessions.indexOf(auth) === -1) this.unauthorized(response);
		if (request.method === 'POST') {
			let guildOrUser = this.client.guilds.get(request.body.id);
			if (!guildOrUser) guildOrUser = await this.client.users.fetch(request.body.id);
			if (!guildOrUser ||
				(guildOrUser.configs.sessions && !guildOrUser.configs.sessions.includes(auth)) ||
				(guildOrUser.configs.session && guildOrUser.configs.session !== auth)
			) this.unauthorized(response);
		}
	}

	unauthorized(response) {
		response.writeHead(401);
		return response.end(JSON.stringify({ message: 'Unauthorized' }));
	}

	async init() {
		if (!this.client.gateways.clientStorage.schema.has('sessions')) {
			this.client.gateways.clientStorage.schema.add('sessions', {
				type: 'string',
				array: true
			});
		}
	}

};
