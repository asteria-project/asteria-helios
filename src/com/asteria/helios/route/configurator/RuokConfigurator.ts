import express from 'express';
import { HeliosRouteConfigurator } from '../HeliosRouteConfigurator';
import { HeliosContext } from '../../core/HeliosContext';
import { HeliosRouter } from '../HeliosRouter';
import { HeliosRoute } from '../HeliosRoute';
import { HeliosRouterLogUtils } from '../../util/route/HeliosRouterLogUtils';
import { HeliosLogger } from '../../util/logging/HeliosLogger';
import { AbstractHeliosRouteConfigurator } from './AbstractHeliosRouteConfigurator';

/**
 * The <code>RuokConfigurator</code> class is the <code>HeliosRouteConfigurator</code> implementation to declare the
 * Helios <code>/ruok</code> route.
 */
export class RuokConfigurator extends AbstractHeliosRouteConfigurator implements HeliosRouteConfigurator {

    /**
     * @inheritdoc
     */
    public createRoute(router: HeliosRouter, context: HeliosContext): void {
        router.getRouter().get(HeliosRoute.RUOK, (req: express.Request, res: express.Response) => {
            HeliosRouterLogUtils.logRoute(req, 'GET /ruok');
            res.send('I\'m still alive!');
        });
       this.routeAdded('/ruok');
    }
}