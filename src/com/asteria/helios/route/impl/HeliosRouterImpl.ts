import express from 'express';
import { HeliosRouter } from '../HeliosRouter';
import { HeliosLogger } from '../../util/logging/HeliosLogger';
import { AsteriaException } from 'asteria-gaia';
import { HeliosContext } from '../../core/HeliosContext';
import { HeliosServiceName } from '../../core/HeliosServiceName';
import { HeliosRouteConfigurator } from '../HeliosRouteConfigurator';

/**
 * The default implementation of the <code>HeliosRouter</code> interface.
 */
export class HeliosRouterImpl implements HeliosRouter {

    /**
     * The reference to the express <code>Router</code> object for this <code>HeliosRouterImpl</code> instance.
     */
    private readonly ROUTER: express.Router = express.Router();

    /**
     * The internal reference to the <code>HeliosContext</code> object.
     */
    private readonly CONTEXT: HeliosContext = null;

    /**
     * Create a new <code>HeliosRouterImpl</code> instance.
     * 
     * @param {HeliosContext} context the context associated with this router.
     */
    constructor(context: HeliosContext) {
        this.CONTEXT = context;
    }

    /**
     * @inheritdoc
     */
    public getRouter(): express.Router {
        return this.ROUTER;
    }

    /**
       * @inheritdoc
     */
    public lookupRoutes(callback: (err: AsteriaException)=> void): void {
        HeliosLogger.getLogger().info('initializing HTTP routes');
        this.CONTEXT.getSpiContext()
                    .getService(HeliosServiceName.ROUTE_CONFIG_REGISTRY)
                    .getAll((err: AsteriaException, configList: Array<HeliosRouteConfigurator>)=> {
                        configList.forEach((config: HeliosRouteConfigurator)=> {
                            config.createRoute(this,  this.CONTEXT);
                        });
                        HeliosLogger.getLogger().info('HTTP routes initialized');
                        callback(err);
                    });
    }
}