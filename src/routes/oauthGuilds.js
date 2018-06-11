const snekfetch = require('snekfetch');
const { Route } = require('klasa-dashboard-hooks');
const { Permissions } = require('discord.js');

module.exports = class extends Route {

	constructor(...args) {
		super(...args, { route: 'oauth/guilds' });
	}

	async get(request, response) {
		const auth = request.headers.authorization;
		if (!auth) {
			response.writeHead(401, { 'Content-Type': 'application/json' });
			return response.end(JSON.stringify({ message: 'Unauthorized' }));
		}
		const { body } = await snekfetch.get('https://discordapp.com/api/users/@me/guilds')
			.set('Authorization', auth);
		const guilds = body.filter(guild => guild.owner || new Permissions(guild.permissions).has('MANAGE_GUILD'));
		for (const guild of guilds) guild.canManage = this.client.guilds.has(guild.id);
		return response.end(JSON.stringify(guilds));
	}

};
