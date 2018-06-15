const snekfetch = require('snekfetch');
const { Route, constants: { RESPONSES } } = require('klasa-dashboard-hooks');
const { inspect } = require('util');

module.exports = class extends Route {

	constructor(...args) {
		super(...args, {
			route: 'oauth/user',
			authenticated: true
		});
	}

	async api(token) {
		const { body: user } = await snekfetch.get('https://discordapp.com/api/users/@me')
			.set('Authorization', `Bearer ${token}`);
		const botUser = await this.client.users.fetch(user.id);
		user.configs = botUser && botUser.configs;
		return user;
	}

	async get(request, response) {
		return response.end(JSON.stringify(this.api(request.auth.token)));
	}

	async post(request, response) {
		const botUser = await this.client.users.fetch(request.body.id);
		const updated = await botUser.configs.update(request.body.data);
		const errored = Boolean(updated.errors.length);

		if (errored) this.client.emit('error', `${botUser.username}[${botUser.id}] failed updating user configs via dashboard with error:\n${inspect(updated.errors)}`);

		return response.end(RESPONSES.UPDATED[Number(!errored)]);
	}

};
