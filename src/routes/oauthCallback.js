const { Route, util: { encrypt }, constants: { RESPONSES } } = require('klasa-dashboard-hooks');
const fetch = require('node-fetch');

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
		const url = new URL('https://discordapp.com/api/oauth2/token');
		url.search = new URLSearchParams([
			['grant_type', 'authorization_code'],
			['redirect_uri', request.body.redirectUri],
			['code', request.body.code]
		]);
		const res = await fetch(url, {
			headers: { Authorization: `Basic ${Buffer.from(`${this.client.options.clientID}:${this.client.options.clientSecret}`).toString('base64')}` },
			method: 'POST'
		});
		if (!res.ok) return response.end(RESPONSES.FETCHING_TOKEN);

		const { oauthUser } = this;

		if (!oauthUser) return this.notReady(response);

		const body = await res.json();
		const user = await oauthUser.api(body.access_token);

		return response.end(JSON.stringify({
			access_token: encrypt({
				token: body.access_token,
				scope: [user.id, ...user.guilds.filter(guild => guild.userCanManage).map(guild => guild.id)]
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
