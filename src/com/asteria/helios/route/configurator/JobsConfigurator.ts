import express from 'express';
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
     * @inheritdoc
     */
    public createRoute(router: HeliosRouter, context: HeliosContext): void {
        router.getRouter().get(HeliosRoute.JOBS, (req: express.Request, res: express.Response) => {
            HeliosRouterLogUtils.logRoute(req, 'GET /jobs');
            res.send('List of registered processors');
        });
       this.routeAdded('/jobs');
    }
}