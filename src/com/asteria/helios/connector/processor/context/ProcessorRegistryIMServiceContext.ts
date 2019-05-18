import { ServiceContext } from '../../../spi/service/ServiceContext';
import { HeliosConfig } from '../../../../eos/config/HeliosConfig';
import { ProcessorRegistryIMFactory } from '../factory/ProcessorRegistryIMFactory';
import { SpiServiceFactory } from '../../../spi/factory/SpiServiceFactory';

/**
 * The default service context for creating Helios processor registries.
 */
export class ProcessorRegistryIMServiceContext implements ServiceContext {

    /**
     * @inheritdoc
     */
    public getName(): string {
        return 'processor-registry';
    }
    
    /**
     * @inheritdoc
     */
    public getFactory(config: HeliosConfig): SpiServiceFactory {
        return new ProcessorRegistryIMFactory(config);
    }
}