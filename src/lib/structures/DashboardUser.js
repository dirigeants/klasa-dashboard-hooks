const { Collection } = require('discord.js');
const DashboardGuild = require('./dashboardGuild');

class DashboardUser {

	constructor(client, user) {
		this.client = client;
		this.id = user.id;
		this.username = user.username;
		this.discriminator = parseInt(user.discriminator);
		this.locale = user.locale;
		this.mfaEnabled = user.mfa_enabled;
		this.avatar = user.avatar;
		this.guilds = new Collection();
		this.constructor.setupGuilds(this, user.guilds);
	}

	get avatarURL() {
		const { user } = this;
		if (user) return user.displayAvatarURL();
		if (this.avatar) return `https://cdn.discordapp.com/avatars/${this.id}/${this.avatar}.png`;
		return `https://cdn.discordapp.com/embed/avatars/${this.discriminator % 5}.png`;
	}

	get user() {
		return this.client.users.get(this.id) || null;
	}

	static setupGuilds(dashboardUser, guilds) {
		for (const guild of guilds) dashboardUser.guilds.set(guild.id, new DashboardGuild(dashboardUser.client, guild));
	}

	toJSON() {
		const user = this.user.toJSON() || {};
		return {
			...user,
			id: this.id,
			username: this.username,
			discriminator: this.discriminator,
			locale: this.locale,
			mfaEnabled: this.mfaEnabled,
			avatarURL: this.avatarURL,
			guilds: [...this.guilds.values()]
		};
	}

}

module.exports = DashboardUser;
