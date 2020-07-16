"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const zlib_1 = require("zlib");
const dashboard_hooks_1 = require("@klasa/dashboard-hooks");
class default_1 extends dashboard_hooks_1.Middleware {
    constructor(store, dir, file) {
        super(store, dir, file, { priority: 20 });
    }
    async run(request) {
        if (request.method !== 'POST')
            return;
        const stream = this.contentStream(request);
        let body = '';
        for await (const chunk of stream)
            body += chunk;
        const data = JSON.parse(body);
        request.body = data;
    }
    contentStream(request) {
        var _a;
        // const length = request.headers['content-length'];
        let stream;
        switch (((_a = request.headers['content-encoding']) !== null && _a !== void 0 ? _a : 'identity').toLowerCase()) {
            case 'deflate':
                stream = zlib_1.createInflate();
                request.pipe(stream);
                break;
            case 'gzip':
                stream = zlib_1.createGunzip();
                request.pipe(stream);
                break;
            case 'identity':
                stream = request;
                // stream.length = length;
                break;
        }
        return stream;
    }
}
exports.default = default_1;
//# sourceMappingURL=json.js.map