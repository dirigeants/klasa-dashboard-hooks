const snekfetch = require('snekfetch');
const { Route, util: { encrypt }, constants: { RESPONSES } } = require('klasa-dashboard-hooks');
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
		const { body: guilds } = await snekfetch.get('https://discordapp.com/api/users/@me/guilds')
			.set('Authorization', `Bearer ${request.auth.token}`);
		let updateToken = false;

		for (const guild of guilds) {
			guild.managable = this.client.guilds.has(guild.id) && (guild.owner || new Permissions(guild.permissions).has('MANAGE_GUILD'));
			if (!updateToken && request.auth.scope.indexOf(guild.id) === -1) updateToken = true;
		}

		if (updateToken) {
			const userID = request.auth.scope[0];
			response.setHeader('Authorization', encrypt({
				token: request.auth.token,
				scope: guilds.map(guild => guild.id).unshift(userID)
			}, this.client.options.clientSecret));
		}

		return response.end(JSON.stringify(guilds));
	}

	async post(request, response) {
		const botGuild = this.client.guilds.get(request.body.id);
		const updated = await botGuild.configs.update(request.body.data);
		const errored = Boolean(updated.errors.length);

		if (errored) this.client.emit('error', `${botGuild.name}[${botGuild.id}] failed updating guild configs via dashboard with error:\n${inspect(updated.errors)}`);

		return response.end(RESPONSES.UPDATED[Number(!errored)]);
	}

};
