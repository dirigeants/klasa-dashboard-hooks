const { METHODS } = require('http');

const lowerMethods = {};
for (const method of METHODS) lowerMethods[method] = method.toLowerCase();

exports.METHODS_LOWER = lowerMethods;

exports.RESPONSES = {
	FETCHING_TOKEN: '{"message":"Error fetching token"}',
	NO_CODE: '{"message":"No code provided"}',
	UNAUTHORIZED: '{"message":"Unauthorized"}',
	NOT_READY: '{"message":"No OAuth User Route Loaded"}',
	OK: '{"message":"Ok"}',
	UPDATED: [
		'{"updated":false}',
		'{"updated":true}'
	]
};

exports.OPTIONS = {
	dashboardHooks: {
		apiPrefix: 'api/',
		origin: '*',
		port: 4000,
		http2: false,
		serverOptions: {
			IncomingMessage: require('../http/KlasaIncomingMessage'),
			ServerResponse: require('../http/KlasaServerResponse'),
			Http1IncomingMessage: require('../http/KlasaIncomingMessage'),
			Http1ServerResponse: require('../http/KlasaServerResponse'),
			Http2ServerRequest: require('../http/KlasaHttp2ServerRequest'),
			Http2ServerResponse: require('../http/KlasaHttp2ServerResponse')
		}
	},
	pieceDefaults: {
		routes: {
			enabled: true,
			authenticated: false
		},
		middlewares: { enabled: true }
	}
};
