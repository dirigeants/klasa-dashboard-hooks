const { APIServer } = require('http-nextra');

class DashboardHooks extends APIServer {

	constructor(client, options = {
		port: 3000,
		origin: '*'
	}) {
		super(async (request, response) => {
			if (!await this.router.runPath(request.url.slice(1).split('/'), request, response, {})) {
				response.end('Hello!');
			}
		});

		this.client = client;

		this.origin = options.origin;

		this.router.get('api/guilds', this.setHeaders.bind(this), (request, response) => response.end(JSON.stringify(this.client.guilds.keyArray())));

		this.router.get('api/guilds/:guildID', this.setHeaders.bind(this), (request, response, { guildID }) => {
			const guild = this.client.guilds.get(guildID);
			if (!guild) response.end('{}');
			return response.end(JSON.stringify(guild));
		});

		this.router.get('api/guilds/:guildID/members', this.setHeaders.bind(this), (request, response, { guildID }) => {
			const guild = this.client.guilds.get(guildID);
			if (!guild) response.end('[]');
			return response.end(JSON.stringify(guild.members.keyArray()));
		});

		this.router.get('api/guilds/:guildID/members/:memberID', this.setHeaders.bind(this), (request, response, { guildID, memberID }) => {
			const guild = this.client.guilds.get(guildID);
			if (!guild) return response.end('{}');
			const member = guild.members.get(memberID);
			if (!member) return response.end('{}');
			return response.end(JSON.stringify(member));
		});

		this.router.get('api/guilds/:guildID/roles', this.setHeaders.bind(this), (request, response, { guildID }) => {
			const guild = this.client.guilds.get(guildID);
			if (!guild) response.end('[]');
			return response.end(JSON.stringify(guild.roles.keyArray()));
		});

		this.router.get('api/guilds/:guildID/roles/:roleID', this.setHeaders.bind(this), (request, response, { guildID, roleID }) => {
			const guild = this.client.guilds.get(guildID);
			if (!guild) return response.end('{}');
			const role = guild.members.get(roleID);
			if (!role) return response.end('{}');
			return response.end(JSON.stringify(role));
		});

		this.router.get('api/guilds/:guildID/channels', this.setHeaders.bind(this), (request, response, { guildID }) => {
			const guild = this.client.guilds.get(guildID);
			if (!guild) response.end('[]');
			return response.end(JSON.stringify(guild.channels.keyArray()));
		});

		this.router.get('api/guilds/:guildID/channels/:channelID', this.setHeaders.bind(this), (request, response, { guildID, channelID }) => {
			const guild = this.client.guilds.get(guildID);
			if (!guild) return response.end('{}');
			const channel = guild.members.get(channelID);
			if (!channel) return response.end('{}');
			return response.end(JSON.stringify(channel));
		});

		for (const [name, store] of this.client.pieceStores) {
			this.router.get(`api/${name}`, this.setHeaders.bind(this), (request, response) => response.end(JSON.stringify(store.keyArray())));

			this.router.get(`api/${name}/:id`, this.setHeaders.bind(this), (request, response, { id }) => {
				const piece = store.get(id);
				if (!piece) response.end('{}');
				return response.end(JSON.stringify(piece));
			});
		}

		this.listen(options.port);
	}

	setHeaders(req, res) {
		res.setHeader('Access-Control-Allow-Origin', this.origin);
		res.setHeader('Content-Type', 'application/json');
		return true;
	}

}

module.exports = DashboardHooks;
