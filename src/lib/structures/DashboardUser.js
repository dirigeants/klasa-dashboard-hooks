const { Collection } = require('discord.js');
const DashboardGuild = require('./DashboardGuild');

/**
 * Represents an OAuth User
 */
class DashboardUser {

	/**
	 * @typedef {?external:KlasaUserJSON} DashboardUserJSON
	 * @property {string} id The id of the DashboardUser
	 * @property {string} username The name of this DashboardUser
	 * @property {string} avatar The avatar hash
	 * @property {number} discriminator The discriminator of this DashboardUser
	 * @property {string} locale The language of this DashboardUser
	 * @property {boolean} mfaEnabled If the OAuth User has multi-factor Authentication enabled
	 * @property {DashboardGuild[]} guilds The guilds associated with this OAuth User
	 */

	/**
	 * @since 0.0.1
	 * @param {DashboardClient} client The client
	 * @param {Object} user The raw user data
	 */
	constructor(client, user) {
		/**
		 * The DashboardClient
		 * @since 0.0.1
		 * @type {DashboardClient}
		 */
		this.client = client;

		/**
		 * The id of the OAuth User
		 * @since 0.0.1
		 * @type {string}
		 */
		this.id = user.id;

		/**
		 * The username of the OAuth User
		 * @since 0.0.1
		 * @type {string}
		 */
		this.username = user.username;

		/**
		 * The discriminator of the OAuth User
		 * @since 0.0.1
		 * @type {number}
		 */
		this.discriminator = parseInt(user.discriminator);

		/**
		 * The language of the OAuth User
		 * @since 0.0.1
		 * @type {string}
		 */
		this.locale = user.locale;

		/**
		 * If the OAuth User has multi-factor Authentication enabled
		 * @since 0.0.1
		 * @type {boolean}
		 */
		this.mfaEnabled = user.mfa_enabled;

		/**
		 * The OAuth User's avatar hash
		 * @since 0.0.1
		 * @type {string}
		 */
		this.avatar = user.avatar;

		/**
		 * The collection of OAuth Guilds this OAuth User is in
		 * @since 0.0.1
		 * @type {external:Collection<external:snowflake, DashboardGuild>}
		 */
		this.guilds = new Collection();

		this.constructor.setupGuilds(this, user.guilds);
	}

	/**
	 * The Avatar URL for this OAuth User
	 * @since 0.0.1
	 * @type {string}
	 * @readonly
	 */
	get avatarURL() {
		const { user } = this;
		if (user) return user.displayAvatarURL({ format: 'png' });
		if (this.avatar) return `https://cdn.discordapp.com/avatars/${this.id}/${this.avatar}.png`;
		return `https://cdn.discordapp.com/embed/avatars/${this.discriminator % 5}.png`;
	}

	/**
	 * The User for this OAuth User
	 * @since 0.0.1
	 * @type {external:KlasaUser}
	 * @readonly
	 */
	get user() {
		return this.client.users.get(this.id) || null;
	}

	/**
	 * The toJSON behavior of this Object
	 * @since 0.0.1
	 * @returns {DashboardUserJSON}
	 */
	toJSON() {
		const user = (usr => usr ? usr.toJSON() : {})(this.user);
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

	/**
	 * Setups all DashboardGuilds for the passed in Dashboard User
	 * @since 0.0.1
	 * @param {DashboardUser} dashboardUser The dashboard user guilds are being setup for
	 * @param {Object[]} guilds The raw guild data to setup
	 * @returns {void}
	 * @private
	 */
	static setupGuilds(dashboardUser, guilds) {
		for (const guild of guilds) dashboardUser.guilds.set(guild.id, new DashboardGuild(dashboardUser.client, guild, dashboardUser));
	}


}

module.exports = DashboardUser;
