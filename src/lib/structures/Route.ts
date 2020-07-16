import { Piece, PieceOptions } from '@klasa/core';

import { parse, ParsedPart } from '../util/Util';
import type { RouteStore } from './RouteStore';
import type { KlasaIncomingMessage } from '../http/KlasaIncomingMessage';
import type { KlasaServerResponse } from '../http/KlasaServerResponse';

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
	acl?(request: KlasaIncomingMessage, response: KlasaServerResponse): unknown;
	bind?(request: KlasaIncomingMessage, response: KlasaServerResponse): unknown;
	checkout?(request: KlasaIncomingMessage, response: KlasaServerResponse): unknown;
	connect?(request: KlasaIncomingMessage, response: KlasaServerResponse): unknown;
	copy?(request: KlasaIncomingMessage, response: KlasaServerResponse): unknown;
	delete?(request: KlasaIncomingMessage, response: KlasaServerResponse): unknown;
	get?(request: KlasaIncomingMessage, response: KlasaServerResponse): unknown;
	head?(request: KlasaIncomingMessage, response: KlasaServerResponse): unknown;
	link?(request: KlasaIncomingMessage, response: KlasaServerResponse): unknown;
	lock?(request: KlasaIncomingMessage, response: KlasaServerResponse): unknown;
	'm-search'?(request: KlasaIncomingMessage, response: KlasaServerResponse): unknown;
	merge?(request: KlasaIncomingMessage, response: KlasaServerResponse): unknown;
	mkactivity?(request: KlasaIncomingMessage, response: KlasaServerResponse): unknown;
	mkcalendar?(request: KlasaIncomingMessage, response: KlasaServerResponse): unknown;
	mkcol?(request: KlasaIncomingMessage, response: KlasaServerResponse): unknown;
	move?(request: KlasaIncomingMessage, response: KlasaServerResponse): unknown;
	notify?(request: KlasaIncomingMessage, response: KlasaServerResponse): unknown;
	options?(request: KlasaIncomingMessage, response: KlasaServerResponse): unknown;
	patch?(request: KlasaIncomingMessage, response: KlasaServerResponse): unknown;
	post?(request: KlasaIncomingMessage, response: KlasaServerResponse): unknown;
	propfind?(request: KlasaIncomingMessage, response: KlasaServerResponse): unknown;
	proppatch?(request: KlasaIncomingMessage, response: KlasaServerResponse): unknown;
	purge?(request: KlasaIncomingMessage, response: KlasaServerResponse): unknown;
	put?(request: KlasaIncomingMessage, response: KlasaServerResponse): unknown;
	rebind?(request: KlasaIncomingMessage, response: KlasaServerResponse): unknown;
	report?(request: KlasaIncomingMessage, response: KlasaServerResponse): unknown;
	search?(request: KlasaIncomingMessage, response: KlasaServerResponse): unknown;
	source?(request: KlasaIncomingMessage, response: KlasaServerResponse): unknown;
	subscribe?(request: KlasaIncomingMessage, response: KlasaServerResponse): unknown;
	trace?(request: KlasaIncomingMessage, response: KlasaServerResponse): unknown;
	unbind?(request: KlasaIncomingMessage, response: KlasaServerResponse): unknown;
	unlink?(request: KlasaIncomingMessage, response: KlasaServerResponse): unknown;
	unlock?(request: KlasaIncomingMessage, response: KlasaServerResponse): unknown;
	unsubscribe?(request: KlasaIncomingMessage, response: KlasaServerResponse): unknown;
}
