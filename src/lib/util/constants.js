const { METHODS } = require('http');

exports.OPTIONS = {
	dashboardHooks: {
		apiPrefix: 'api/',
		origin: '*',
		port: 4000,
		http2: false
	},
	pieceDefaults: {
		routes: { enabled: true },
		middlewares: { enabled: true }
	}
};

const lowerMethods = {};
for (const method of METHODS) lowerMethods[method] = method.toLowerCase();

exports.METHODS_LOWER = lowerMethods;
