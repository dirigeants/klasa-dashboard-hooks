/// <reference types="node" />
import { ServerResponse } from 'http';
/**
 * The server response for KDH when using HTTP/HTTPS
 */
export declare class KlasaServerResponse extends ServerResponse {
    /**
     * Sets the status code of this response
     * @param code The status code to set the response to
     */
    status(code: number): this;
    /**
     * Ends the response with JSON.stringified data
     * @param data The data to respond with
     */
    json(data: unknown): void;
}
