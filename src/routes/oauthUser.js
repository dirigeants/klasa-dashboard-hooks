const snekfetch = require('snekfetch');
const { Route } = require('klasa-dashboard-hooks');

module.exports = class extends Route {

	constructor(...args) {
		super(...args, {
			route: 'oauth/user',
			authenticated: true
		});
	}

	async get(request, response) {
		const { body: user } = await snekfetch.get('https://discordapp.com/api/users/@me')
			.set('Authorization', request.headers.authorization);
		const botUser = await this.client.users.fetch(user.id);
		await botUser.configs.update('session', request.headers.authorization);
		user.configs = botUser.configs.clone();
		user.configs.session = undefined;
		return response.end(JSON.stringify(user));
	}

	async post(request, response) {
		const botUser = await this.client.users.fetch(request.body.id);

		if (botUser.configs.session !== request.headers.authorization) {
			response.writeHead(401);
			return response.end(JSON.stringify({ message: 'Unauthorized' }));
		}

		let updated;

		try {
			if ('session' in request.body.data) delete request.body.data.session;
			updated = await botUser.configs.update(request.body.data);
		} catch (err) {
			this.client.emit('error', `${botUser.username}[${botUser.id}] failed updating user configs via dashboard with error:\n${err}`);
		}

		return response.end(JSON.stringify({ updated: !!updated }));
	}

	async init() {
		if (!this.client.gateways.users.schema.has('session')) {
			this.client.gateways.users.schema.add('session', {
				type: 'string',
				configurable: false
			});
		}
	}

};
