const snekfetch = require('snekfetch');
const { Route } = require('klasa-dashboard-hooks');
const { Permissions } = require('discord.js');
const { inspect } = require('util');

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
				guild.configs = botGuild.configs.toJSON();
				guild.configs.session = undefined;
			}
		}
		return response.end(JSON.stringify(guilds));
	}

	async post(request, response) {
		const botGuild = this.client.guilds.get(request.body.id);

		if ('sessions' in request.body.data) delete request.body.data.sessions;

		const updated = await botGuild.configs.update(request.body.data);
		const errored = Boolean(updated.errors.length);

		if (errored) this.client.emit('error', `${botGuild.name}[${botGuild.id}] failed updating guild configs via dashboard with error:\n${inspect(updated.errors)}`);

		return response.end(JSON.stringify({ updated: !errored }));
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
