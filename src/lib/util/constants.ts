import { METHODS } from 'http';
import { KlasaIncomingMessage } from '../http/KlasaIncomingMessage';
import { KlasaServerResponse } from '../http/KlasaServerResponse';
import type { KlasaDashboardHooksOptions } from '../Client';

const lowerMethods: Record<string, string> = {};
for (const method of METHODS) lowerMethods[method] = method.toLowerCase();

export const METHODS_LOWER = lowerMethods as Readonly<Record<string, string>>;

export const RESPONSES = {
	FETCHING_TOKEN: '{"message":"Error fetching token"}',
	NO_CODE: '{"message":"No code provided"}',
	UNAUTHORIZED: '{"message":"Unauthorized"}',
	NOT_READY: '{"message":"No OAuth User Route Loaded"}',
	OK: '{"message":"Ok"}',
	UPDATED: [
		'{"updated":false}',
		'{"updated":true}'
	]
} as const;

const dashboardHooks: KlasaDashboardHooksOptions = {
	apiPrefix: 'api/',
	origin: '*',
	port: 4000,
	serverOptions: {
		IncomingMessage: KlasaIncomingMessage,
		ServerResponse: KlasaServerResponse
	}
};

export const OPTIONS = {
	dashboardHooks,
	pieces: {
		defaults: {
			routes: {
				enabled: true,
				authenticated: false
			},
			middlewares: {
				enabled: true
			}
		}
	}
} as const;
