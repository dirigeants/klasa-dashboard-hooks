import { KlasaClient, KlasaClientOptions, Piece, Store, PieceOptions, KlasaPieceDefaults } from 'klasa';
import { Server as HttpServer, IncomingMessage, ServerResponse } from 'http';
import { SecureContextOptions, Server as HttpSecureServer } from 'tls';
import { Http2SecureServer } from 'http2';

declare module 'klasa-dashboard-hooks' {

//#region Classes

	export class DashboardClient extends KlasaClient {
		public constructor(options?: DashboardClientOptions);
		public options: Required<DashboardClientOptions>;
		public server: Server;
		public routes: RouteStore;
		public middlewares: MiddlewareStore;
	}

	export class Server {
		public constructor(client: DashboardClient);
		public client: DashboardClient;
		public server: HttpServer | HttpSecureServer | Http2SecureServer;
		public onNoMatch: (request: IncomingMessage, response: ServerResponse) => void;
		public listen(port: number): Promise<void>;
		public handler(request: IncomingMessage, response: ServerResponse): Promise<void>;
		public onError(error: Error | ErrorLike, request: KlasaIncomingMessage, response: ServerResponse): void;
	}

	export abstract class Middleware extends Piece {
		public constructor(client: DashboardClient, store: MiddlewareStore, file: string[], directory: string, options?: MiddlewareOptions);
		public priority: number;
		public abstract run(request: KlasaIncomingMessage, response: ServerResponse, route?: Route): Promise<void>;
	}

	export class MiddlewareStore extends Store<string, Middleware, typeof Middleware> {
		public sortedMiddlewares: Middleware[];
		public run(request: KlasaIncomingMessage, response: ServerResponse, route?: Route): Promise<void>;
	}

	export abstract class Route extends Piece {
		public constructor(client: DashboardClient, store: RouteStore, file: string[], directory: string, options?: RouteOptions);
		public authenticated: boolean;
		public parsed: ParsedRoute;
		public route: string;
		public matches(split: string[]): boolean;
		public execute(split: string[]): Record<string, any>;
	}

	export class RouteStore extends Store<string, Route, typeof RouteStore> {
		public registry: Record<string, Map<string, Route>>;
		public findRoute(method: string, splitURL: string[]): Route | undefined;
	}

	export const constants: Constants;

	export class Util {
		public static parsePart(val: string): ParsedPart;
		public static split(url: string): string[];
		public static parse(url: string): ParsedPart[];
	}

//#endregion Classes
//#region Types

	export type KlasaDashboardHooksOptions = {
		apiPrefix?: string;
		origin?: string;
		port?: number;
		http2?: boolean;
		sslOptions?: SecureContextOptions;
	};

	export type DashboardClientOptions = {
		dashboardHooks?: KlasaDashboardHooksOptions;
	} & KlasaClientOptions;

	export type KlasaIncomingMessage = {
		originalUrl: string;
		path: string;
		search: string;
		query: Record<string, string | string[]>;
		params: Record<string, any>;
		body?: any;
	} & IncomingMessage;

	export type RouteOptions = {
		route?: string;
		authenticated?: boolean;
	} & PieceOptions;

	export type MiddlewareOptions = {
		priority?: number;
	} & PieceOptions;

	type ErrorLike = {
		code?: number;
		status?: number;
		statusCode?: number;
		message?: string;
	};

	type ParsedRoute = ParsedPart[];

	type ParsedPart = {
		val: string;
		type: number;
	};

	type Constants = {
		dashboardHooks: KlasaDashboardHooksOptions;
		pieceDefaults: KlasaPieceDefaults & {
			routes: Required<RouteOptions>;
			middlewares: Required<MiddlewareOptions>;
		};
	}

//#endregion Types

}
