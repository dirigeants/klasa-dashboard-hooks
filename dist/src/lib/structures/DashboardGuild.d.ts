import { Permissions, Client, Guild } from '@klasa/core';
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
export declare class DashboardGuild {
    /**
     * The DashboardClient.
     * @since 0.0.1
     */
    readonly client: Client;
    /**
     * The OAuth User this DashboardGuild is for.
     * @since 0.0.1
     */
    user: DashboardUser;
    /**
     * The guild id.
     * @since 0.0.1
     */
    id: string;
    /**
     * The guild name.
     * @since 0.0.1
     */
    name: string;
    /**
     * The guild icon hash.
     * @since 0.0.1
     */
    icon: string | null;
    /**
     * If the logged in OAuthUser is the owner of the guild.
     * @since 0.0.1
     */
    userIsOwner: boolean;
    /**
     * The guild permissions for the logged in OAuthUser.
     * @since 0.0.1
     */
    userGuildPermissions: Permissions;
    /**
     * If the logged in OAuthUser can manage the guild (invite bots).
     * @since 0.0.1
     */
    userCanManage: boolean;
    /**
     * @since 0.0.1
     * @param client The Dashboard Client
     * @param guild The raw guild data
     * @param user The OAuth User this Guild is for
     */
    constructor(client: Client, guild: OAuthGuildData, user: DashboardUser);
    /**
     * The url for the guild's icon
     * @since 0.0.1
     */
    get iconURL(): string | null;
    /**
     * The guild for this DashboardGuild
     * @since 0.0.1
     */
    get guild(): Guild | null;
    /**
     * The toJSON behavior of this structure
     * @since 0.0.1
     */
    toJSON(): Record<string, any>;
}
