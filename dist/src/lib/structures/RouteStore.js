"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RouteStore = void 0;
const core_1 = require("@klasa/core");
const Route_1 = require("./Route");
const http_1 = require("http");
const constants_1 = require("../util/constants");
/**
 * Stores all the routes that are part of klasa-dashboard-hooks.
 * @since 0.0.1
 */
class RouteStore extends core_1.Store {
    /**
     * @since 0.0.1
     * @param client The Klasa client
     */
    constructor(client) {
        super(client, 'routes', Route_1.Route);
        /**
         * A lookup registry of Maps keyed on http method.
         * @since 0.0.1
         */
        this.registry = {};
        for (const method of http_1.METHODS)
            this.registry[method] = new Map();
    }
    /**
     * Finds a route using the registry.
     * @since 0.0.1
     * @param method The http method
     * @param splitURL the url to find
     */
    findRoute(method, splitURL) {
        for (const route of this.registry[method].values())
            if (route.matches(splitURL))
                return route;
        return undefined;
    }
    /**
     * Clears the RouteStore.
     * @since 0.0.1
     */
    clear() {
        for (const method of http_1.METHODS)
            this.registry[method].clear();
        return super.clear();
    }
    /**
     * Adds a Route to this RouteStore.
     * @since 0.0.1
     * @param piece The route to add to this store
     */
    add(piece) {
        const route = super.add(piece);
        if (!route)
            return route;
        for (const method of http_1.METHODS)
            if (constants_1.METHODS_LOWER[method] in route)
                this.registry[method].set(route.name, route);
        return route;
    }
    /**
     * Deletes a Route from this RouteStore.
     * @since 0.0.1
     * @param name The name of the Route or the Route
     */
    remove(name) {
        const route = this.resolve(name);
        if (!route)
            return false;
        for (const method of http_1.METHODS)
            this.registry[method].delete(route.name);
        return super.remove(route);
    }
}
exports.RouteStore = RouteStore;
//# sourceMappingURL=RouteStore.js.map