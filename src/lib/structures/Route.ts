import { Piece, PieceOptions } from '@klasa/core';

import { parse, ParsedPart } from '../util/Util';
import { RouteStore } from './RouteStore';
import { KlasaIncomingMessage } from '../http/KlasaIncomingMessage';
import { KlasaHttp2ServerRequest } from '../http/KlasaHttp2ServerRequest';
import { KlasaServerResponse } from '../http/KlasaServerResponse';
import { KlasaHttp2ServerResponse } from '../http/KlasaHttp2ServerResponse';

export interface RouteOptions extends PieceOptions {
	route?: string;
	authenticated?: boolean;
}

export type ParsedRoute = ParsedPart[];

/**
 * Base class for all Klasa Routes. See {@tutorial CreatingRoutes} for more information how to use this class
 * to build custom events.
 * @since 0.0.1
 * @tutorial CreatingRoutes
 */
export class Route extends Piece {

	/**
	 * Stored bound run method, so it can be properly disabled and reloaded later.
	 * @since 0.0.1
	 */
	public route: string;

	/**
	 * If the route is authenticated.
	 * @since 0.0.1
	 */
	public authenticated: boolean;

	/**
	 * Stored parsed route.
	 * @since 0.0.1
	 */
	public parsed: ParsedRoute;

	/**
	 * @since 0.0.1
	 * @param store The Route Store
	 * @param file The path from the pieces folder to the route file
	 * @param core If the piece is in the core directory or not
	 * @param options Optional Route settings
	 */
	public constructor(store: RouteStore, dir: string, file: string[], options: RouteOptions = {}) {
		super(store, dir, file, options);

		this.route = this.client.options.dashboardHooks.apiPrefix + options.route;
		this.authenticated = options.authenticated as boolean;
		this.parsed = parse(this.route);
	}

	/**
	 * If this route matches a provided url.
	 * @since 0.0.1
	 * @param split the url to check
	 */
	public matches(split: string[]): boolean {
		if (split.length !== this.parsed.length) return false;
		for (let i = 0; i < this.parsed.length; i++) if (this.parsed[i].type === 0 && this.parsed[i].value !== split[i]) return false;
		return true;
	}

	/**
	 * Extracts the params from a provided url.
	 * @since 0.0.1
	 * @param split the url
	 */
	public execute(split: string[]): Record<string, string> {
		const params: Record<string, string> = {};
		for (let i = 0; i < this.parsed.length; i++) if (this.parsed[i].type === 1) params[this.parsed[i].value] = split[i];
		return params;
	}

}

