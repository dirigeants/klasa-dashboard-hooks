import { Permissions, Client, Guild, PermissionsFlags } from '@klasa/core';

import type { DashboardUser } from './DashboardUser';

export interface OAuthGuildData {
	id: string;
	name: string;
	icon: string | null;
	owner: boolean;
	permissions: number;
	userCanManage: boolean;
}

/**
 * Represents an OAuthGuild.
 * @since 0.0.1
 */
export class DashboardGuild {

	/**
	 * The DashboardClient.
	 * @since 0.0.1
	 */
	public readonly client: Client;

	/**
	 * The OAuth User this DashboardGuild is for.
	 * @since 0.0.1
	 */
	public user: DashboardUser;

	/**
	 * The guild id.
	 * @since 0.0.1
	 */
	public id: string;

	/**
	 * The guild name.
	 * @since 0.0.1
	 */
	public name: string;

	/**
	 * The guild icon hash.
	 * @since 0.0.1
	 */
	public icon: string | null;

	/**
	 * If the logged in OAuthUser is the owner of the guild.
	 * @since 0.0.1
	 */
	public userIsOwner: boolean;

	/**
	 * The guild permissions for the logged in OAuthUser.
	 * @since 0.0.1
	 */
	public userGuildPermissions: Permissions;

	/**
	 * If the logged in OAuthUser can manage the guild (invite bots).
	 * @since 0.0.1
	 */
	public userCanManage: boolean;

	/**
	 * @since 0.0.1
	 * @param client The Dashboard Client
	 * @param guild The raw guild data
	 * @param user The OAuth User this Guild is for
	 */
	public constructor(client: Client, guild: OAuthGuildData, user: DashboardUser) {
		this.client = client;
		this.user = user;
		this.id = guild.id;
		this.name = guild.name;
		this.icon = guild.icon;
		this.userIsOwner = guild.owner;
		this.userGuildPermissions = new Permissions(guild.permissions);
		this.userCanManage = this.userGuildPermissions.has(PermissionsFlags.ManageGuild);
	}

	/**
	 * The url for the guild's icon
	 * @since 0.0.1
	 */
	public get iconURL(): string | null {
		const { guild } = this;
		if (guild) return guild.iconURL({ format: 'png' });
		if (this.icon) return `https://cdn.discordapp.com/icons/${this.id}/${this.icon}.png`;
		return null;
	}

	/**
	 * The guild for this DashboardGuild
	 * @since 0.0.1
	 */
	public get guild(): Guild | null {
		return this.client.guilds.get(this.id) || null;
	}

	/**
	 * The toJSON behavior of this structure
	 * @since 0.0.1
	 */
	public toJSON(): Record<string, any> {
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
