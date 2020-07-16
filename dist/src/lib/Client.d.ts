/// <reference types="node" />
import { Plugin, Client } from '@klasa/core';
import { Server } from './http/Server';
import { RouteStore } from './structures/RouteStore';
import { MiddlewareStore } from './structures/MiddlewareStore';
import { DashboardUserStore } from './structures/DashboardUserStore';
import type { RouteOptions } from './structures/Route';
import type { ServerOptions } from 'https';
import type { MiddlewareOptions } from './structures/Middleware';
/**
 * The client for handling everything. See {@tutorial GettingStarted} for more information how to get started using this class.
 * @tutorial GettingStarted
 */
export declare class DashboardHooks implements Plugin {
    static [Client.plugin](this: Client): void;
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
    interface Client {
        server: Server;
        routes: RouteStore;
        middlewares: MiddlewareStore;
        dashboardUsers: DashboardUserStore;
    }
    interface ClientOptions {
        dashboardHooks: Partial<KlasaDashboardHooksOptions>;
    }
    interface PieceDefaults {
        routes: Partial<RouteOptions>;
        middlewares: Partial<MiddlewareOptions>;
    }
    interface CacheLimits {
        dashboardUsers?: number;
    }
}
