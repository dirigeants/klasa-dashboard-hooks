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
		user.configs = botUser.configs;
		return response.end(JSON.stringify(user));
	}

	async post(request, response) {
		const botUser = await this.client.users.fetch(request.body.id);
		const updated = await botUser.configs.update(request.body.data);
		return response.end(JSON.stringify({ updated: !updated.errors.length }));
	}

};
