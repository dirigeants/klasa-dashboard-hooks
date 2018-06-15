const snekfetch = require('snekfetch');
const { Route, util: { encrypt }, constants: { RESPONSES } } = require('klasa-dashboard-hooks');

module.exports = class extends Route {

	constructor(...args) {
		super(...args, { route: 'oauth/callback' });
	}

	get user() {
		return this.store.get('oauthUser');
	}

	get guilds() {
		return this.store.get('oauthGuilds');
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

		const user = await this.user.api(res.body.access_token);
		const guilds = await this.guilds.api(res.body.access_token);

		return response.end(JSON.stringify({
			access_token: encrypt({
				token: res.body.access_token,
				scope: [user.id, ...guilds.map(guild => guild.id)]
			}, this.client.options.clientSecret),
			user,
			guilds
		}));
		/* eslint-enable camelcase */
	}

	noCode(response) {
		response.writeHead(400);
		return response.end(RESPONSES.NO_CODE);
	}

};
