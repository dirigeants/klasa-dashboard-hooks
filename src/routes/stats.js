const { Route, Duration } = require('klasa-dashboard-hooks');
const os = require('os');

module.exports = class extends Route {

	constructor(...args) {
		super(...args, { route: 'data/stats' });
	}

	get(request, response) {
		const data = {
			users: this.client.users.size,
			members: this.client.guilds.reduce((prev, guild) => prev + guild.memberCount, 0),
			guilds: this.client.guilds.size,
			channels: this.client.guilds.reduce((prev, guild) => prev + guild.channels.size, 0),
			cpu: Math.round(os.loadavg()[0] * 10000) / 100,
			memoryTotal: Math.round(100 * (process.memoryUsage().heapTotal / 1048576)) / 100,
			memoryUsed: Math.round(100 * (process.memoryUsage().heapUsed / 1048576)) / 100,
			uptime: {
				host: Duration.toNow(Date.now() - (os.uptime() * 1000)),
				process: Duration.toNow(Date.now() - (process.uptime() * 1000)),
				client: Duration.toNow(Date.now() - this.client.uptime)
			}
		};
		return response.end(JSON.stringify(data));
	}

};
