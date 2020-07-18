"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const dashboard_hooks_1 = require("@klasa/dashboard-hooks");
const util_1 = require("util");
class default_1 extends dashboard_hooks_1.Route {
    constructor(store, dir, file) {
        super(store, dir, file, {
            route: 'oauth/user/guilds',
            authenticated: true
        });
    }
    async post(request, response) {
        const botGuild = this.client.guilds.get(request.body.id);
        if (typeof botGuild === 'undefined')
            return response.end(dashboard_hooks_1.RESPONSES.UPDATED[0]);
        try {
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-expect-error
            await botGuild.settings.sync();
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-expect-error
            await botGuild.settings.update(request.body.data, { action: 'overwrite' });
            return response.end(dashboard_hooks_1.RESPONSES.UPDATED[1]);
        }
        catch (error) {
            this.client.emit('error', `${botGuild.name}[${botGuild.id}] failed updating guild configs via dashboard with error:\n${util_1.inspect(error)}`);
            return response.end(dashboard_hooks_1.RESPONSES.UPDATED[0]);
        }
    }
}
exports.default = default_1;
//# sourceMappingURL=oauthGuilds.js.map