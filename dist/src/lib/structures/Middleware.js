"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Middleware = void 0;
const core_1 = require("@klasa/core");
/**
 * Base class for all Klasa Middleware. See {@tutorial CreatingMiddlewares} for more information how to use the class
 * to build custom events.
 * @since 0.0.1
 * @tutorial CreatingMiddlewares
 */
class Middleware extends core_1.Piece {
    /**
     * @since 0.0.1
     * @param store The Middleware Store
     * @param file The path from the pieces folder to the middleware file
     * @param core If the piece is in the core directory or not
     * @param options Optional Middleware settings
     */
    constructor(store, directory, file, options = {}) {
        super(store, directory, file, options);
        this.priority = options.priority;
    }
}
exports.Middleware = Middleware;
//# sourceMappingURL=Middleware.js.map