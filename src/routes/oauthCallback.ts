import { Route, encrypt, formEncode, RESPONSES, RouteStore, KlasaIncomingMessage, KlasaServerResponse } from '@klasa/dashboard-hooks';
import fetch from 'node-fetch';

export default class extends Route {

	constructor(store: RouteStore, dir: string, file: string[]) {
		super(store, dir, file, { route: 'oauth/callback' });
	}

	public async post(request: KlasaIncomingMessage, response: KlasaServerResponse): Promise<void> {
		/* eslint-disable camelcase */
		if (!request.body.code) return this.noCode(response);
		const res = await fetch('https://discord.com/api/v6/oauth2/token', {
			headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
			method: 'POST',
			body: formEncode({
				client_id: this.client.options.dashboardHooks.clientID,
				client_secret: this.client.options.dashboardHooks.clientSecret,
				grant_type: 'authorization_code',
				code: request.body.code,
				redirect_uri: request.body.redirectUri,
				scope: 'identify guilds'
			})
		});
		if (!res.ok) {
			this.client.emit('debug', res.status, await res.text());
			return response.end(RESPONSES.FETCHING_TOKEN);
		}

		const body = await res.json();
		const user = await this.client.dashboardUsers.fetch(body.access_token);

		// eslint-disable-next-line @typescript-eslint/ban-ts-comment
		// @ts-expect-error
		await user.settings.sync();

		return response.json({
			access_token: encrypt({
				token: body.access_token,
				scope: [user.id, ...user.guilds.filter(guild => guild.userCanManage).map(guild => guild.id)]
			}, this.client.options.dashboardHooks.clientSecret),
			user
		});
		/* eslint-enable camelcase */
	}

	private noCode(response: KlasaServerResponse): void {
		return response.status(400).end(RESPONSES.NO_CODE);
	}

}
