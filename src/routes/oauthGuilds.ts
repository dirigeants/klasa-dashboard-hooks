import { Route, RESPONSES, RouteStore } from '@klasa/dashboard-hooks';
import { inspect } from 'util';

export default class extends Route {

	constructor(store: RouteStore, dir: string, file: string[]) {
		super(store, dir, file, {
			route: 'oauth/user/guilds',
			authenticated: true
		});
	}

	async post(request, response) {
		const botGuild = this.client.guilds.get(request.body.id);
		const updated = await botGuild.settings.update(request.body.data, { action: 'overwrite' });
		const errored = Boolean(updated.errors.length);

		if (errored) this.client.emit('error', `${botGuild.name}[${botGuild.id}] failed updating guild configs via dashboard with error:\n${inspect(updated.errors)}`);

		return response.end(RESPONSES.UPDATED[Number(!errored)]);
	}

}
