import { Route, RESPONSES, RouteStore, KlasaIncomingMessage, KlasaServerResponse } from '@klasa/dashboard-hooks';
import { inspect } from 'util';

export default class extends Route {

	public constructor(store: RouteStore, dir: string, file: string[]) {
		super(store, dir, file, {
			route: 'oauth/user/guilds',
			authenticated: true
		});
	}

	public async post(request: KlasaIncomingMessage, response: KlasaServerResponse): Promise<void> {
		const botGuild = this.client.guilds.get(request.body.id);

		if (typeof botGuild === 'undefined') return response.end(RESPONSES.UPDATED[0]);

		// eslint-disable-next-line @typescript-eslint/ban-ts-comment
		// @ts-expect-error
		const updated = await botGuild.settings.update(request.body.data, { action: 'overwrite' });
		const errored = Boolean(updated.errors.length);

		if (errored) this.client.emit('error', `${botGuild.name}[${botGuild.id}] failed updating guild configs via dashboard with error:\n${inspect(updated.errors)}`);

		return response.end(RESPONSES.UPDATED[Number(!errored)]);
	}

}
