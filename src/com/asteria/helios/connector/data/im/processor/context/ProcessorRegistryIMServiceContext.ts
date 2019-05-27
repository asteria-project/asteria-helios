import { ServiceContext } from '../../../../../spi/service/ServiceContext';
import { ProcessorRegistryIMFactory } from '../factory/ProcessorRegistryIMFactory';
import { SpiServiceFactory } from '../../../../../spi/factory/SpiServiceFactory';
import { AbstractAsteriaObject } from 'asteria-gaia';
import { HeliosServiceName } from '../../../../../core/HeliosServiceName';
import { HeliosConfig } from '../../../../../core/HeliosConfig';

/**
 * The default service context for creating Helios processor registries.
 */
export class ProcessorRegistryIMServiceContext  extends AbstractAsteriaObject implements ServiceContext {

    /**
     * Create a new <code>ProcessorRegistryIMServiceContext</code> instance.
     */
    constructor() {
        super('com.asteria.helios.connector.im.processor.context::ProcessorRegistryIMServiceContext');
    }

    /**
     * @inheritdoc
     */
    public getName(): HeliosServiceName {
        return HeliosServiceName.PROCESSOR_REGISTRY;
    }
    
    /**
     * @inheritdoc
     */
    public getFactory(config: HeliosConfig): SpiServiceFactory {
        return new ProcessorRegistryIMFactory(config);
    }
}