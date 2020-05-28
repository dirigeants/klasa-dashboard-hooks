import { METHODS } from 'http';
import { KlasaIncomingMessage } from '../http/KlasaIncomingMessage';
import { KlasaHttp2ServerRequest } from '../http/KlasaHttp2ServerRequest';
import { KlasaServerResponse } from '../http/KlasaServerResponse';
import { KlasaHttp2ServerResponse } from '../http/KlasaHttp2ServerResponse';

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

export const OPTIONS = {
	dashboardHooks: {
		apiPrefix: 'api/',
		origin: '*',
		port: 4000,
		http2: false,
		serverOptions: {
			IncomingMessage: KlasaIncomingMessage,
			ServerResponse: KlasaServerResponse,
			Http1IncomingMessage: KlasaIncomingMessage,
			Http1ServerResponse: KlasaServerResponse,
			Http2ServerRequest: KlasaHttp2ServerRequest,
			Http2ServerResponse: KlasaHttp2ServerResponse
		}
	},
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
