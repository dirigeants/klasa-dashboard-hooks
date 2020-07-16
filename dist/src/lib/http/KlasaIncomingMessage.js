"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.KlasaIncomingMessage = void 0;
const http_1 = require("http");
const url_1 = require("url");
const Util_1 = require("../util/Util");
const constants = require("../util/constants");
/**
 * The custom class for KDH's incoming messages when using HTTP/HTTPS
 */
class KlasaIncomingMessage extends http_1.IncomingMessage {
    /**
     * @param {external:Socket} socket The net.Socket
     */
    constructor(socket) {
        super(socket);
        this.originalUrl = '';
        this.path = '';
        this.search = '';
        this.query = null;
        this.params = null;
        this.auth = null;
        this.body = null;
    }
    /**
     * The lowercase method name
     */
    get methodLower() {
        return Reflect.get(constants.METHODS_LOWER, this.method);
    }
    /**
     * Executes the Route this message is for
     * @param response The response object
     */
    execute(response) {
        if (!this.route)
            throw { code: 404 };
        return Reflect.get(this.route, this.methodLower).apply(this.route, [this, response]);
    }
    /**
     * Initializes this message for the Route
     * @param client The Klasa Client
     */
    _init(client) {
        var _a, _b, _c;
        // this.url is '' in the constructor and is updated later
        const info = url_1.parse(this.url, true);
        this.originalUrl = (_b = (_a = this.originalUrl) !== null && _a !== void 0 ? _a : this.url) !== null && _b !== void 0 ? _b : '';
        this.path = info.pathname;
        this.search = (_c = info.search) !== null && _c !== void 0 ? _c : '';
        this.query = info.query;
        const splitURL = Util_1.split(this.path);
        this.route = client.routes.findRoute(this.method, splitURL);
        if (this.route)
            this.params = this.route.execute(splitURL);
    }
}
exports.KlasaIncomingMessage = KlasaIncomingMessage;
//# sourceMappingURL=KlasaIncomingMessage.js.map