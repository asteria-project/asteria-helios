import { HeliosRouter } from '../route/HeliosRouter';

/**
 * The <code>HeliosServer</code> interface represents a server object in the Helios framework.
 */
export interface HeliosServer {

    /**
     * Start the server.
     */
    start(): void;

    /**
     * Return the router object for this server.
     * 
     * @return {HeliosRouter} the router object for this server.
     */
    getRouter(): HeliosRouter;
}