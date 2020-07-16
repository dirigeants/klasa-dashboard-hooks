import { Middleware, MiddlewareStore, KlasaIncomingMessage } from '@klasa/dashboard-hooks';
export default class extends Middleware {
    constructor(store: MiddlewareStore, dir: string, file: string[]);
    run(request: KlasaIncomingMessage): Promise<void>;
    private contentStream;
}
