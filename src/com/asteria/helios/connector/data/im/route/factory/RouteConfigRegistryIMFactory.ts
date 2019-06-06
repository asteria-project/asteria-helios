import { RouteConfigRegistryIM } from '../impl/RouteConfigRegistryIM';
import { AbstractAsteriaObject } from 'asteria-gaia';
import { SpiServiceFactory } from '../../../../../spi/factory/SpiServiceFactory';
import { HeliosConfig } from '../../../../../core/HeliosConfig';
import { RouteConfigRegistry } from '../../../../../service/config/RouteConfigRegistry';

/**
 * The <code>RouteConfigRegistryIMFactory</code> class allows to create "in memory" <code>ProcessorRegistry</code> 
 * objects depending on the current server congig.
 */
export class RouteConfigRegistryIMFactory extends AbstractAsteriaObject implements SpiServiceFactory {

    /**
     * Create a new <code>RouteConfigRegistryIMFactory</code> instance.
     * 
     * @param {HeliosConfig} config the reference to the current server config.
     */
    constructor(config: HeliosConfig) {
        super('com.asteria.helios.connector.im.route.factory::RouteConfigRegistryIMFactory');
    }

    /**
     * Create and return a new <code>RouteConfigRegistry</code> for the current Helios server.
     * 
     * @returns {RouteConfigRegistry} a new <code>RouteConfigRegistry</code> for the current Helios server.
     */
    public create(): RouteConfigRegistry {
        return new RouteConfigRegistryIM();
    }
}