const { METHODS } = require('http');

exports.OPTIONS = {
	dashboardHooks: {
		apiPrefix: 'api/',
		origin: '*',
		port: 4000,
		http2: false
	},
	pieceDefaults: {
		routes: {
			enabled: true,
			authenticated: false
		},
		middlewares: { enabled: true }
	}
};

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
