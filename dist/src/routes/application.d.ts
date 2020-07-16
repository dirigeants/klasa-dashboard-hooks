import { Route, RouteStore, KlasaIncomingMessage, KlasaServerResponse } from '@klasa/dashboard-hooks';
export default class extends Route {
    constructor(store: RouteStore, dir: string, file: string[]);
    get(_request: KlasaIncomingMessage, response: KlasaServerResponse): void;
}
