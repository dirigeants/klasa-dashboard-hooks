const { Permissions } = require('discord.js');

module.exports = class DashboardGuild {

	constructor(client, guild) {
		this.client = client;
		this.id = guild.id;
		this.name = guild.name;
		this.icon = guild.icon;
		this.userIsOwner = guild.owner;
		this.userGuildPermissions = new Permissions(guild.permissions);
		this.userCanManage = this.userGuildPermissions.has('MANAGE_GUILD');
	}

	get iconURL() {
		const { guild } = this;
		if (guild) return guild.iconURL();
		if (this.icon) return `https://cdn.discordapp.com/icons/${this.id}/${this.icon}.png`;
		return null;
	}

	get guild() {
		return this.client.guilds.get(this.id);
	}

	toJSON() {
		const guild = this.guild || {};
		return {
			...guild,
			id: this.id,
			name: this.name,
			iconURL: this.iconURL,
			userIsOwner: this.userIsOwner,
			userGuildPermissions: this.userGuildPermissions,
			userCanManage: this.userCanManage
		};
	}

};

