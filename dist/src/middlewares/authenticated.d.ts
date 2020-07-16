import { Middleware, MiddlewareStore, Route, KlasaServerResponse, KlasaIncomingMessage } from '@klasa/dashboard-hooks';
export default class extends Middleware {
    constructor(store: MiddlewareStore, dir: string, file: string[]);
    run(request: KlasaIncomingMessage, response: KlasaServerResponse, route: Route): Promise<void>;
    private unauthorized;
}
