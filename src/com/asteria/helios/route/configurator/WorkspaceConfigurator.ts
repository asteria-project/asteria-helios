import express from 'express';
import { HeliosRouteConfigurator } from '../HeliosRouteConfigurator';
import { HeliosContext } from '../../core/HeliosContext';
import { HeliosRouter } from '../HeliosRouter';
import { HeliosRoute } from '../HeliosRoute';
import { HeliosRouterLogUtils } from '../../util/route/HeliosRouterLogUtils';
import { AbstractHeliosRouteConfigurator } from './AbstractHeliosRouteConfigurator';
import { HttpStatusCode } from 'asteria-gaia';

/**
 * The <code>WorkspaceConfigurator</code> class is the <code>HeliosRouteConfigurator</code> implementation to declare 
 * the Helios <code>/workspace</code> route.
 */
export class WorkspaceConfigurator extends AbstractHeliosRouteConfigurator implements HeliosRouteConfigurator {

    /**
     * Create a new <code>WorkspaceConfigurator</code> instance.
     */
    constructor() {
        super('workspace');
    }

    /**
     * @inheritdoc
     */
    public createRoute(router: HeliosRouter, context: HeliosContext): void {
        router.getRouter().post(HeliosRoute.WOKSPACE, (req: express.Request, res: express.Response) => {
            HeliosRouterLogUtils.logRoute(req, 'POST /workspace');
            res.sendStatus(HttpStatusCode.OK);
        });
       this.routeAdded(HeliosRoute.WOKSPACE);
    }
}