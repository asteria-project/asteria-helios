import express from 'express';
import { HeliosRouter } from '../HeliosRouter';
import { HeliosLogger } from '../../util/logging/HeliosLogger';
import { HeliosRoute } from '../HeliosRoute';
import { Hyperion, HyperionConfig } from 'asteria-hyperion';
import { ErrorUtil, AsteriaException } from 'asteria-gaia';
import { HeliosContext } from '../../core/HeliosContext';
import { SpiContext } from '../../spi/SpiContext';
import { HeliosServiceName } from '../../core/HeliosServiceName';
import { HeliosRouterLogUtils } from '../../util/route/HeliosRouterLogUtils';
import { RuokConfigurator } from '../configurator/RuokConfigurator';
import { TemplatesConfigurator } from '../configurator/TemplatesConfigurator';
import { JobsConfigurator } from '../configurator/JobsConfigurator';

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
        this.ruok(this.CONTEXT);
        this.process(this.CONTEXT);
        this.jobs(this.CONTEXT);
        this.templates(this.CONTEXT);
        HeliosLogger.getLogger().info('HTTP routes initialized');
        callback(null);
    }

    private ruok(context: HeliosContext): void {
        new RuokConfigurator().createRoute(this, context);
    }

    private process(context: HeliosContext): void {
        this.ROUTER.post(HeliosRoute.PROCESS, (req: express.Request, res: express.Response) => {
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
    }

    private jobs(context: HeliosContext): void {
        new JobsConfigurator().createRoute(this, context);
    }
    
    private templates(context: HeliosContext): void {
        new TemplatesConfigurator().createRoute(this, context);
    }
}