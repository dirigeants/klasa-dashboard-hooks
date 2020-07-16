"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DashboardGuild = void 0;
const core_1 = require("@klasa/core");
/**
 * Represents an OAuthGuild.
 * @since 0.0.1
 */
class DashboardGuild {
    /**
     * @since 0.0.1
     * @param client The Dashboard Client
     * @param guild The raw guild data
     * @param user The OAuth User this Guild is for
     */
    constructor(client, guild, user) {
        this.client = client;
        this.user = user;
        this.id = guild.id;
        this.name = guild.name;
        this.icon = guild.icon;
        this.userIsOwner = guild.owner;
        this.userGuildPermissions = new core_1.Permissions(guild.permissions);
        this.userCanManage = this.userGuildPermissions.has("MANAGE_GUILD" /* ManageGuild */);
    }
    /**
     * The url for the guild's icon
     * @since 0.0.1
     */
    get iconURL() {
        const { guild } = this;
        if (guild)
            return guild.iconURL({ extension: 'png' });
        if (this.icon)
            return `https://cdn.discordapp.com/icons/${this.id}/${this.icon}.png`;
        return null;
    }
    /**
     * The guild for this DashboardGuild
     * @since 0.0.1
     */
    get guild() {
        var _a;
        return (_a = this.client.guilds.get(this.id)) !== null && _a !== void 0 ? _a : null;
    }
    /**
     * The toJSON behavior of this structure
     * @since 0.0.1
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
exports.DashboardGuild = DashboardGuild;
//# sourceMappingURL=DashboardGuild.js.map