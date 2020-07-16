import { Store, Client } from '@klasa/core';
import { Middleware } from './Middleware';
import type { Route } from './Route';
import type { KlasaIncomingMessage } from '../http/KlasaIncomingMessage';
import type { KlasaServerResponse } from '../http/KlasaServerResponse';
/**
 * Stores all the middlewares that are part of klasa-dashboard-hooks.
 * @since 0.0.1
 */
export declare class MiddlewareStore extends Store<Middleware> {
    /**
     * The middlewares sorted by priority.
     * @since 0.0.1
     */
    sortedMiddlewares: Middleware[];
    /**
     * @since 0.0.1
     * @param client The Klasa client
     */
    constructor(client: Client);
    /**
     * Clears the RouteStore.
     * @since 0.0.1
     */
    clear(): void;
    /**
     * Adds a Middleware to this MiddlewareStore.
     * @since 0.0.1
     * @param piece The Middleware to add to this store
     */
    add(piece: Middleware): Middleware | null;
    /**
     * Deletes a Middleware from this MiddlewareStore.
     * @since 0.0.1
     * @param name The name of the Middleware or the Middleware
     */
    remove(name: Middleware | string): boolean;
    /**
     * Runs all the middleware.
     * @since 0.0.1
     * @param request The http request
     * @param response The http response
     * @param route The route being run
     */
    run(request: KlasaIncomingMessage, response: KlasaServerResponse, route: Route): Promise<void>;
}
