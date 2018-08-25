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
		let botGuild;
		if (this.client.shard) {
			botGuild = this.client.guilds.get(request.body.id);
		} else {
			const guildArray = await this.client.shard.broadcastEval(`this.guilds.get(${request.body.id}`);
			botGuild = guildArray.filter(guild => guild);
		}
		const updated = await botGuild.settings.update(request.body.data, { action: 'overwrite' });
		const errored = Boolean(updated.errors.length);

		if (errored) this.client.emit('error', `${botGuild.name}[${botGuild.id}] failed updating guild configs via dashboard with error:\n${inspect(updated.errors)}`);

		return response.end(RESPONSES.UPDATED[Number(!errored)]);
	}

};
