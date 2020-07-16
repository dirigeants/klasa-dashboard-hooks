"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Server = void 0;
const http_1 = require("http");
/**
 * The http server for klasa-dashboard-hooks
 */
class Server {
    /**
     * @since 0.0.1
     * @param client The Klasa client
     */
    constructor(client) {
        const { serverOptions } = client.options.dashboardHooks;
        this.client = client;
        this.server = http_1.createServer(serverOptions);
        this.onNoMatch = this.onError.bind(this, { code: 404 });
    }
    /**
     * Starts the server listening to a port
     * @param port The port to run the server on
     */
    listen(port) {
        this.server.on('request', this.handler.bind(this));
        return new Promise(res => {
            this.server.listen(port, res);
        });
    }
    /**
     * The handler for incoming requests
     * @param request The request
     * @param response The response
     */
    async handler(request, response) {
        // eslint-disable-next-line dot-notation
        request['_init'](this.client);
        try {
            await this.client.middlewares.run(request, response, request.route);
            await (request.route ? request.execute(response) : this.onNoMatch(request, response));
        }
        catch (err) {
            this.client.emit('error', err);
            this.onError(err, request, response);
        }
    }
    /**
     * The handler for errors
     * @param error The error
     * @param request The request
     * @param response The response
     */
    onError(error, _request, response) {
        var _a, _b, _c, _d;
        const code = response.statusCode = (_c = (_b = (_a = Reflect.get(error, 'code')) !== null && _a !== void 0 ? _a : Reflect.get(error, 'status')) !== null && _b !== void 0 ? _b : Reflect.get(error, 'statusCode')) !== null && _c !== void 0 ? _c : 500;
        response.end((_d = error.message) !== null && _d !== void 0 ? _d : http_1.STATUS_CODES[code]);
    }
}
exports.Server = Server;
//# sourceMappingURL=Server.js.map