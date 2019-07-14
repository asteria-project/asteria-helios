import { Request, Response } from 'express';
import { HeliosRouteConfigurator } from '../HeliosRouteConfigurator';
import { HeliosContext } from '../../core/HeliosContext';
import { HeliosRouter } from '../HeliosRouter';
import { HeliosRoute } from '../HeliosRoute';
import { HeliosRouterLogUtils } from '../../util/route/HeliosRouterLogUtils';
import { AbstractHeliosRouteConfigurator } from './AbstractHeliosRouteConfigurator';
import { HeliosData } from 'asteria-eos';
import { HeliosDataBuilder } from '../../util/builder/HeliosDataBuilder';

/**
 * The <code>RuokConfigurator</code> class is the <code>HeliosRouteConfigurator</code> implementation to declare the
 * Helios <code>/ruok</code> route.
 */
export class RuokConfigurator extends AbstractHeliosRouteConfigurator implements HeliosRouteConfigurator {

    /**
     * Create a new <code>RuokConfigurator</code> instance.
     */
    constructor() {
        super('ruok');
    }

    /**
     * @inheritdoc
     */
    public createRoute(router: HeliosRouter, context: HeliosContext): void {
        const pathPattern: string = 'GET /ruok';
        const message: string = 'I\'m still alive!';
        router.getRouter().get(HeliosRoute.RUOK, (req: Request, res: Response) => {
            HeliosRouterLogUtils.logRoute(req, pathPattern);
            const result: HeliosData<string> =  HeliosDataBuilder.build<string>(context.getId(), message);
            res.send(result);
        });
       this.routeAdded(HeliosRoute.RUOK);
    }
}