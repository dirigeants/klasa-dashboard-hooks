/// <reference types="node" />
import { IncomingMessage } from 'http';
import type { Client } from '@klasa/core';
import type { Socket } from 'net';
import type { KlasaServerResponse } from './KlasaServerResponse';
import type { Route } from '../structures/Route';
/**
 * The custom class for KDH's incoming messages when using HTTP/HTTPS
 */
export declare class KlasaIncomingMessage extends IncomingMessage {
    /**
     * The original url (automatic redirects)
     */
    originalUrl: string;
    /**
     * The path of the url
     */
    path: string;
    /**
     * The search string of the url
     */
    search: string;
    /**
     * The parsed query of the search string
     */
    query: any;
    /**
     * The parsed params from the url
     */
    params: any;
    /**
     * The Route this incoming message is for
     */
    route: Route;
    /**
     * Authentication Data (added in middlewares)
     */
    auth: any;
    /**
     * Parsed data sent in a POST (added in middlewares)
     */
    body: any;
    /**
     * @param {external:Socket} socket The net.Socket
     */
    constructor(socket: Socket);
    /**
     * The lowercase method name
     */
    get methodLower(): string;
    /**
     * Executes the Route this message is for
     * @param response The response object
     */
    execute(response: KlasaServerResponse): void;
    /**
     * Initializes this message for the Route
     * @param client The Klasa Client
     */
    protected _init(client: Client): void;
}
