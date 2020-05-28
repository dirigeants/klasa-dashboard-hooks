import { Store, Client, PieceConstructor } from '@klasa/core';
import { Route } from './Route';

import { METHODS } from 'http';

import { METHODS_LOWER } from '../util/constants';

/**
 * Stores all the routes that are part of klasa-dashboard-hooks.
 * @since 0.0.1
 */
export class RouteStore extends Store<Route> {

	/**
	 * A lookup registry of Maps keyed on http method.
	 * @since 0.0.1
	 */
	public registry: Record<string, Map<string, Route>> = {};

	/**
	 * @since 0.0.1
	 * @param client The Klasa client
	 */
	public constructor(client: Client) {
		super(client, 'routes', Route as PieceConstructor<Route>);
		for (const method of METHODS) this.registry[method] = new Map();
	}

	/**
	 * Finds a route using the registry.
	 * @since 0.0.1
	 * @param method The http method
	 * @param splitURL the url to find
	 */
	public findRoute(method: string, splitURL: string[]): Route | undefined {
		for (const route of this.registry[method].values()) if (route.matches(splitURL)) return route;
		return undefined;
	}

	/**
	 * Clears the RouteStore.
	 * @since 0.0.1
	 */
	public clear(): void {
		for (const method of METHODS) this.registry[method].clear();
		return super.clear();
	}

	/**
	 * Adds a Route to this RouteStore.
	 * @since 0.0.1
	 * @param piece The route to add to this store
	 */
	public add(piece: Route): Route | null {
		const route = super.add(piece);
		if (!route) return route;
		for (const method of METHODS) if (METHODS_LOWER[method] in route) this.registry[method].set(route.name, route);
		return route;
	}

	/**
	 * Deletes a Route from this RouteStore.
	 * @since 0.0.1
	 * @param name The name of the Route or the Route
	 */
	public remove(name: Route | string): boolean {
		const route = this.resolve(name);
		if (!route) return false;
		for (const method of METHODS) this.registry[method].delete(route.name);
		return super.remove(route);
	}

}
