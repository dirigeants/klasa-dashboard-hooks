import { Route, RouteStore, KlasaIncomingMessage, KlasaServerResponse } from '@klasa/dashboard-hooks';
export default class extends Route {
    constructor(store: RouteStore, dir: string, file: string[]);
    get(request: KlasaIncomingMessage, response: KlasaServerResponse): Promise<void>;
    post(request: KlasaIncomingMessage, response: KlasaServerResponse): Promise<void>;
}
