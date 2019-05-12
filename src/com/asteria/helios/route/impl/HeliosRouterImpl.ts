import express from 'express';
import { HeliosRouter } from '../HeliosRouter';
import { HeliosLogger } from '../../util/logging/HeliosLogger';
import { HeliosRoute } from '../HeliosRoute';
import { Hyperion, HyperionConfig } from 'asteria-hyperion';
import { ErrorUtil } from 'asteria-gaia';
import { HeliosContext } from '../../core/HeliosContext';

/**
 * The default implementation of the <code>HeliosRouter</code> interface.
 */
export class HeliosRouterImpl implements HeliosRouter {

    /**
     * The reference to the express <code>Router</code> object for this <code>HeliosRouterImpl</code> instance.
     */
    private readonly ROUTER: express.Router = express.Router();

    /**
     * Create a new <code>HeliosRouterImpl</code> instance.
     * 
     * @param {HeliosContext} context the context associated with this router.
     */
    constructor(context: HeliosContext) {
        this.initRoutes(context);
    }

    /**
     * @inheritdoc
     */
    public getRouter(): express.Router {
        return this.ROUTER;
    }

    /**
     * Initialize the routes for this router.
     * 
     * @param {HeliosContext} context the context associated with this router.
     */
    private initRoutes(context: HeliosContext): void {
        this.ruokGet(context);
        this.processPost(context);
    }

    /**
     * Print logs for the specified route.
     * 
     * @param {Request} req the Express request reference for which to print logs.
     * @param {string} route the "METHOD / route" pari for which to print logs.
     */
    private logRoute(req: express.Request, route: string): void {
        HeliosLogger.getLogger().info(`${req.hostname} ${route}`);
    }

    private ruokGet(context: HeliosContext): void {
        this.ROUTER.get(HeliosRoute.RUOK, (req: express.Request, res: express.Response) => {
            this.logRoute(req, 'GET /ruok');
            res.send('I\'m still alive!');
        });
    }

    private processPost(context: HeliosContext): void {
        this.ROUTER.post(HeliosRoute.PROCESS, (req: express.Request, res: express.Response) => {
            const config: HyperionConfig = req.body;
            this.logRoute(req, 'POST /process');
            try {
                const processor: Hyperion = Hyperion.build(config);
                (processor.run() as any).pipe(res);
            } catch (e) {
                HeliosLogger.getLogger().error(e.toString());
                res.sendStatus(ErrorUtil.resolveHttpCode(e));
            }
        });
    }
}