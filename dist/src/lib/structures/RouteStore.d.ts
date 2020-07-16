import { Store, Client } from '@klasa/core';
import { Route } from './Route';
/**
 * Stores all the routes that are part of klasa-dashboard-hooks.
 * @since 0.0.1
 */
export declare class RouteStore extends Store<Route> {
    /**
     * A lookup registry of Maps keyed on http method.
     * @since 0.0.1
     */
    registry: Record<string, Map<string, Route>>;
    /**
     * @since 0.0.1
     * @param client The Klasa client
     */
    constructor(client: Client);
    /**
     * Finds a route using the registry.
     * @since 0.0.1
     * @param method The http method
     * @param splitURL the url to find
     */
    findRoute(method: string, splitURL: string[]): Route | undefined;
    /**
     * Clears the RouteStore.
     * @since 0.0.1
     */
    clear(): void;
    /**
     * Adds a Route to this RouteStore.
     * @since 0.0.1
     * @param piece The route to add to this store
     */
    add(piece: Route): Route | null;
    /**
     * Deletes a Route from this RouteStore.
     * @since 0.0.1
     * @param name The name of the Route or the Route
     */
    remove(name: Route | string): boolean;
}
