"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OPTIONS = exports.RESPONSES = exports.METHODS_LOWER = void 0;
const http_1 = require("http");
const KlasaIncomingMessage_1 = require("../http/KlasaIncomingMessage");
const KlasaServerResponse_1 = require("../http/KlasaServerResponse");
const lowerMethods = {};
for (const method of http_1.METHODS)
    lowerMethods[method] = method.toLowerCase();
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
const dashboardHooks = {
    apiPrefix: 'api/',
    origin: '*',
    port: 4000,
    serverOptions: {
        IncomingMessage: KlasaIncomingMessage_1.KlasaIncomingMessage,
        ServerResponse: KlasaServerResponse_1.KlasaServerResponse
    }
};
exports.OPTIONS = {
    dashboardHooks,
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
};
//# sourceMappingURL=constants.js.map