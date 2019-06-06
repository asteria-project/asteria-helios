import { AbstractAsteriaObject } from 'asteria-gaia';
import { SpiServiceFactory } from '../../../../../spi/factory/SpiServiceFactory';
import { HeliosConfig } from '../../../../../core/HeliosConfig';
import { ModuleRegistryIM } from '../impl/ModuleRegistryIM';
import { ModuleRegistry } from '../../../../../service/config/ModuleRegistry';

/**
 * The <code>ModuleRegistryIMFactory</code> class allows to create "in memory" <code>ModuleRegistry</code> objects
 * depending on the current server congig.
 */
export class ModuleRegistryIMFactory extends AbstractAsteriaObject implements SpiServiceFactory {

    /**
     * Create a new <code>ModuleRegistryIMFactory</code> instance.
     * 
     * @param {HeliosConfig} config the reference to the current server config.
     */
    constructor(config: HeliosConfig) {
        super('com.asteria.helios.connector.im.module.factory::ModuleRegistryIMFactory');
    }

    /**
     * Create and return a new <code>ModuleRegistry</code> for the current Helios server.
     * 
     * @returns {ModuleRegistry} a new <code>ModuleRegistry</code> for the current Helios server.
     */
    public create(): ModuleRegistry {
        return new ModuleRegistryIM();
    }
}