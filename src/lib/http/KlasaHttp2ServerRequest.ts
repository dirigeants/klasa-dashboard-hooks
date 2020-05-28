import { IncomingHttpHeaders, ServerHttp2Stream, Http2ServerRequest } from 'http2';
import { parse } from 'url';
import { split } from '../util/Util';
import * as constants from '../util/constants';

import type { Client } from '@klasa/core';
import type { ReadableOptions } from 'stream';
import type { KlasaHttp2ServerResponse } from './KlasaHttp2ServerResponse';
import type { Route } from '../structures/Route';

/**
 * The custom class for KDH's incoming messages when using HTTP2
 */
export class KlasaHttp2ServerRequest extends Http2ServerRequest {

	/**
	 * The original url (automatic redirects).
	 * @since 0.0.1
	 */
	public originalUrl: string;

	/**
	 * The path of the url.
	 * @since 0.0.1
	 */
	public path: string;

	/**
	 * The search string of the url.
	 * @since 0.0.1
	 */
	public search: string;

	/**
	 * The parsed query of the search string.
	 * @since 0.0.1
	 */
	public query: any;

	/**
	 * The parsed params from the url.
	 * @since 0.0.1
	 */
	public params: any;

	/**
	 * The Route this incoming message is for.
	 * @since 0.0.1
	 */
	public route: Route;

	/**
	 * Authentication Data (added in middlewares).
	 * @since 0.0.1
	 */
	public auth: any;

	/**
	 * Parsed data sent in a POST (added in middlewares).
	 * @since 0.0.1
	 */
	public body: any;

	/**
	 * @param stream The HTTP2 Server Stream
	 * @param headers The incoming http headers
	 * @param options The stream readable options
	 * @param rawHeaders The raw headers
	 */
	public constructor(stream: ServerHttp2Stream, headers: IncomingHttpHeaders, options: ReadableOptions, rawHeaders: string[]) {
		super(stream, headers, options, rawHeaders);

		const info = parse(this.url, true);
		this.originalUrl = this.originalUrl || this.url;
		this.path = info.pathname;
		this.search = info.search;
		this.query = info.query;
		this.params = null;
		this.route = null;
		this.auth = null;
		this.body = null;
	}

	/**
	 * The lowercase method name
	 */
	public get methodLower(): string {
		return constants.METHODS_LOWER[this.method];
	}

	/**
	 * Executes the Route this message is for
	 * @param response The response object
	 */
	public execute(response: KlasaHttp2ServerResponse): void {
		return this.route[this.methodLower](this, response);
	}

	/**
	 * Initializes this message for the Route
	 * @param client The Klasa Client
	 */
	protected _init(client: Client): void {
		const splitURL = split(this.path);
		this.route = client.routes.findRoute(this.method, splitURL);

		if (this.route) this.params = this.route.execute(splitURL);
	}

}
