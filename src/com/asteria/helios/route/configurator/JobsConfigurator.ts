import { Request, Response } from 'express';
import { HeliosRouteConfigurator } from '../HeliosRouteConfigurator';
import { HeliosContext } from '../../core/HeliosContext';
import { HeliosRouter } from '../HeliosRouter';
import { HeliosRoute } from '../HeliosRoute';
import { HeliosRouterLogUtils } from '../../util/route/HeliosRouterLogUtils';
import { AbstractHeliosRouteConfigurator } from './AbstractHeliosRouteConfigurator';

/**
 * The <code>JobsConfigurator</code> class is the <code>HeliosRouteConfigurator</code> implementation to declare the
 * Helios <code>/jobs</code> route.
 */
export class JobsConfigurator extends AbstractHeliosRouteConfigurator implements HeliosRouteConfigurator {

    /**
     * Create a new <code>JobsConfigurator</code> instance.
     */
    constructor() {
        super('jobs');
    }

    /**
     * @inheritdoc
     */
    public createRoute(router: HeliosRouter, context: HeliosContext): void {
        this.createListRoute(router, context);
    }
    
    /**
     * Create the route for the <code>/jobs</code> path and the HTTP <code>GTE</code> method.
     * 
     * @param {HeliosRouter} router the reference to the internal router object of the the Helios server.
     * @param {HeliosContext} context the reference to the Helios server context.
     */
    private createListRoute(router: HeliosRouter, context: HeliosContext): void {
        const pathPattern: string = 'GET /jobs';
        router.getRouter().get(HeliosRoute.JOBS, (req: Request, res: Response) => {
            HeliosRouterLogUtils.logRoute(req, pathPattern);
            res.send('List of registered processors');
        });
       this.routeAdded(HeliosRoute.JOBS);
    }
}