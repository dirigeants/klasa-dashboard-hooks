"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DashboardUser = void 0;
const cache_1 = require("@klasa/cache");
const DashboardGuild_1 = require("./DashboardGuild");
const core_1 = require("@klasa/core");
/**
 * Represents an OAuth User.
 *@since 0.0.1
 */
class DashboardUser extends core_1.User {
    /**
     * @since 0.0.1
     * @param client The client
     * @param data The raw user data
     */
    constructor(client, data) {
        super(client, data);
        /**
         * The cache of OAuth Guilds this OAuth User is in.
         * @since 0.0.1
         */
        this.guilds = new cache_1.Cache();
        this.constructor.setupGuilds(this, data.guilds);
    }
    /**
     * The toJSON behavior of this Object.
     * @since 0.0.1
     */
    toJSON() {
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
    static setupGuilds(dashboardUser, guilds) {
        for (const guild of guilds)
            dashboardUser.guilds.set(guild.id, new DashboardGuild_1.DashboardGuild(dashboardUser.client, guild, dashboardUser));
    }
}
exports.DashboardUser = DashboardUser;
//# sourceMappingURL=DashboardUser.js.map