import { Server as HttpServer, createServer as httpCreateServer, STATUS_CODES } from 'http';

import type { Client } from '@klasa/core';
import type { KlasaIncomingMessage } from './KlasaIncomingMessage';
import type { KlasaServerResponse } from './KlasaServerResponse';

export interface AuthData {
	/**
	 * The access token.
	 */
	token: string;
	/**
	 * The scopes
	 */
	scope: string[];
}

// export interface KlasaIncomingMessage extends IncomingMessage {
// 	/**
// 	 * The original URL
// 	 */
// 	originalUrl: string;
// 	/**
// 	 * The entire path section of the URL, including the `host`, `port`... and before the `query`/`hash` components
// 	 */
// 	path: string;
// 	/**
// 	 * The entire query string portion of the URL including the leading ASCII question mark (`?`) character
// 	 */
// 	search: string;
// 	/**
// 	 * The collection of key and value pairs parsed from the query string portion
// 	 */
// 	query: Record<string, string>;
// 	/**
// 	 * The body parsed in POST requests
// 	 */
// 	body?: any;
// 	/**
// 	 * The auth access token and scopes
// 	 */
// 	auth?: AuthData;
// }

interface ErrorLike {
	code?: number;
	stats?: number;
	statusCode?: number;
	message?: string;
}

/**
 * The http server for klasa-dashboard-hooks
 */
export class Server {

	/**
	 * The Client that manages this Server instance
	 * @since 0.0.1
	 */
	public client: Client;

	/**
	 * The http.Server instance that manages the HTTP requests
	 * @since 0.0.1
	 */
	public server: HttpServer;

	/**
	 * The onError function called when a url does not match
	 * @since 0.0.1
	 */
	private onNoMatch: (this: Server, _request: KlasaIncomingMessage, response: KlasaServerResponse) => void;

	/**
	 * @since 0.0.1
	 * @param client The Klasa client
	 */
	public constructor(client: Client) {
		const { serverOptions } = client.options.dashboardHooks;

		this.client = client;
		this.server = httpCreateServer(serverOptions);
		this.onNoMatch = this.onError.bind(this, { code: 404 });
	}

	/**
	 * Starts the server listening to a port
	 * @param port The port to run the server on
	 */
	public listen(port: number): Promise<void> {
		this.server.on('request', this.handler.bind(this));
		return new Promise(res => {
			this.server.listen(port, res);
		});
	}

	/**
	 * The handler for incoming requests
	 * @param request The request
	 * @param response The response
	 */
	private async handler(request: KlasaIncomingMessage, response: KlasaServerResponse) {
		// eslint-disable-next-line dot-notation
		request['_init'](this.client);

		try {
			await this.client.middlewares.run(request, response, request.route);
			await (request.route ? request.execute(response) : this.onNoMatch(request, response));
		} catch (err) {
			this.client.emit('error', err);
			this.onError(err, request, response);
		}
	}

	/**
	 * The handler for errors
	 * @param error The error
	 * @param request The request
	 * @param response The response
	 */
	private onError(error: Error | ErrorLike, _request: KlasaIncomingMessage, response: KlasaServerResponse): void {
		const code = response.statusCode = Reflect.get(error, 'code') || Reflect.get(error, 'status') || Reflect.get(error, 'statusCode') || 500;
		response.end(error.message || STATUS_CODES[code]);
	}

}
