"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.KlasaServerResponse = void 0;
const http_1 = require("http");
/**
 * The server response for KDH when using HTTP/HTTPS
 */
class KlasaServerResponse extends http_1.ServerResponse {
    /**
     * Sets the status code of this response
     * @param code The status code to set the response to
     */
    status(code) {
        this.statusCode = code;
        return this;
    }
    /**
     * Ends the response with JSON.stringified data
     * @param data The data to respond with
     */
    json(data) {
        return this.end(JSON.stringify(data));
    }
}
exports.KlasaServerResponse = KlasaServerResponse;
//# sourceMappingURL=KlasaServerResponse.js.map