export interface Route {
	acl?: (request: KlasaIncomingMessage | KlasaHttp2ServerRequest, response: KlasaServerResponse | KlasaHttp2ServerResponse) => unknown;
	bind?: (request: KlasaIncomingMessage | KlasaHttp2ServerRequest, response: KlasaServerResponse | KlasaHttp2ServerResponse) => unknown;
	checkout?: (request: KlasaIncomingMessage | KlasaHttp2ServerRequest, response: KlasaServerResponse | KlasaHttp2ServerResponse) => unknown;
	connect?: (request: KlasaIncomingMessage | KlasaHttp2ServerRequest, response: KlasaServerResponse | KlasaHttp2ServerResponse) => unknown;
	copy?: (request: KlasaIncomingMessage | KlasaHttp2ServerRequest, response: KlasaServerResponse | KlasaHttp2ServerResponse) => unknown;
	delete?: (request: KlasaIncomingMessage | KlasaHttp2ServerRequest, response: KlasaServerResponse | KlasaHttp2ServerResponse) => unknown;
	get?: (request: KlasaIncomingMessage | KlasaHttp2ServerRequest, response: KlasaServerResponse | KlasaHttp2ServerResponse) => unknown;
	head?: (request: KlasaIncomingMessage | KlasaHttp2ServerRequest, response: KlasaServerResponse | KlasaHttp2ServerResponse) => unknown;
	link?: (request: KlasaIncomingMessage | KlasaHttp2ServerRequest, response: KlasaServerResponse | KlasaHttp2ServerResponse) => unknown;
	lock?: (request: KlasaIncomingMessage | KlasaHttp2ServerRequest, response: KlasaServerResponse | KlasaHttp2ServerResponse) => unknown;
	'm-search'?: (request: KlasaIncomingMessage | KlasaHttp2ServerRequest, response: KlasaServerResponse | KlasaHttp2ServerResponse) => unknown;
	merge?: (request: KlasaIncomingMessage | KlasaHttp2ServerRequest, response: KlasaServerResponse | KlasaHttp2ServerResponse) => unknown;
	mkactivity?: (request: KlasaIncomingMessage | KlasaHttp2ServerRequest, response: KlasaServerResponse | KlasaHttp2ServerResponse) => unknown;
	mkcalendar?: (request: KlasaIncomingMessage | KlasaHttp2ServerRequest, response: KlasaServerResponse | KlasaHttp2ServerResponse) => unknown;
	mkcol?: (request: KlasaIncomingMessage | KlasaHttp2ServerRequest, response: KlasaServerResponse | KlasaHttp2ServerResponse) => unknown;
	move?: (request: KlasaIncomingMessage | KlasaHttp2ServerRequest, response: KlasaServerResponse | KlasaHttp2ServerResponse) => unknown;
	notify?: (request: KlasaIncomingMessage | KlasaHttp2ServerRequest, response: KlasaServerResponse | KlasaHttp2ServerResponse) => unknown;
	options?: (request: KlasaIncomingMessage | KlasaHttp2ServerRequest, response: KlasaServerResponse | KlasaHttp2ServerResponse) => unknown;
	patch?: (request: KlasaIncomingMessage | KlasaHttp2ServerRequest, response: KlasaServerResponse | KlasaHttp2ServerResponse) => unknown;
	post?: (request: KlasaIncomingMessage | KlasaHttp2ServerRequest, response: KlasaServerResponse | KlasaHttp2ServerResponse) => unknown;
	propfind?: (request: KlasaIncomingMessage | KlasaHttp2ServerRequest, response: KlasaServerResponse | KlasaHttp2ServerResponse) => unknown;
	proppatch?: (request: KlasaIncomingMessage | KlasaHttp2ServerRequest, response: KlasaServerResponse | KlasaHttp2ServerResponse) => unknown;
	purge?: (request: KlasaIncomingMessage | KlasaHttp2ServerRequest, response: KlasaServerResponse | KlasaHttp2ServerResponse) => unknown;
	put?: (request: KlasaIncomingMessage | KlasaHttp2ServerRequest, response: KlasaServerResponse | KlasaHttp2ServerResponse) => unknown;
	rebind?: (request: KlasaIncomingMessage | KlasaHttp2ServerRequest, response: KlasaServerResponse | KlasaHttp2ServerResponse) => unknown;
	report?: (request: KlasaIncomingMessage | KlasaHttp2ServerRequest, response: KlasaServerResponse | KlasaHttp2ServerResponse) => unknown;
	search?: (request: KlasaIncomingMessage | KlasaHttp2ServerRequest, response: KlasaServerResponse | KlasaHttp2ServerResponse) => unknown;
	source?: (request: KlasaIncomingMessage | KlasaHttp2ServerRequest, response: KlasaServerResponse | KlasaHttp2ServerResponse) => unknown;
	subscribe?: (request: KlasaIncomingMessage | KlasaHttp2ServerRequest, response: KlasaServerResponse | KlasaHttp2ServerResponse) => unknown;
	trace?: (request: KlasaIncomingMessage | KlasaHttp2ServerRequest, response: KlasaServerResponse | KlasaHttp2ServerResponse) => unknown;
	unbind?: (request: KlasaIncomingMessage | KlasaHttp2ServerRequest, response: KlasaServerResponse | KlasaHttp2ServerResponse) => unknown;
	unlink?: (request: KlasaIncomingMessage | KlasaHttp2ServerRequest, response: KlasaServerResponse | KlasaHttp2ServerResponse) => unknown;
	unlock?: (request: KlasaIncomingMessage | KlasaHttp2ServerRequest, response: KlasaServerResponse | KlasaHttp2ServerResponse) => unknown;
	unsubscribe?: (request: KlasaIncomingMessage | KlasaHttp2ServerRequest, response: KlasaServerResponse | KlasaHttp2ServerResponse) => unknown;
}
