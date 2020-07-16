/// <reference types="node" />
import { Server as HttpServer } from 'http';
import type { Client } from '@klasa/core';
export interface AuthData {
    /**
     * The access token.
     */
    token: string;
    /**
     * The scopes
     */
    scope: string[];
}
/**
 * The http server for klasa-dashboard-hooks
 */
export declare class Server {
    /**
     * The Client that manages this Server instance
     * @since 0.0.1
     */
    client: Client;
    /**
     * The http.Server instance that manages the HTTP requests
     * @since 0.0.1
     */
    server: HttpServer;
    /**
     * The onError function called when a url does not match
     * @since 0.0.1
     */
    private onNoMatch;
    /**
     * @since 0.0.1
     * @param client The Klasa client
     */
    constructor(client: Client);
    /**
     * Starts the server listening to a port
     * @param port The port to run the server on
     */
    listen(port: number): Promise<void>;
    /**
     * The handler for incoming requests
     * @param request The request
     * @param response The response
     */
    private handler;
    /**
     * The handler for errors
     * @param error The error
     * @param request The request
     * @param response The response
     */
    private onError;
}
