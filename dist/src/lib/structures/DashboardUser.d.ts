import { Cache } from '@klasa/cache';
import { DashboardGuild, OAuthGuildData } from './DashboardGuild';
import { Client, User } from '@klasa/core';
import type { APIUserData } from '@klasa/dapi-types';
export interface DashboardUserData extends APIUserData {
    guilds: OAuthGuildData[];
}
/**
 * Represents an OAuth User.
 *@since 0.0.1
 */
export declare class DashboardUser extends User {
    /**
     * The cache of OAuth Guilds this OAuth User is in.
     * @since 0.0.1
     */
    guilds: Cache<string, DashboardGuild>;
    /**
     * @since 0.0.1
     * @param client The client
     * @param data The raw user data
     */
    constructor(client: Client, data: DashboardUserData);
    /**
     * The toJSON behavior of this Object.
     * @since 0.0.1
     */
    toJSON(): Record<string, unknown>;
    /**
     * Setups all DashboardGuilds for the passed in Dashboard User
     * @since 0.0.1
     * @param dashboardUser The dashboard user guilds are being setup for
     * @param guilds The raw guild data to setup
     */
    private static setupGuilds;
}
