import type { KlasaDashboardHooksOptions } from '../Client';
export declare const METHODS_LOWER: Readonly<Record<string, string>>;
export declare const RESPONSES: {
    readonly FETCHING_TOKEN: "{\"message\":\"Error fetching token\"}";
    readonly NO_CODE: "{\"message\":\"No code provided\"}";
    readonly UNAUTHORIZED: "{\"message\":\"Unauthorized\"}";
    readonly NOT_READY: "{\"message\":\"No OAuth User Route Loaded\"}";
    readonly OK: "{\"message\":\"Ok\"}";
    readonly UPDATED: readonly ["{\"updated\":false}", "{\"updated\":true}"];
};
export declare const OPTIONS: {
    readonly dashboardHooks: KlasaDashboardHooksOptions;
    readonly pieces: {
        readonly defaults: {
            readonly routes: {
                readonly enabled: true;
                readonly authenticated: false;
            };
            readonly middlewares: {
                readonly enabled: true;
            };
        };
    };
};
