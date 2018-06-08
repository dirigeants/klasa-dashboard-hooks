const { Middleware } = require('klasa-dashboard-hooks');

module.exports = class extends Middleware {

	run(request, response, next) {
		response.setHeader('Access-Control-Allow-Origin', this.client.options.dashboardHooks.origin);
		response.setHeader('Access-Control-Allow-Methods', 'DELETE, GET, HEAD, OPTIONS, PATCH, POST, PUT');
		response.setHeader('Access-Control-Allow-Headers', 'Authorization, User-Agent, Content-Type');
		if (request.method === 'OPTIONS') return response.end('Something');
		response.setHeader('Content-Type', 'application/json');
		return next();
	}

};
