import { ServiceContext } from '../../../../../spi/service/ServiceContext';
import { SpiServiceFactory } from '../../../../../spi/factory/SpiServiceFactory';
import { AbstractAsteriaObject } from 'asteria-gaia';
import { HeliosServiceName } from '../../../../../core/HeliosServiceName';
import { HeliosConfig } from '../../../../../core/HeliosConfig';
import { RouteConfigRegistryIMFactory } from '../factory/RouteConfigRegistryIMFactory';

/**
 * The default service context for creating Helios route registries.
 */
export class RouteConfigRegistryIMServiceContext  extends AbstractAsteriaObject implements ServiceContext {

    /**
     * Create a new <code>RouteConfigRegistryIMServiceContext</code> instance.
     */
    constructor() {
        super('com.asteria.helios.connector.im.route.context::RouteConfigRegistryIMServiceContext');
    }

    /**
     * @inheritdoc
     */
    public getName(): HeliosServiceName {
        return HeliosServiceName.ROUTE_CONFIG_REGISTRY;
    }
    
    /**
     * @inheritdoc
     */
    public getFactory(config: HeliosConfig): SpiServiceFactory {
        return new RouteConfigRegistryIMFactory(config);
    }
}