import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import * as bodyParser from 'body-parser';
import { AbstractAsteriaObject, AsteriaException } from 'asteria-gaia';
import { HeliosRouterImpl } from '../../route/impl/HeliosRouterImpl';
import { HeliosRouter } from '../../route/HeliosRouter';
import { HeliosConfig } from '../HeliosConfig';
import { HeliosServer } from '../HeliosServer';
import { HeliosLogger } from '../../util/logging/HeliosLogger';
import { HeliosContext } from '../HeliosContext';

/**
 * The default implementation of the <code>HeliosServer</code> interface.
 */
export class HeliosServerImpl extends AbstractAsteriaObject implements HeliosServer {

    /**
     * The internal reference to the <code>Express</code> app.
     */
    private readonly SERVER: express.Express = null;
    
    /**
     * The internal reference to the <code>HeliosRouter</code> object.
     */
    private readonly ROUTER: HeliosRouter = null;

    /**
     * The execution context for this server instance.
     */
    private readonly CONTEX: HeliosContext = null;

    /**
     * Create a new <code>HeliosServerImpl</code> instance.
     * 
     * @param {HeliosContext} context the execution context for this server instance.
     */
    constructor(context: HeliosContext) {
        super('com.asteria.helios.core.impl::HeliosServerImpl');
        this.SERVER = express();
        this.CONTEX = context,
        this.ROUTER = new HeliosRouterImpl(this.CONTEX);
    }

    /**
     * @inheritdoc
     */
    public start(): void {
        this.ROUTER.lookupRoutes((err: AsteriaException)=> {
            this.initServer();
            HeliosLogger.getLogger().info(`listening conections on port ${this.CONTEX.getPort()}`);
        });
    }
    
    /**
     * @inheritdoc
     */
    public getRouter(): HeliosRouter {
        return this.ROUTER;
    }

    /**
     * Initialize this server.
     */
    private initServer(): void {
        this.SERVER.use(cors()); // TODO: implement cors config
        this.SERVER.use(bodyParser.json());
        this.SERVER.use(helmet());
        this.SERVER.use(this.CONTEX.getPath(), this.ROUTER.getRouter());
        this.SERVER.listen(this.CONTEX.getPort());
    }
}