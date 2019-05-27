import { ServiceContext } from './service/ServiceContext';
import { AsteriaException } from 'asteria-gaia';

/**
 * The <code>SpiContext</code> interface defines the API for the Helios Service Provider Interface.
 */
export interface SpiContext {

    /**
     * Initialize the context.
     * 
     * @param {(err:AsteriaException)=> void} callback the callback method invoked after the context has been
     *                                                 initialized.
     */
    lookup(callback: (err: AsteriaException)=> void): void;

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