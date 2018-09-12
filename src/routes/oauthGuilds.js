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
		const botGuild = this.client.guilds.get(request.body.id);
		const member = await botGuild.members.fetch(request.auth.scope[0]);
		const canManage = member.permissions.has('MANAGE_GUILD');

		if (!member || !botGuild) this.notFound(response);

		if (!canManage) return this.unauthorized(response);

		const updated = await botGuild.settings.update(request.body.data, { action: 'overwrite' });
		const errored = Boolean(updated.errors.length);

		if (errored) this.client.emit('error', `${botGuild.name}[${botGuild.id}] failed updating guild configs via dashboard with error:\n${inspect(updated.errors)}`);

		return response.end(RESPONSES.UPDATED[Number(!errored)]);
	}

	unauthorized(response) {
		response.writeHead(401);
		return response.end(RESPONSES.UNAUTHORIZED);
	}

	notFound(response) {
		response.writeHead(404);
		return response.end(RESPONSES.NOT_FOUND);
	}

};
