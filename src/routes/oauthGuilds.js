const { Route, constants: { RESPONSES } } = require('klasa-dashboard-hooks');
const { inspect } = require('util');

module.exports = class extends Route {

	constructor(...args) {
		super(...args, {
			route: 'oauth/user/guilds',
			authenticated: true
		});
	}

	async post(request, response) {
		let botGuild, updated;
		if (this.client.shard) {
			botGuild = this.client.guilds.get(request.body.id);
			updated = await botGuild.settings.update(request.body.data, { action: 'overwrite' });
		} else {
			const guildArray = await this.client.shard.broadcastEval(`this.guilds.get(${request.body.id})`);
			botGuild = guildArray.find(guild => guild);
			updated = await this.client.shard.broadcastEval(`
			const guild = this.guilds.get('${request.body.id}');
			if (guild) guild.settings.update(${request.body.data}, { action: "overwrite" });`);
		}

		const errored = Boolean(updated.errors.length);
		if (errored) this.client.emit('error', `${botGuild.name}[${botGuild.id}] failed updating guild configs via dashboard with error:\n${inspect(updated.errors)}`);

		return response.end(RESPONSES.UPDATED[Number(!errored)]);
	}

};
