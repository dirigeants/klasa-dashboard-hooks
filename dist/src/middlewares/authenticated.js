"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const dashboard_hooks_1 = require("@klasa/dashboard-hooks");
class default_1 extends dashboard_hooks_1.Middleware {
    constructor(store, dir, file) {
        super(store, dir, file, { priority: 100 });
    }
    async run(request, response, route) {
        if (!route || !route.authenticated)
            return;
        try {
            request.auth = dashboard_hooks_1.decrypt(request.headers.authorization, this.client.options.dashboardHooks.clientSecret);
            if (request.method === 'POST' && !request.auth.scope.includes(request.body.id))
                throw true;
        }
        catch (err) {
            this.unauthorized(response);
        }
    }
    unauthorized(response) {
        return response.status(401).end(dashboard_hooks_1.RESPONSES.UNAUTHORIZED);
    }
}
exports.default = default_1;
//# sourceMappingURL=authenticated.js.map