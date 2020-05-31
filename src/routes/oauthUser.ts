import { Route, encrypt, RESPONSES, RouteStore, DashboardUser, KlasaHttp2ServerRequest, KlasaHttp2ServerResponse, KlasaIncomingMessage, KlasaServerResponse } from '@klasa/dashboard-hooks';
import { inspect } from 'util';
import fetch from 'node-fetch';

export default class extends Route {

	public constructor(store: RouteStore, dir: string, file: string[]) {
		super(store, dir, file, {
			route: 'oauth/user',
			authenticated: true
		});
	}

	public async api(token: string): Promise<DashboardUser> {
		token = `Bearer ${token}`;
		const user = await fetch('https://discordapp.com/api/users/@me', { headers: { Authorization: token } })
			.then(result => result.json());
		await this.client.users.fetch(user.id);
		user.guilds = await fetch('https://discordapp.com/api/users/@me/guilds', { headers: { Authorization: token } })
			.then(result => result.json());
		// eslint-disable-next-line dot-notation
		return this.client.dashboardUsers['_add'](user);
	}

	public async get(request: KlasaIncomingMessage | KlasaHttp2ServerRequest, response: KlasaServerResponse | KlasaHttp2ServerResponse): Promise<void> {
		let dashboardUser = this.client.dashboardUsers.get(request.auth.scope[0]);

		if (!dashboardUser) {
			dashboardUser = await this.api(request.auth.token);
			response.setHeader('Authorization', encrypt({
				token: request.auth.token,
				// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
				scope: [dashboardUser!.id, ...dashboardUser!.guilds.filter(guild => guild.userCanManage).map(guild => guild.id)]
			}, this.client.options.dashboardHooks.clientSecret));
		}

		return response.json(dashboardUser);
	}

	public async post(request: KlasaIncomingMessage | KlasaHttp2ServerRequest, response: KlasaServerResponse | KlasaHttp2ServerResponse): Promise<void> {
		const botUser = await this.client.users.fetch(request.body.id);
		const updated = await botUser.settings.update(request.body.data, { action: 'overwrite' });
		const errored = Boolean(updated.errors.length);

		if (errored) this.client.emit('error', `${botUser.username}[${botUser.id}] failed updating user configs via dashboard with error:\n${inspect(updated.errors)}`);

		return response.end(RESPONSES.UPDATED[Number(!errored)]);
	}

}
