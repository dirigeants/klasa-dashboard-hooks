import { Route, RouteStore, KlasaIncomingMessage, KlasaServerResponse } from '@klasa/dashboard-hooks';
import { Duration } from '@klasa/duration';

export default class extends Route {

	constructor(store: RouteStore, dir: string, file: string[]) {
		super(store, dir, file, { route: 'application' });
	}

	public get(_request: KlasaIncomingMessage, response: KlasaServerResponse): void {
		return response.json({
			users: this.client.users.size,
			guilds: this.client.guilds.size,
			channels: this.client.channels.size,
			shards: this.client.ws.shards.size,
			uptime: Duration.toNow(Date.now() - (process.uptime() * 1000)),
			latency: this.client.ws.ping.toFixed(0),
			memory: process.memoryUsage().heapUsed / 1024 / 1024,
			// eslint-disable-next-line @typescript-eslint/ban-ts-comment
			// @ts-expect-error
			invite: this.client.invite,
			// eslint-disable-next-line @typescript-eslint/ban-ts-comment
			// @ts-expect-error
			...this.client.application
		});
	}

}
