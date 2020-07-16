import { IncomingMessage } from 'http';
import { parse } from 'url';
import { split } from '../util/Util';
import * as constants from '../util/constants';

import type { Client } from '@klasa/core';
import type { Socket } from 'net';
import type { KlasaServerResponse } from './KlasaServerResponse';
import type { Route } from '../structures/Route';

/**
 * The custom class for KDH's incoming messages when using HTTP/HTTPS
 */
export class KlasaIncomingMessage extends IncomingMessage {

	/**
	 * The original url (automatic redirects)
	 */
	public originalUrl: string;

	/**
	 * The path of the url
	 */
	public path: string;

	/**
	 * The search string of the url
	 */
	public search: string;

	/**
	 * The parsed query of the search string
	 */
	public query: any;

	/**
	 * The parsed params from the url
	 */
	public params: any;

	/**
	 * The Route this incoming message is for
	 */
	public route!: Route;

	/**
	 * Authentication Data (added in middlewares)
	 */
	public auth: any;

	/**
	 * Parsed data sent in a POST (added in middlewares)
	 */
	public body: any;

	/**
	 * @param {external:Socket} socket The net.Socket
	 */
	public constructor(socket: Socket) {
		super(socket);

		this.originalUrl = '';
		this.path = '';
		this.search = '';
		this.query = null;
		this.params = null;
		this.auth = null;
		this.body = null;
	}

	/**
	 * The lowercase method name
	 */
	public get methodLower(): string {
		return Reflect.get(constants.METHODS_LOWER, this.method as string);
	}

	/**
	 * Executes the Route this message is for
	 * @param response The response object
	 */
	public execute(response: KlasaServerResponse): void {
		if (!this.route) throw { code: 404 };
		return Reflect.get(this.route, this.methodLower).apply(this.route, [this, response]);
	}

	/**
	 * Initializes this message for the Route
	 * @param client The Klasa Client
	 */
	protected _init(client: Client): void {
		// this.url is '' in the constructor and is updated later
		const info = parse(this.url as string, true);
		this.originalUrl = this.originalUrl ?? this.url ?? '';
		this.path = info.pathname as string;
		this.search = info.search ?? '';
		this.query = info.query;

		const splitURL = split(this.path);
		this.route = client.routes.findRoute(this.method as string, splitURL) as Route;

		if (this.route) this.params = this.route.execute(splitURL);
	}

}
