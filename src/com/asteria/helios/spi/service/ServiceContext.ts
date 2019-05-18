import { SpiServiceFactory } from '../factory/SpiServiceFactory';
import { AsteriaObject } from 'asteria-gaia';
import { HeliosServiceName } from '../../core/HeliosServiceName';
import { HeliosConfig } from '../../core/HeliosConfig';

/**
 * The <code>ServiceContext</code> interface defines the API of services that can interact with the Helios Service
 * Provider Interface.
 */
export interface ServiceContext extends AsteriaObject {

    /**
     * Return the service name.
     * 
     * @returns {HeliosServiceName | string} the service name.
     */
    getName(): HeliosServiceName | string;
    
    /**
     * Return the reference to the factory declared for this context.
     * 
     * @param {HeliosConfig} config the reference to the current server config.
     * 
     * @returns {SpiServiceFactory} the reference to the factory declared for this context.
     */
    getFactory(config: HeliosConfig): SpiServiceFactory;
}