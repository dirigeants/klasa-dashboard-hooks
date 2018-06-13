const snekfetch = require('snekfetch');
const { Route } = require('klasa-dashboard-hooks');
const { Permissions } = require('discord.js');

module.exports = class extends Route {

	constructor(...args) {
		super(...args, {
			route: 'oauth/user/guilds',
			authenticated: true
		});
	}

	async get(request, response) {
		const { body } = await snekfetch.get('https://discordapp.com/api/users/@me/guilds')
			.set('Authorization', request.headers.authorization);
		const guilds = body.filter(guild => guild.owner || new Permissions(guild.permissions).has('MANAGE_GUILD'));
		for (const guild of guilds) {
			const botGuild = this.client.guilds.get(guild.id);
			guild.canManage = !!botGuild;
			if (botGuild) {
				await botGuild.configs.update('sessions', request.headers.authorization, { action: 'add' });
				guild.configs = botGuild.configs.clone();
				guild.configs.session = undefined;
			}
		}
		return response.end(JSON.stringify(guilds));
	}

	async post(request, response) {
		const botGuild = this.client.guilds.get(request.body.id);
		let updated;

		try {
			if ('sessions' in request.body.data) delete request.body.data.sessions;
			updated = await botGuild.configs.update(request.body.data);
		} catch (err) {
			this.client.emit('error', `${botGuild.name}[${botGuild.id}] failed updating guild configs via dashboard with error:\n${err}`);
		}

		return response.end(JSON.stringify({ updated: !!updated }));
	}


	async init() {
		if (!this.client.gateways.guilds.schema.has('sessions')) {
			this.client.gateways.guilds.schema.add('sessions', {
				type: 'string',
				array: true,
				configurable: false
			});
		}
	}


};
