"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const dashboard_hooks_1 = require("@klasa/dashboard-hooks");
class default_1 extends dashboard_hooks_1.Middleware {
    constructor(store, dir, file) {
        super(store, dir, file, { priority: 10 });
    }
    run(request, response) {
        response.setHeader('Access-Control-Allow-Origin', this.client.options.dashboardHooks.origin);
        response.setHeader('Access-Control-Allow-Methods', 'DELETE, GET, HEAD, OPTIONS, PATCH, POST, PUT');
        response.setHeader('Access-Control-Allow-Headers', 'Authorization, User-Agent, Content-Type');
        if (request.method === 'OPTIONS') {
            response.end('Something');
            return;
        }
        response.setHeader('Content-Type', 'application/json');
    }
}
exports.default = default_1;
//# sourceMappingURL=headers.js.map