const { Route } = require('klasa-dashboard-hooks');

module.exports = class extends Route {

	constructor(...args) {
		super(...args, {
			route: 'oauth/logout',
			authenticated: true
		});
	}

	async post(request, response) {
		const { authorization } = request.headers;
		const { id, guilds } = request.body;

		await this.client.configs.update('sessions', authorization, { action: 'remove' });

		const user = await this.client.users.fetch(id);

		if (user && user.configs.session === authorization) await user.configs.reset('session');

		for (const guildID of guilds) {
			const guild = this.client.guilds.get(guildID);
			if (guild) await guild.configs.update('sessions', authorization, { action: 'remove' });
		}

		return response.end(JSON.stringify({ message: 'Ok' }));
	}

};
