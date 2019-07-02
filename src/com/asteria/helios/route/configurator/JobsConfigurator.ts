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
        router.getRouter().get(HeliosRoute.JOBS, (req: Request, res: Response) => {
            HeliosRouterLogUtils.logRoute(req, 'GET /jobs');
            res.send('List of registered processors');
        });
       this.routeAdded(HeliosRoute.JOBS);
    }
}