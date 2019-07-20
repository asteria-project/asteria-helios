import { Request, Response } from 'express';
import { HeliosRouteConfigurator } from '../HeliosRouteConfigurator';
import { HeliosContext } from '../../core/HeliosContext';
import { HeliosRouter } from '../HeliosRouter';
import { HeliosRoute } from '../HeliosRoute';
import { HeliosRouterLogUtils } from '../../util/route/HeliosRouterLogUtils';
import { AbstractHeliosRouteConfigurator } from './AbstractHeliosRouteConfigurator';
import { HeliosData } from 'asteria-eos';
import { HeliosDataBuilder } from '../../util/builder/HeliosDataBuilder';
import { RsState, StateType, HttpMethod, RsTransition } from 'jsax-rs';

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

    public createRoute(router: HeliosRouter, context: HeliosContext): void {
        this.ruok(router, context);
        this.routeAdded(HeliosRoute.RUOK);
    }
    
    /**
     * Create the route for the <code>/ruok</code> resource path.
     * 
     * @param {HeliosRouter} router the reference to the internal router object of the the Helios server.
     * @param {HeliosContext} context the reference to the Helios server context.
     */
    @RsState({
        resource: '/ruok',
        type: StateType.INVARIANT
    })
    @RsTransition({
        type: StateType.COLLECTION,
        resource: '/jobs'
    })
    private ruok(router: HeliosRouter, context: HeliosContext): void {
        const pathPattern: string = 'GET /ruok';
        const stateName: string = 'ruok';
        const message: string = 'I\'m still alive!';
        router.getRouter().get(HeliosRoute.RUOK, (req: Request, res: Response) => {
            HeliosRouterLogUtils.logRoute(req, pathPattern);
            const result: HeliosData<string> =  HeliosDataBuilder.build<string>(context.getId(), message, stateName);
            res.send(result);
        });
    }
}