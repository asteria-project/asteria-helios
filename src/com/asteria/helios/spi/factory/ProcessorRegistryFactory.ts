import { HeliosConfig } from '../../../eos/config/HeliosConfig';
import { ProcessorRegistry } from '../processor/ProcessorRegistry';
import { ProcessorRegistryIM } from '../processor/impl/ProcessorRegistryIM';
import { AbstractAsteriaObject } from 'asteria-gaia';

/**
 * The <code>ProcessorRegistryFactory</code> class allows to create <code>ProcessorRegistry</code> instances depending
 * on the current server congig.
 */
export class ProcessorRegistryFactory extends AbstractAsteriaObject {

    /**
     * Create a new <code>ProcessorRegistryFactory</code> instance.
     * 
     * @param {HeliosConfig} config the reference to the current server config.
     */
    constructor(config: HeliosConfig) {
        super('com.asteria.helios.spi.factory::ProcessorRegistryFactory');
    }

    /**
     * Create and return a new <code>ProcessorRegistry</code> for the current Helios server.
     * 
     * @returns {ProcessorRegistry} a new <code>ProcessorRegistry</code> for the current Helios server.
     */
    public create(): ProcessorRegistry {
        return new ProcessorRegistryIM();
    }
}