module.exports = {
	OPTIONS: {
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
	}
};
