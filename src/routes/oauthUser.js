const snekfetch = require('snekfetch');
const { Route, util: { encrypt }, constants: { RESPONSES } } = require('klasa-dashboard-hooks');
const { inspect } = require('util');

module.exports = class extends Route {

	constructor(...args) {
		super(...args, {
			route: 'oauth/user',
			authenticated: true
		});
	}

	async api(token) {
		token = `Bearer ${token}`;
		const { body: user } = await snekfetch.get('https://discordapp.com/api/users/@me')
			.set('Authorization', token);
		await this.client.users.fetch(user.id);
		const { body: guilds } = await snekfetch.get('https://discordapp.com/api/users/@me/guilds')
			.set('Authorization', token);
		user.guilds = guilds;
		return this.client.dashboardUsers.add(user);
	}

	async get(request, response) {
		let dashboardUser = this.client.dashboardUsers.get(request.auth.scope[0]);

		if (!dashboardUser) {
			dashboardUser = await this.api(request.auth.token);
			response.setHeader('Authorization', encrypt({
				token: request.auth.token,
				scope: [dashboardUser.id, ...dashboardUser.guilds.map(guild => guild.id)]
			}, this.client.options.clientSecret));
		}

		return response.end(JSON.stringify(dashboardUser));
	}

	async post(request, response) {
		const botUser = await this.client.users.fetch(request.body.id);
		const updated = await botUser.configs.update(request.body.data);
		const errored = Boolean(updated.errors.length);

		if (errored) this.client.emit('error', `${botUser.username}[${botUser.id}] failed updating user configs via dashboard with error:\n${inspect(updated.errors)}`);

		return response.end(RESPONSES.UPDATED[Number(!errored)]);
	}

};
