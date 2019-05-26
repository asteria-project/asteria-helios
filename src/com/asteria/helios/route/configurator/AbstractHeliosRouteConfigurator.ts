import { HeliosRouteConfigurator } from '../HeliosRouteConfigurator';
import { HeliosContext } from '../../core/HeliosContext';
import { HeliosRouter } from '../HeliosRouter';
import { HeliosLogger } from '../../util/logging/HeliosLogger';

/**
 * The <code>AbstractHeliosRouteConfigurator</code> class is the base class for all
 * <code>HeliosRouteConfigurator</code> implementation.
 */
export abstract class AbstractHeliosRouteConfigurator implements HeliosRouteConfigurator {

    /**
     * @inheritdoc
     */
    abstract createRoute(router: HeliosRouter, context: HeliosContext): void;

    /**
     * The <code>routeAdded</code> have to be invoked each time a route is added to the Helios server.
     * 
     * @param {string} route the string representation of this route.
     */
    protected routeAdded(route: string): void {
        HeliosLogger.getLogger().info(`route added: ${route}`);
    }
}