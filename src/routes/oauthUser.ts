import { Route, encrypt, RESPONSES, RouteStore, KlasaIncomingMessage, KlasaServerResponse } from '@klasa/dashboard-hooks';
import { inspect } from 'util';

export default class extends Route {

	public constructor(store: RouteStore, dir: string, file: string[]) {
		super(store, dir, file, {
			route: 'oauth/user',
			authenticated: true
		});
	}

	public async get(request: KlasaIncomingMessage, response: KlasaServerResponse): Promise<void> {
		let dashboardUser = this.client.dashboardUsers.get(request.auth.scope[0]);

		if (!dashboardUser) {
			dashboardUser = await this.client.dashboardUsers.fetch(request.auth.token);
			response.setHeader('Authorization', encrypt({
				token: request.auth.token,
				// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
				scope: [dashboardUser!.id, ...dashboardUser!.guilds.filter(guild => guild.userCanManage).map(guild => guild.id)]
			}, this.client.options.dashboardHooks.clientSecret));
		}

		return response.json(dashboardUser);
	}

	public async post(request: KlasaIncomingMessage, response: KlasaServerResponse): Promise<void> {
		const botUser = await this.client.users.fetch(request.body.id);

		try {
			// eslint-disable-next-line @typescript-eslint/ban-ts-comment
			// @ts-expect-error
			await botUser.settings.sync();

			// eslint-disable-next-line @typescript-eslint/ban-ts-comment
			// @ts-expect-error
			await botUser.settings.update(request.body.data, { action: 'overwrite' });

			return response.end(RESPONSES.UPDATED[1]);
		} catch (error) {
			this.client.emit('error', `${botUser.username}[${botUser.id}] failed updating user configs via dashboard with error:\n${inspect(error)}`);

			return response.end(RESPONSES.UPDATED[0]);
		}
	}

}
