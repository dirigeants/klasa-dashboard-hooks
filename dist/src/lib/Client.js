"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DashboardHooks = void 0;
const core_1 = require("@klasa/core");
const utils_1 = require("@klasa/utils");
const path_1 = require("path");
const Server_1 = require("./http/Server");
const RouteStore_1 = require("./structures/RouteStore");
const MiddlewareStore_1 = require("./structures/MiddlewareStore");
const DashboardUser_1 = require("./structures/DashboardUser");
const constants_1 = require("./util/constants");
const DashboardUserStore_1 = require("./structures/DashboardUserStore");
/**
 * The client for handling everything. See {@tutorial GettingStarted} for more information how to get started using this class.
 * @tutorial GettingStarted
 */
class DashboardHooks {
    static [core_1.Client.plugin]() {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-expect-error
        utils_1.mergeDefault(constants_1.OPTIONS, this.options);
        /**
         * The http server handler for the api
         * @since 0.0.1
         */
        this.server = new Server_1.Server(this);
        /**
         * The cache where routes are stored
         * @since 0.0.1
         */
        this.routes = new RouteStore_1.RouteStore(this);
        /**
         * The cache where middlewares are stored
         * @since 0.0.1
         */
        this.middlewares = new MiddlewareStore_1.MiddlewareStore(this);
        /**
         * The cache where oauth data is temporarily stored
         * @since 0.0.1
         */
        this.dashboardUsers = new DashboardUserStore_1.DashboardUserStore(this, DashboardUser_1.DashboardUser, this.options.cache.limits.dashboardUsers);
        this
            .registerStore(this.routes)
            .registerStore(this.middlewares);
        const coreDirectory = path_1.join(__dirname, '../');
        this.routes.registerCoreDirectory(coreDirectory);
        this.middlewares.registerCoreDirectory(coreDirectory);
        this.server.listen(this.options.dashboardHooks.port);
    }
}
exports.DashboardHooks = DashboardHooks;
//# sourceMappingURL=Client.js.map