import { KlasaClient, KlasaClientOptions, Piece, Store, PieceOptions } from 'klasa';
import { Server as HTTPServer, IncomingMessage, ServerResponse } from 'http';
import { SecureContextOptions } from 'tls';

declare module 'klasa-dashboard-hooks' {

//#region Classes


	export class DashboardClient extends KlasaClient {
		public constructor(config: DashboardClientOptions);
		public server: Server;
		public routes: RouteStore;
		public middlewares: MiddlewareStore;
	}

	export { DashboardClient as Client };

	export class Server {
		public constructor(client: DashboardClient);
		public client: DashboardClient;
		public server: Server;
		public onNoMatch: (request: IncomingMessage, response: ServerResponse) => void;
		public listen(port: number): Promise<void>;
		public handler(request: IncomingMessage, response: ServerResponse): Promise<void>;
		public onError(error: Error | ErrorLike, request: KlasaIncomingMessage, response: ServerResponse): void;
	}

	export abstract class Middleware extends Piece {
		public abstract run(request: KlasaIncomingMessage, response: ServerResponse, route?: Route): Promise<void>;
	}

	export class MiddlewareStore extends Store<string, Middleware, typeof Middleware> {
		public run(request: KlasaIncomingMessage, response: ServerResponse, route?: Route): Promise<void>;
	}

	export abstract class Route extends Piece {
		public constructor(client: DashboardClient, store: RouteStore, file: string, core: boolean, options?: RouteOptions);
		public route: string;
		public parsed: ParsedRoute;
		public matches(split: string[]): boolean;
		public execute(split: string[]): ObjectLiteral<any>;
	}

	export class RouteStore extends Store<string, Route, typeof RouteStore> { }

	export const constants: Constants;

	export class Util {
		public static parsePart(val: string): ParsedPart;
		public static split(url: string): string[];
		public static parse(url: string): ParsedPart[];
	}

	export { Util as util };

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
		query: ObjectLiteral<string | string[]>;
	} & IncomingMessage;

	export type RouteOptions = {
		route?: string;
	} & PieceOptions;

	type ErrorLike = {
		code?: number;
		status?: number;
		statusCode?: number;
		message?: string;
	};

	export type ParsedRoute = ParsedPart[];

	export type ParsedPart = {
		val: string;
		type: number;
	};

	type Constants = {
		dashboardHooks: KlasaDashboardHooksOptions;
		pieceDefaults: {
			routes: PieceOptions;
			middlewares: PieceOptions;
		}
	}

	type ObjectLiteral<T> = { [key: string]: T };

//#endregion Types

}
