"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MiddlewareStore = void 0;
const core_1 = require("@klasa/core");
const Middleware_1 = require("./Middleware");
/**
 * Stores all the middlewares that are part of klasa-dashboard-hooks.
 * @since 0.0.1
 */
class MiddlewareStore extends core_1.Store {
    /**
     * @since 0.0.1
     * @param client The Klasa client
     */
    constructor(client) {
        super(client, 'middlewares', Middleware_1.Middleware);
        this.sortedMiddlewares = [];
    }
    /**
     * Clears the RouteStore.
     * @since 0.0.1
     */
    clear() {
        this.sortedMiddlewares = [];
        return super.clear();
    }
    /**
     * Adds a Middleware to this MiddlewareStore.
     * @since 0.0.1
     * @param piece The Middleware to add to this store
     */
    add(piece) {
        const middleware = super.add(piece);
        if (!middleware)
            return middleware;
        const index = this.sortedMiddlewares.findIndex(mid => mid.priority >= middleware.priority);
        // If a middleware with lower priority wasn't found, push to the end of the array
        if (index === -1)
            this.sortedMiddlewares.push(middleware);
        else
            this.sortedMiddlewares.splice(index, 0, middleware);
        return middleware;
    }
    /**
     * Deletes a Middleware from this MiddlewareStore.
     * @since 0.0.1
     * @param name The name of the Middleware or the Middleware
     */
    remove(name) {
        const middleware = this.resolve(name);
        if (!middleware)
            return false;
        this.sortedMiddlewares.splice(this.sortedMiddlewares.indexOf(middleware), 1);
        return super.remove(middleware);
    }
    /**
     * Runs all the middleware.
     * @since 0.0.1
     * @param request The http request
     * @param response The http response
     * @param route The route being run
     */
    async run(request, response, route) {
        for (const middleware of this.sortedMiddlewares) {
            if (response.finished)
                return;
            if (middleware.enabled)
                await middleware.run(request, response, route);
        }
    }
}
exports.MiddlewareStore = MiddlewareStore;
//# sourceMappingURL=MiddlewareStore.js.map