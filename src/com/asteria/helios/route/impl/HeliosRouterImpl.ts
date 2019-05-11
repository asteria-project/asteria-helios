import express from 'express';
import { HeliosRouter } from '../HeliosRouter';
import { HeliosLogger } from '../../util/logging/HeliosLogger';
import { HeliosRoute } from '../HeliosRoute';
import { Hyperion, HyperionConfig } from 'asteria-hyperion';

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
     */
    constructor() {
        this.initRoutes();
    }

    /**
     * @inheritdoc
     */
    public getRouter(): express.Router {
        return this.ROUTER;
    }

    /**
     * Initialize the routes for this router.
     */
    private initRoutes(): void {
        this.ruokGet();
        this.processPost();
    }

    private logRoute(req: express.Request, route: string): void {
        HeliosLogger.getLogger().info(`${req.hostname} ${route}`);
    }

    private ruokGet(): void {
        this.ROUTER.get(HeliosRoute.RUOK, (req: express.Request, res: express.Response) => {
            this.logRoute(req, 'GET /ruok');
            res.send('I\'m still alive!');
        });
    }

    private processPost(): void {
        this.ROUTER.post(HeliosRoute.PROCESS, (req: express.Request, res: express.Response) => {
            const config: HyperionConfig = req.body;
            this.logRoute(req, 'POST /process');
            try {
                // TODO add hyperion errors
                const processor: Hyperion = Hyperion.build(config);
                (processor.run() as any).pipe(res);
            } catch (e) {
                HeliosLogger.getLogger().error(e.toString());
                res.sendStatus(500);
            }
        });
    }
}