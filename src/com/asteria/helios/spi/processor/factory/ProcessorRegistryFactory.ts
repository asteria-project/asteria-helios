import { ProcessorRegistry } from '../ProcessorRegistry';
import { ProcessorRegistryIM } from '../impl/ProcessorRegistryIM';
import { HeliosConfig } from '../../../config/HeliosConfig';

/**
 * The <code>ProcessorRegistryFactory</code> allows to create <code>ProcessorRegistryFactory</code> instances depending
 * on the current server congig.
 */
export class ProcessorRegistryFactory {

    /**
     * Create a new <code>ProcessorRegistryFactory</code> instance.
     * 
     * @param {HeliosConfig} config the reference to the current server config.
     */
    constructor(config: HeliosConfig) {}

    /**
     * Create and return a new <code>ProcessorRegistry</code> for the current Helios server.
     * 
     * @returns {ProcessorRegistry} a new <code>ProcessorRegistry</code> for the current Helios server.
     */
    public create(): ProcessorRegistry {
        return new ProcessorRegistryIM();
    }
}