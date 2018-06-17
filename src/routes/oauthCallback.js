const snekfetch = require('snekfetch');
const { Route, util: { encrypt }, constants: { RESPONSES } } = require('klasa-dashboard-hooks');

module.exports = class extends Route {

	constructor(...args) {
		super(...args, { route: 'oauth/callback' });
	}

	get oauthUser() {
		return this.store.get('oauthUser');
	}

	async post(request, response) {
		/* eslint-disable camelcase */
		if (!request.body.code) return this.noCode(response);
		const res = await snekfetch.post('https://discordapp.com/api/oauth2/token')
			.set({ Authorization: `Basic ${Buffer.from(`${this.client.options.clientID}:${this.client.options.clientSecret}`).toString('base64')}` })
			.query({
				grant_type: 'authorization_code',
				redirect_uri: request.body.redirectUri,
				code: request.body.code
			});
		if (!res) return response.end(RESPONSES.FETCHING_TOKEN);

		const { oauthUser } = this;

		if (!oauthUser) return this.notReady(response);

		const user = await oauthUser.api(res.body.access_token);

		return response.end(JSON.stringify({
			access_token: encrypt({
				token: res.body.access_token,
				scope: [user.id, ...user.guilds.map(guild => guild.id)]
			}, this.client.options.clientSecret),
			user
		}));
		/* eslint-enable camelcase */
	}

	notReady(response) {
		response.writeHead(500);
		return response.end(RESPONSES.NOT_READY);
	}

	noCode(response) {
		response.writeHead(400);
		return response.end(RESPONSES.NO_CODE);
	}

};
