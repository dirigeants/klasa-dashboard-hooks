const { Permissions } = require('discord.js');

/**
 * Represents an OAuthGuild
 */
class DashboardGuild {

	/**
	 * @typedef {?external:KlasaGuildJSON} DashboardGuildJSON
	 * @property {string} id The id of the DashboardGuild
	 * @property {string} name The name of this DashboardGuild
	 * @property {string} icon The icon hash
	 * @property {boolean} userIsOwner If the user this is meant for is Owner of the guild
	 * @property {number} userGuildPermissions The permissions bitfield for the OAuth User in the Guild
	 * @property {boolean} userCanManage If the user can manage this DashboardGuild
	 */

	/**
	 * @since 0.0.1
	 * @param {DashboardClient} client The Dashboard Client
	 * @param {Object} guild The raw guild data
	 * @param {DashboardUser} user The OAuth User this Guild is for
	 */
	constructor(client, guild, user) {
		/**
		 * The DashboardClient
		 * @since 0.0.1
		 * @type {DashboardClient}
		 */
		this.client = client;

		/**
		 * The OAuth User this DashboardGuild is for
		 * @since 0.0.1
		 * @type {DashboardUser}
		 */
		this.user = user;

		/**
		 * The guild id
		 * @since 0.0.1
		 * @type {string}
		 */
		this.id = guild.id;

		/**
		 * The guild name
		 * @since 0.0.1
		 * @type {string}
		 */
		this.name = guild.name;

		/**
		 * The guild icon hash
		 * @since 0.0.1
		 * @type {?string}
		 */
		this.icon = guild.icon;

		/**
		 * If the logged in OAuthUser is the owner of the guild
		 * @since 0.0.1
		 * @type {boolean}
		 */
		this.userIsOwner = guild.owner;

		/**
		 * The guild permissions for the logged in OAuthUser
		 * @since 0.0.1
		 * @type {external:Permissions}
		 */
		this.userGuildPermissions = new Permissions(guild.permissions);

		/**
		 * If the logged in OAuthUser can manage the guild (invite bots)
		 * @since 0.0.1
		 * @type {boolean}
		 */
		this.userCanManage = this.userGuildPermissions.has('MANAGE_GUILD');
	}

	/**
	 * The url for the guild's icon
	 * @since 0.0.1
	 * @type {?string}
	 * @readonly
	 */
	get iconURL() {
		const { guild } = this;
		if (guild) return guild.iconURL({ format: 'png' });
		if (this.icon) return `https://cdn.discordapp.com/icons/${this.id}/${this.icon}.png`;
		return null;
	}

	/**
	 * The guild for this DashboardGuild
	 * @since 0.0.1
	 * @type {?external:KlasaGuild}
	 * @readonly
	 */
	get guild() {
		return this.client.guilds.get(this.id) || null;
	}

	/**
	 * The toJSON behavior of this structure
	 * @since 0.0.1
	 * @returns {DashboardGuildJSON}
	 */
	toJSON() {
		const guild = (gld => gld ? gld.toJSON() : {})(this.guild);
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

}

module.exports = DashboardGuild;
