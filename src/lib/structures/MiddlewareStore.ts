import { Store, Client, PieceConstructor } from '@klasa/core';
import { Middleware } from './Middleware';

import type { Route } from './Route';
import type { KlasaIncomingMessage } from '../http/KlasaIncomingMessage';
import type { KlasaServerResponse } from '../http/KlasaServerResponse';

/**
 * Stores all the middlewares that are part of klasa-dashboard-hooks.
 * @since 0.0.1
 */
export class MiddlewareStore extends Store<Middleware> {


	/**
	 * The middlewares sorted by priority.
	 * @since 0.0.1
	 */
	public sortedMiddlewares: Middleware[];

	/**
	 * @since 0.0.1
	 * @param client The Klasa client
	 */
	public constructor(client: Client) {
		super(client, 'middlewares', Middleware as PieceConstructor<Middleware>);

		this.sortedMiddlewares = [];
	}

	/**
	 * Clears the RouteStore.
	 * @since 0.0.1
	 */
	public clear(): void {
		this.sortedMiddlewares = [];
		return super.clear();
	}

	/**
	 * Adds a Middleware to this MiddlewareStore.
	 * @since 0.0.1
	 * @param piece The Middleware to add to this store
	 */
	public add(piece: Middleware): Middleware | null {
		const middleware = super.add(piece);
		if (!middleware) return middleware;

		const index = this.sortedMiddlewares.findIndex(mid => mid.priority >= middleware.priority);
		// If a middleware with lower priority wasn't found, push to the end of the array
		if (index === -1) this.sortedMiddlewares.push(middleware);
		else this.sortedMiddlewares.splice(index, 0, middleware);
		return middleware;
	}

	/**
	 * Deletes a Middleware from this MiddlewareStore.
	 * @since 0.0.1
	 * @param name The name of the Middleware or the Middleware
	 */
	public remove(name: Middleware | string): boolean {
		const middleware = this.resolve(name);
		if (!middleware) return false;
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
	public async run(request: KlasaIncomingMessage, response: KlasaServerResponse, route: Route): Promise<void> {
		for (const middleware of this.sortedMiddlewares) {
			if (response.finished) return;
			if (middleware.enabled) await middleware.run(request, response, route);
		}
	}

}
