const snekfetch = require('snekfetch');
const { Route } = require('klasa-dashboard-hooks');

module.exports = class extends Route {

	constructor(...args) {
		super(...args, { route: 'oauth/callback' });
	}

	async post(request, response) {
		/* eslint-disable camelcase */
		if (!request.body.code) return this.noCode(response);
		const res = await snekfetch.post(`https://discordapp.com/api/oauth2/token`)
			.set({ Authorization: `Basic ${Buffer.from(`${this.client.options.clientID}:${this.client.options.clientSecret}`, 'binary').toString('base64')}` })
			.query({
				grant_type: 'authorization_code',
				redirect_uri: request.body.redirectUri,
				code: request.body.code
			});
		if (!res) return response.end(JSON.stringify({ message: 'Error fetching token' }));

		await this.client.configs.update('sessions', `Bearer ${res.body.access_token}`, { action: 'add' });

		return response.end(JSON.stringify(res.body));
		/* eslint-enable camelcase */
	}

	noCode(response) {
		response.writeHead(400);
		return response.end(JSON.stringify({ message: 'No code provided' }));
	}

};
