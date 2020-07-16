"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Route = void 0;
const core_1 = require("@klasa/core");
const Util_1 = require("../util/Util");
/**
 * Base class for all Klasa Routes. See {@tutorial CreatingRoutes} for more information how to use this class
 * to build custom events.
 * @since 0.0.1
 * @tutorial CreatingRoutes
 */
class Route extends core_1.Piece {
    /**
     * @since 0.0.1
     * @param store The Route Store
     * @param file The path from the pieces folder to the route file
     * @param core If the piece is in the core directory or not
     * @param options Optional Route settings
     */
    constructor(store, dir, file, options = {}) {
        super(store, dir, file, options);
        this.route = this.client.options.dashboardHooks.apiPrefix + options.route;
        this.authenticated = options.authenticated;
        this.parsed = Util_1.parse(this.route);
    }
    /**
     * If this route matches a provided url.
     * @since 0.0.1
     * @param split the url to check
     */
    matches(split) {
        if (split.length !== this.parsed.length)
            return false;
        for (let i = 0; i < this.parsed.length; i++)
            if (this.parsed[i].type === 0 && this.parsed[i].value !== split[i])
                return false;
        return true;
    }
    /**
     * Extracts the params from a provided url.
     * @since 0.0.1
     * @param split the url
     */
    execute(split) {
        const params = {};
        for (let i = 0; i < this.parsed.length; i++)
            if (this.parsed[i].type === 1)
                params[this.parsed[i].value] = split[i];
        return params;
    }
}
exports.Route = Route;
//# sourceMappingURL=Route.js.map