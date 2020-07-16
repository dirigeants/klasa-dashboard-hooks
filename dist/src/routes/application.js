"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const dashboard_hooks_1 = require("@klasa/dashboard-hooks");
const duration_1 = require("@klasa/duration");
class default_1 extends dashboard_hooks_1.Route {
    constructor(store, dir, file) {
        super(store, dir, file, { route: 'application' });
    }
    get(_request, response) {
        return response.json({
            users: this.client.users.size,
            guilds: this.client.guilds.size,
            channels: this.client.channels.size,
            shards: this.client.ws.shards.size,
            uptime: duration_1.Duration.toNow(Date.now() - (process.uptime() * 1000)),
            latency: this.client.ws.ping.toFixed(0),
            memory: process.memoryUsage().heapUsed / 1024 / 1024,
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-expect-error
            invite: this.client.invite,
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-expect-error
            ...this.client.application
        });
    }
}
exports.default = default_1;
//# sourceMappingURL=application.js.map