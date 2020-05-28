import { Cache } from '@klasa/cache';
import { DashboardGuild, OAuthGuildData } from './DashboardGuild';
import { Client, User } from '@klasa/core';
import { APIUserData } from '@klasa/dapi-types';

export interface DashboardUserData extends APIUserData {
	guilds: OAuthGuildData[];
}

/**
 * Represents an OAuth User.
 *@since 0.0.1
 */
export class DashboardUser extends User {

	/**
	 * The cache of OAuth Guilds this OAuth User is in.
	 * @since 0.0.1
	 */
	public guilds = new Cache<string, DashboardGuild>();

	/**
	 * @since 0.0.1
	 * @param client The client
	 * @param data The raw user data
	 */
	public constructor(client: Client, data: DashboardUserData) {
		super(client, data);
		(this.constructor as typeof DashboardUser).setupGuilds(this, data.guilds);
	}

	/**
	 * The toJSON behavior of this Object.
	 * @since 0.0.1
	 */
	public toJSON(): Record<string, unknown> {
		return {
			...super.toJSON(),
			guilds: [...this.guilds.values()]
		};
	}

	/**
	 * Setups all DashboardGuilds for the passed in Dashboard User
	 * @since 0.0.1
	 * @param dashboardUser The dashboard user guilds are being setup for
	 * @param guilds The raw guild data to setup
	 */
	private static setupGuilds(dashboardUser: DashboardUser, guilds: readonly OAuthGuildData[]) {
		for (const guild of guilds) dashboardUser.guilds.set(guild.id, new DashboardGuild(dashboardUser.client, guild, dashboardUser));
	}

}
