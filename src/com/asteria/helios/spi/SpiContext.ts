import { ServiceContext } from './service/ServiceContext';

/**
 * The <code>SpiContext</code> interface defines the API for the Helios Service Provider Interface.
 */
export interface SpiContext {

    /**
     * Initialize the context.
     */
    lookup(): void;

    /**
     * Add the specified service context to the SPI.
     * 
     * @param {ServiceContext} context the service context to add to the SPI.
     */
    addServiceContext(context: ServiceContext): void;

    /**
     * Return the reference to the service with the specified name.
     * 
     * 
     * @param {string} name the name of the service to get.
     * 
     * @returns {any} the reference to the specified service.
     */
    getService(name: string): any;
}