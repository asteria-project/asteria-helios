import { HeliosConfig } from '../../../../eos/config/HeliosConfig';
import { ProcessorRegistry } from '../ProcessorRegistry';
import { ProcessorRegistryIM } from '../impl/ProcessorRegistryIM';
import { AbstractAsteriaObject } from 'asteria-gaia';
import { SpiServiceFactory } from '../../../spi/factory/SpiServiceFactory';

/**
 * The <code>ProcessorRegistryIMFactory</code> class allows to create "in memory" <code>ProcessorRegistry</code> 
 * objects depending on the current server congig.
 */
export class ProcessorRegistryIMFactory extends AbstractAsteriaObject implements SpiServiceFactory {

    /**
     * Create a new <code>ProcessorRegistryFactory</code> instance.
     * 
     * @param {HeliosConfig} config the reference to the current server config.
     */
    constructor(config: HeliosConfig) {
        super('com.asteria.helios.connector.processor.factory::ProcessorRegistryFactory');
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