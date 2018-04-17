const Polka = require('polka')().constructor;
// Fuck polka for this export, btw
const { Duration } = require('klasa');

class DashboardHooks extends Polka {

	constructor(client, options = {
		port: 3000,
		origin: '*'
	}) {
		super();

		this.client = client;

		this.origin = options.origin;

		this.use(this.setHeaders.bind(this));

		this.get('api/application', (request, response) => response.end(JSON.stringify({
			users: this.client.users.size,
			guilds: this.client.guilds.size,
			channels: this.client.channels.size,
			shards: this.client.options.shardCount,
			uptime: Duration.toNow(Date.now() - (process.uptime() * 1000)),
			latency: this.client.ping.toFixed(0),
			memory: process.memoryUsage().heapUsed / 1024 / 1024,
			invite: this.client.invite,
			...this.client.application
		})));

		this.get('api/users', (request, response) => response.end(JSON.stringify(this.client.users.keyArray())));

		this.get('api/users/:userID', (request, response) => {
			const { userID } = request.params;
			const user = this.client.users.get(userID);
			if (!user) response.end('{}');
			return response.end(JSON.stringify(user));
		});

		this.get('api/guilds', (request, response) => response.end(JSON.stringify(this.client.guilds.keyArray())));

		this.get('api/guilds/:guildID', (request, response) => {
			const { guildID } = request.params;
			const guild = this.client.guilds.get(guildID);
			if (!guild) response.end('{}');
			return response.end(JSON.stringify(guild));
		});

		this.get('api/guilds/:guildID/members', (request, response) => {
			const { guildID } = request.params;
			const guild = this.client.guilds.get(guildID);
			if (!guild) response.end('[]');
			return response.end(JSON.stringify(guild.members.keyArray()));
		});

		this.get('api/guilds/:guildID/members/:memberID', (request, response) => {
			const { guildID, memberID } = request.params;
			const guild = this.client.guilds.get(guildID);
			if (!guild) return response.end('{}');
			const member = guild.members.get(memberID);
			if (!member) return response.end('{}');
			return response.end(JSON.stringify(member));
		});

		this.get('api/guilds/:guildID/roles', (request, response) => {
			const { guildID } = request.params;
			const guild = this.client.guilds.get(guildID);
			if (!guild) response.end('[]');
			return response.end(JSON.stringify(guild.roles.keyArray()));
		});

		this.get('api/guilds/:guildID/roles/:roleID', (request, response) => {
			const { guildID, roleID } = request.params;
			const guild = this.client.guilds.get(guildID);
			if (!guild) return response.end('{}');
			const role = guild.members.get(roleID);
			if (!role) return response.end('{}');
			return response.end(JSON.stringify(role));
		});

		this.get('api/guilds/:guildID/channels', (request, response) => {
			const { guildID } = request.params;
			const guild = this.client.guilds.get(guildID);
			if (!guild) response.end('[]');
			return response.end(JSON.stringify(guild.channels.keyArray()));
		});

		this.get('api/guilds/:guildID/channels/:channelID', (request, response) => {
			const { guildID, channelID } = request.params;
			const guild = this.client.guilds.get(guildID);
			if (!guild) return response.end('{}');
			const channel = guild.members.get(channelID);
			if (!channel) return response.end('{}');
			return response.end(JSON.stringify(channel));
		});

		for (const [name, store] of this.client.pieceStores) {
			this.get(`api/${name}`, (request, response) => response.end(JSON.stringify(store.keyArray())));

			this.get(`api/${name}/:id`, (request, response) => {
				const { id } = request.params;
				if (id === 'all') return response.end(JSON.stringify(store.array()));
				const piece = store.get(id);
				if (!piece) response.end('{}');
				return response.end(JSON.stringify(piece));
			});
		}

		this.listen(options.port);
	}

	setHeaders(request, response, next) {
		response.setHeader('Access-Control-Allow-Origin', this.origin);
		response.setHeader('Content-Type', 'application/json');
		next();
	}

}

module.exports = DashboardHooks;
