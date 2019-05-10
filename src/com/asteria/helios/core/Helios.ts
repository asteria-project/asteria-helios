import { HeliosContext } from "./HeliosContext";

/**
 * The <code>Helios</code> interface represents a server object in the Helios framework.
 */
export interface Helios {

    /**
     * Start the server.
     */
    start(): void;

    /**
     * Return the context for this server.
     * 
     * @return {HeliosContext} he context for this server.
     */
    getContext(): HeliosContext;
}