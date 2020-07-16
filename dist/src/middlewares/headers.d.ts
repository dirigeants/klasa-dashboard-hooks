import { Middleware, MiddlewareStore, KlasaIncomingMessage, KlasaServerResponse } from '@klasa/dashboard-hooks';
export default class extends Middleware {
    constructor(store: MiddlewareStore, dir: string, file: string[]);
    run(request: KlasaIncomingMessage, response: KlasaServerResponse): void;
}
