const { Route } = require('klasa-dashboard-hooks');

module.exports = class extends Route {

	constructor(...args) {
		super(...args, {
			route: 'oauth/logout',
			authenticated: true
		});
	}

	async get(request, response) {
		await this.client.configs.update('session', request.headers.authorization, { action: 'remove' });
		return response.end(JSON.stringify({ message: 'Ok' }));
	}

};
