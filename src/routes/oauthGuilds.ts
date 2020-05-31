import { Route, RESPONSES, RouteStore, KlasaHttp2ServerRequest, KlasaHttp2ServerResponse, KlasaIncomingMessage, KlasaServerResponse } from '@klasa/dashboard-hooks';
import { inspect } from 'util';

export default class extends Route {

	public constructor(store: RouteStore, dir: string, file: string[]) {
		super(store, dir, file, {
			route: 'oauth/user/guilds',
			authenticated: true
		});
	}

	public async post(request: KlasaIncomingMessage | KlasaHttp2ServerRequest, response: KlasaServerResponse | KlasaHttp2ServerResponse): Promise<void> {
		const botGuild = this.client.guilds.get(request.body.id);
		const updated = await botGuild.settings.update(request.body.data, { action: 'overwrite' });
		const errored = Boolean(updated.errors.length);

		if (errored) this.client.emit('error', `${botGuild.name}[${botGuild.id}] failed updating guild configs via dashboard with error:\n${inspect(updated.errors)}`);

		return response.end(RESPONSES.UPDATED[Number(!errored)]);
	}

}
