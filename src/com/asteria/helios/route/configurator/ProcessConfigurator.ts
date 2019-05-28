import express from 'express';
import { HeliosRouteConfigurator } from '../HeliosRouteConfigurator';
import { HeliosContext } from '../../core/HeliosContext';
import { HeliosRouter } from '../HeliosRouter';
import { HeliosRoute } from '../HeliosRoute';
import { HeliosRouterLogUtils } from '../../util/route/HeliosRouterLogUtils';
import { ErrorUtil } from 'asteria-gaia';
import { HeliosServiceName } from '../../core/HeliosServiceName';
import { AbstractHeliosRouteConfigurator } from './AbstractHeliosRouteConfigurator';
import { HyperionConfig, Hyperion } from 'asteria-hyperion';
import { HeliosLogger } from '../../util/logging/HeliosLogger';
import { SpiContext } from '../../spi/SpiContext';

/**
 * The <code>ProcessConfigurator</code> class is the <code>HeliosRouteConfigurator</code> implementation to work with 
 * the Helios <code>/process</code> route.
 */
export class ProcessConfigurator extends AbstractHeliosRouteConfigurator implements HeliosRouteConfigurator {

    /**
     * Create a new <code>ProcessConfigurator</code> instance.
     */
    constructor() {
        super('process');
    }
    /**
     * @inheritdoc
     */
    public createRoute(router: HeliosRouter, context: HeliosContext): void {
        router.getRouter().post(HeliosRoute.PROCESS, (req: express.Request, res: express.Response) => {
            const config: HyperionConfig = req.body;
            HeliosRouterLogUtils.logRoute(req, 'POST /process');
            try {
                const processor: Hyperion = Hyperion.build(config);
                const spi: SpiContext = context.getSpiContext();
                spi.getService(HeliosServiceName.PROCESSOR_REGISTRY).add(processor);
                res.on('finish', ()=> {
                    spi.getService(HeliosServiceName.PROCESSOR_REGISTRY).remove(processor);
                });
                (processor.run() as any).pipe(res);
            } catch (e) {
                HeliosLogger.getLogger().error(e.toString());
                res.sendStatus(ErrorUtil.resolveHttpCode(e));
            }
        });
        this.routeAdded(HeliosRoute.PROCESS);
    }
}