"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const dashboard_hooks_1 = require("@klasa/dashboard-hooks");
const node_fetch_1 = require("node-fetch");
class default_1 extends dashboard_hooks_1.Route {
    constructor(store, dir, file) {
        super(store, dir, file, { route: 'oauth/callback' });
    }
    async post(request, response) {
        /* eslint-disable camelcase */
        if (!request.body.code)
            return this.noCode(response);
        const res = await node_fetch_1.default('https://discord.com/api/v6/oauth2/token', {
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            method: 'POST',
            body: dashboard_hooks_1.formEncode({
                client_id: this.client.options.dashboardHooks.clientID,
                client_secret: this.client.options.dashboardHooks.clientSecret,
                grant_type: 'authorization_code',
                code: request.body.code,
                redirect_uri: request.body.redirectUri,
                scope: 'identify guilds'
            })
        });
        if (!res.ok) {
            this.client.emit('debug', res.status, await res.text());
            return response.end(dashboard_hooks_1.RESPONSES.FETCHING_TOKEN);
        }
        const body = await res.json();
        const user = await this.client.dashboardUsers.fetch(body.access_token);
        return response.json({
            access_token: dashboard_hooks_1.encrypt({
                token: body.access_token,
                scope: [user.id, ...user.guilds.filter(guild => guild.userCanManage).map(guild => guild.id)]
            }, this.client.options.dashboardHooks.clientSecret),
            user
        });
        /* eslint-enable camelcase */
    }
    noCode(response) {
        return response.status(400).end(dashboard_hooks_1.RESPONSES.NO_CODE);
    }
}
exports.default = default_1;
//# sourceMappingURL=oauthCallback.js.map