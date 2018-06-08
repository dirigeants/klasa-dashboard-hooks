const { Route, Duration, version: klasaVersion } = require('klasa-dashboard-hooks');
const { version: discordVersion } = require('discord.js');
const os = require('os');
const { toShard } = require('../lib/util/util.js');

module.exports = class extends Route {

	constructor(...args) {
		super(...args, { route: 'data/stats' });
	}

	async get(request, response) {
		const data = {
			users: await toShard(this.client.users.size, this.client, true, true),
			members: await toShard(this.client.guilds, this.client, true, true),
			guilds: await toShard(this.client.guilds.size, this.client, true, true),
			channels: await toShard(this.client.guilds, this.client, true, true),
			cpu: Math.round(os.loadavg()[0] * 10000) / 100,
			memoryTotal: await toShard(process.memoryUsage().heapTotal / 1024 / 1024, this.client, true, true),
			memoryUsed: await toShard(process.memoryUsage().heapUsed / 1024 / 1024, this.client, true, true),
			uptime: {
				host: Duration.toNow(Date.now() - (os.uptime() * 1000)),
				process: Duration.toNow(Date.now() - (process.uptime() * 1000)),
				client: Duration.toNow(Date.now() - this.client.uptime)
			},
			extra: {
				klasaVersion: klasaVersion,
				discordVersion: discordVersion,
				processVersion: process.version
			}
		};
		return response.end(JSON.stringify(data));
	}

};
