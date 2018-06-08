const snekfetch = require('snekfetch');
const { Route } = require('klasa-dashboard-hooks');

module.exports = class extends Route {

	constructor(...args) {
		super(...args, { route: 'oauth/user' });
	}

	async get(request, response) {
		const { authorization } = request.headers;
		if (!authorization) {
			console.log(authorization);
			response.writeHead(401, { 'Content-Type': 'application/json' });
			return response.end(JSON.stringify({ message: 'Unauthorized' }));
		}
		const { body: user } = await snekfetch.get('https://discordapp.com/api/users/@me')
			.set('Authorization', authorization);

		return response.end(JSON.stringify(user));
	}

};
