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
			guild.configs = botGuild && botGuild.configs;
		}
		return response.end(JSON.stringify(guilds));
	}

	async post(request, response) {
		const botGuild = await this.client.users.fetch(request.body.id);
		const updated = await botGuild.configs.update(request.body.data);
		return response.end(JSON.stringify({ updated: !updated.errors.length }));
	}

};
