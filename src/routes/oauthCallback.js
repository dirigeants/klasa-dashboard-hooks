const snekfetch = require('snekfetch');
const { Route } = require('klasa-dashboard-hooks');

module.exports = class extends Route {

	constructor(...args) {
		super(...args, { route: 'oauth/callback' });
	}

	async post(request, response) {
		if (!request.body.code) {
			response.writeHead(400, { 'Content-Type': 'application/json' });
			return response.end(JSON.stringify({ message: 'No code provided' }));
		}
		const creds = Buffer.from(`${this.client.options.clientID}:${this.client.options.clientSecret}`, 'binary').toString('base64');
		/* eslint-disable camelcase */
		const res = await snekfetch.post(`https://discordapp.com/api/oauth2/token`)
			.set({ Authorization: `Basic ${creds}` })
			.query({
				grant_type: 'authorization_code',
				redirect_uri: request.body.redirectUri,
				code: request.body.code
			});
		/* eslint-enable camelcase */
		if (!res) return response.end(JSON.stringify({ message: 'Error fetching token' }));
		return response.end(JSON.stringify(res.body));
	}

};
