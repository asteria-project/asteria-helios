import { HeliosContext } from './HeliosContext';

/**
 * The <code>Helios</code> interface represents the entry point of the Helios framework.
 */
export interface Helios {

    /**
     * Start the server.
     */
    start(): void;

    /**
     * Return the context for this server.
     * 
     * @return {HeliosContext} the context for this server.
     */
    getContext(): HeliosContext;
}