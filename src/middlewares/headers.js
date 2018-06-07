const { Middleware } = require('klasa-dashboard-hooks');

module.exports = class extends Middleware {

	run(request, response, next) {
		response.setHeader('Access-Control-Allow-Origin', this.client.options.dashboardHooks.origin);
		response.setHeader('Content-Type', 'application/json');
		next();
	}

};
