"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const dashboard_hooks_1 = require("@klasa/dashboard-hooks");
const util_1 = require("util");
class default_1 extends dashboard_hooks_1.Route {
    constructor(store, dir, file) {
        super(store, dir, file, {
            route: 'oauth/user',
            authenticated: true
        });
    }
    async get(request, response) {
        let dashboardUser = this.client.dashboardUsers.get(request.auth.scope[0]);
        if (!dashboardUser) {
            dashboardUser = await this.client.dashboardUsers.fetch(request.auth.token);
            response.setHeader('Authorization', dashboard_hooks_1.encrypt({
                token: request.auth.token,
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                scope: [dashboardUser.id, ...dashboardUser.guilds.filter(guild => guild.userCanManage).map(guild => guild.id)]
            }, this.client.options.dashboardHooks.clientSecret));
        }
        return response.json(dashboardUser);
    }
    async post(request, response) {
        const botUser = await this.client.users.fetch(request.body.id);
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-expect-error
        await botUser.settings.sync();
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-expect-error
        const updated = await botUser.settings.update(request.body.data, { action: 'overwrite' });
        const errored = Boolean(updated.errors.length);
        if (errored)
            this.client.emit('error', `${botUser.username}[${botUser.id}] failed updating user configs via dashboard with error:\n${util_1.inspect(updated.errors)}`);
        return response.end(dashboard_hooks_1.RESPONSES.UPDATED[Number(!errored)]);
    }
}
exports.default = default_1;
//# sourceMappingURL=oauthUser.js.map