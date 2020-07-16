import { Route, RouteStore, KlasaIncomingMessage, KlasaServerResponse } from '@klasa/dashboard-hooks';
export default class extends Route {
    constructor(store: RouteStore, dir: string, file: string[]);
    post(request: KlasaIncomingMessage, response: KlasaServerResponse): Promise<void>;
    private noCode;
}
