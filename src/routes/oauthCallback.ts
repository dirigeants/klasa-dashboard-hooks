import { Route, encrypt, RESPONSES, RouteStore, KlasaHttp2ServerRequest, KlasaHttp2ServerResponse, KlasaIncomingMessage, KlasaServerResponse } from '@klasa/dashboard-hooks';
import fetch from 'node-fetch';

import type { default as OAuthUser } from './oauthUser';

export default class extends Route {

	constructor(store: RouteStore, dir: string, file: string[]) {
		super(store, dir, file, { route: 'oauth/callback' });
	}

	private get oauthUser(): OAuthUser {
		return this.store.get('oauthUser') as OAuthUser;
	}

	public async post(request: KlasaIncomingMessage | KlasaHttp2ServerRequest, response: KlasaServerResponse | KlasaHttp2ServerResponse): Promise<void> {
		/* eslint-disable camelcase */
		if (!request.body.code) return this.noCode(response);
		const url = new URL('https://discordapp.com/api/oauth2/token');
		url.search = new URLSearchParams([
			['grant_type', 'authorization_code'],
			['redirect_uri', request.body.redirectUri],
			['code', request.body.code]
		]);
		const res = await fetch(url, {
			headers: { Authorization: `Basic ${Buffer.from(`${this.client.options.dashboardHooks.clientID}:${this.client.options.dashboardHooks.clientSecret}`).toString('base64')}` },
			method: 'POST'
		});
		if (!res.ok) return response.end(RESPONSES.FETCHING_TOKEN);

		const { oauthUser } = this;

		if (!oauthUser) return this.notReady(response);

		const body = await res.json();
		const user = await oauthUser.api(body.access_token);

		return response.json({
			access_token: encrypt({
				token: body.access_token,
				scope: [user.id, ...user.guilds.filter(guild => guild.userCanManage).map(guild => guild.id)]
			}, this.client.options.dashboardHooks.clientSecret),
			user
		});
		/* eslint-enable camelcase */
	}

	private notReady(response: KlasaServerResponse | KlasaHttp2ServerResponse): void {
		return response.status(500).end(RESPONSES.NOT_READY);
	}

	private noCode(response: KlasaServerResponse | KlasaHttp2ServerResponse): void {
		return response.status(400).end(RESPONSES.NO_CODE);
	}

}
