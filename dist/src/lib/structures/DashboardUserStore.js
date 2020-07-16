"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DashboardUserStore = void 0;
const core_1 = require("@klasa/core");
const node_fetch_1 = require("node-fetch");
class DashboardUserStore extends core_1.DataStore {
    async fetch(token) {
        token = `Bearer ${token}`;
        const user = await node_fetch_1.default('https://discordapp.com/api/users/@me', { headers: { Authorization: token } })
            .then(result => result.json());
        await this.client.users.fetch(user.id);
        user.guilds = await node_fetch_1.default('https://discordapp.com/api/users/@me/guilds', { headers: { Authorization: token } })
            .then(result => result.json());
        // eslint-disable-next-line dot-notation
        return this['_add'](user);
    }
}
exports.DashboardUserStore = DashboardUserStore;
//# sourceMappingURL=DashboardUserStore.js.map