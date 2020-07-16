import { Plugin, Client, Constructor } from '@klasa/core';
import { mergeDefault } from '@klasa/utils';
import { join } from 'path';
import { Server } from './http/Server';
import { RouteStore } from './structures/RouteStore';
import { MiddlewareStore } from './structures/MiddlewareStore';
import { DashboardUser } from './structures/DashboardUser';
import { OPTIONS } from './util/constants';
import { DashboardUserStore } from './structures/DashboardUserStore';
import type { RouteOptions } from './structures/Route';
import type { ServerOptions } from 'https';
import type { MiddlewareOptions } from './structures/Middleware';

/**
 * The client for handling everything. See {@tutorial GettingStarted} for more information how to get started using this class.
 * @tutorial GettingStarted
 */
export class DashboardHooks implements Plugin {

	static [Client.plugin](this: Client): void {
		// eslint-disable-next-line @typescript-eslint/ban-ts-comment
		// @ts-expect-error
		mergeDefault(OPTIONS, this.options);

		/**
		 * The http server handler for the api
		 * @since 0.0.1
		 */
		this.server = new Server(this);

		/**
		 * The cache where routes are stored
		 * @since 0.0.1
		 */
		this.routes = new RouteStore(this);

		/**
		 * The cache where middlewares are stored
		 * @since 0.0.1
		 */
		this.middlewares = new MiddlewareStore(this);

		/**
		 * The cache where oauth data is temporarily stored
		 * @since 0.0.1
		 */
		this.dashboardUsers = new DashboardUserStore(this, DashboardUser as unknown as Constructor<DashboardUser>, this.options.cache.limits.dashboardUsers);

		this
			.registerStore(this.routes)
			.registerStore(this.middlewares);

		const coreDirectory = join(__dirname, '../');

		this.routes.registerCoreDirectory(coreDirectory);
		this.middlewares.registerCoreDirectory(coreDirectory);

		this.server.listen(this.options.dashboardHooks.port);
	}

}

export interface KlasaDashboardHooksOptions {
	/**
	 * The route prefix for the api.
	 * @since 0.0.1
	 * @default 'api/'
	 */
	apiPrefix?: string;

	/**
	 * The cross origin setting.
	 * @since 0.0.1
	 * @default '*'
	 */
	origin?: string;

	/**
	 * The port the api runs on.
	 * @since 0.0.1
	 * @default 4000
	 */
	port?: number;

	/**
	 * The client id used in oauth requests
	 */
	clientID?: string;

	/**
	 * The client secret used in oauth requests
	 */
	clientSecret?: string;

	/**
	 * The SSL options.
	 * @since 0.0.1
	 */
	serverOptions?: ServerOptions;
}

declare module '@klasa/core/dist/src/lib/client/Client' {

	export interface Client {
		server: Server;
		routes: RouteStore;
		middlewares: MiddlewareStore;
		dashboardUsers: DashboardUserStore;
	}

	export interface ClientOptions {
		dashboardHooks: Partial<KlasaDashboardHooksOptions>;
	}

	export interface PieceDefaults {
		routes: Partial<RouteOptions>;
		middlewares: Partial<MiddlewareOptions>;
	}

	export interface CacheLimits {
		dashboardUsers?: number;
	}

}
