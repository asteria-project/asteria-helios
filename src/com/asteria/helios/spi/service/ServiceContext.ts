import { HeliosConfig } from '../../../eos/config/HeliosConfig';
import { SpiServiceFactory } from '../factory/SpiServiceFactory';

/**
 * The <code>ServiceContext</code> interface defines the API of services that can interact with the Helios Service
 * Provider Interface.
 */
export interface ServiceContext {

    /**
     * Return the service name.
     * 
     * @returns {string} the service name.
     */
    getName(): string;
    
    /**
     * Return the reference to the factory declared for this context.
     * 
     * @param {HeliosConfig} config the reference to the current server config.
     * 
     * @returns {SpiServiceFactory} the reference to the factory declared for this context.
     */
    getFactory(config: HeliosConfig): SpiServiceFactory;
}