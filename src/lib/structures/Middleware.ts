import { Piece, PieceOptions } from '@klasa/core';

import type { Route } from './Route';
import type { MiddlewareStore } from './MiddlewareStore';
import type { KlasaIncomingMessage } from '../http/KlasaIncomingMessage';
import type { KlasaServerResponse } from '../http/KlasaServerResponse';

export interface MiddlewareOptions extends PieceOptions {
	/**
	 * The priority in which the middleware should run
	 * @since 0.0.1
	 */
	priority?: number;
}

/**
 * Base class for all Klasa Middleware. See {@tutorial CreatingMiddlewares} for more information how to use the class
 * to build custom events.
 * @since 0.0.1
 * @tutorial CreatingMiddlewares
 */
export abstract class Middleware extends Piece {

	/**
	 * The priority in which the middleware should run
	 * @since 0.0.1
	 */
	priority: number;

	/**
	 * @since 0.0.1
	 * @param store The Middleware Store
	 * @param file The path from the pieces folder to the middleware file
	 * @param core If the piece is in the core directory or not
	 * @param options Optional Middleware settings
	 */
	public constructor(store: MiddlewareStore, directory: string, file: readonly string[], options: MiddlewareOptions = {}) {
		super(store, directory, file, options);
		this.priority = options.priority as number;
	}

	/**
	 * The run method to be overwritten in actual event handlers
	 * @since 0.0.1
	 * @param request The http request
	 * @param response The http response
	 * @param route The route being run
	 */
	public abstract run(request: KlasaIncomingMessage, response: KlasaServerResponse, route: Route): void | Promise<void>;

}
