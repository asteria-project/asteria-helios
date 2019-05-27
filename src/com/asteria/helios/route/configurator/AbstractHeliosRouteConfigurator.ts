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
     * The identifier of this route configurator object.
     */
    private readonly ID: string = null;

    /**
     * Create a new <code>AbstractHeliosRouteConfigurator</code> instance.
     * 
     * @returns {string} the identifier of this route configurator object.
     */
    protected constructor(id: string) {
        this.ID = id;
    }

    /**
     * @inheritdoc
     */
    abstract createRoute(router: HeliosRouter, context: HeliosContext): void;

    /**
     * @inheritdoc
     */
    public getId(): string {
        return this.ID;
    }

    /**
     * The <code>routeAdded</code> have to be invoked each time a route is added to the Helios server.
     * 
     * @param {string} route the string representation of this route.
     */
    protected routeAdded(route: string): void {
        HeliosLogger.getLogger().info(`route added: ${route}`);
    }
}