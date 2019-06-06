import { ServiceContext } from '../../../../../spi/service/ServiceContext';
import { SpiServiceFactory } from '../../../../../spi/factory/SpiServiceFactory';
import { AbstractAsteriaObject } from 'asteria-gaia';
import { HeliosServiceName } from '../../../../../core/HeliosServiceName';
import { HeliosConfig } from '../../../../../core/HeliosConfig';
import { ModuleRegistryIMFactory } from '../factory/ModuleRegistryIMFactory';

/**
 * The default service context for creating Hyperion module registries.
 */
export class ModuleRegistryIMServiceContext  extends AbstractAsteriaObject implements ServiceContext {

    /**
     * Create a new <code>ModuleRegistryIMServiceContext</code> instance.
     */
    constructor() {
        super('com.asteria.helios.connector.im.module.context::ModuleRegistryIMServiceContext');
    }

    /**
     * @inheritdoc
     */
    public getName(): HeliosServiceName {
        return HeliosServiceName.MODULE_REGISTRY;
    }
    
    /**
     * @inheritdoc
     */
    public getFactory(config: HeliosConfig): SpiServiceFactory {
        return new ModuleRegistryIMFactory(config);
    }
}