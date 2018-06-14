const { Route, constants: { RESPONSES } } = require('klasa-dashboard-hooks');
const { inspect } = require('util');

module.exports = class extends Route {

	constructor(...args) {
		super(...args, {
			route: 'oauth/user',
			authenticated: true
		});
	}

	async get(request, response) {
		const user = this.client.users.fetch(request.auth.scope[0]);
		return response.end(JSON.stringify(user));
	}

	async post(request, response) {
		const botUser = await this.client.users.fetch(request.body.id);
		const updated = await botUser.configs.update(request.body.data);
		const errored = Boolean(updated.errors.length);

		if (errored) this.client.emit('error', `${botUser.username}[${botUser.id}] failed updating user configs via dashboard with error:\n${inspect(updated.errors)}`);

		return response.end(RESPONSES.UPDATED[Number(!errored)]);
	}

};
