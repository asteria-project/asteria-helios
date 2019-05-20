import { ServiceContext } from '../../../../../spi/service/ServiceContext';
import { SpiServiceFactory } from '../../../../../spi/factory/SpiServiceFactory';
import { FileTemplateRegistryFactory } from '../factory/FileTemplateRegistryFactory';
import { AbstractAsteriaObject } from 'asteria-gaia';
import { HeliosServiceName } from '../../../../../core/HeliosServiceName';
import { HeliosConfig } from '../../../../../core/HeliosConfig';

/**
 * The default service context for creating Helios template registries.
 */
export class FileTemplateRegistryServiceContext extends AbstractAsteriaObject implements ServiceContext {

    /**
     * Create a new <code>FileTemplateRegistryServiceContext</code> instance.
     */
    constructor() {
        super('com.asteria.helios.connector.template.context::FileTemplateRegistryServiceContext');
    }
    
    /**
     * @inheritdoc
     */
    public getName(): HeliosServiceName {
        return HeliosServiceName.TEMPLATE_REGISTRY;
    }
    
    /**
     * @inheritdoc
     */
    public getFactory(config: HeliosConfig): SpiServiceFactory {
        return new FileTemplateRegistryFactory(config);
    }
}