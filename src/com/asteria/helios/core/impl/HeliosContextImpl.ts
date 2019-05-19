import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import * as bodyParser from 'body-parser';
import * as path from 'path';
import { Uuid } from 'asteria-ouranos';
import { AbstractAsteriaObject } from 'asteria-gaia';
import { HeliosContext } from '../HeliosContext';
import { HeliosRouterImpl } from '../../route/impl/HeliosRouterImpl';
import { HeliosRouter } from '../../route/HeliosRouter';
import { SpiContext } from '../../spi/SpiContext';
import { SpiContextBuilder } from '../../spi/factory/SpiContextBuilder';
import { HeliosLogger } from '../../util/logging/HeliosLogger';
import { HeliosConfig } from '../HeliosConfig';
import { Root } from '../Root';

/**
 * The default implementation of the <code>HeliosContext</code> interface.
 */
export class HeliosContextImpl extends AbstractAsteriaObject implements HeliosContext {

    /**
     * The internal reference to the <code>Express</code> app.
     */
    private readonly SERVER: express.Express = null;

    /**
     * The unique identifier for this server instance.
     */
    private readonly GUID: string = null;
    
    /**
     * The port used by the server for listening conections.
     */
    private readonly PORT: number = null;

    /**
     * The path to the workspace associated with this context.
     */
    private readonly WORKSPACE: string = null;

    /**
     * The reference to the SPI context used whithin this context.
     */
    private readonly SPI_CONTEXT: SpiContext = null;

    /**
     * Create a new <code>HeliosContextImpl</code> instance.
     * 
     * @param {HeliosConfig} config the configuration for this server instance.
     */
    constructor(config: HeliosConfig) {
        super('com.asteria.helios.core.impl::HeliosContextImpl');
        HeliosLogger.getLogger().info('initializing server context');
        this.GUID = Uuid.v4();
        HeliosLogger.getLogger().info(`server created with ID: ${this.GUID}`);
        this.SERVER = express();
        this.PORT = config.port;
        this.WORKSPACE = path.join(__dirname, config.workspace);
        this.SPI_CONTEXT = this.initSpiContext(config);
        this.initServer(config);
    }

    /**
     * @inheritdoc
     */
    public getServer(): express.Express {
        return this.SERVER;
    }

    /**
     * @inheritdoc
     */
    public getId(): string {
        return this.GUID;
    }

    /**
     * @inheritdoc
     */
    public getPort(): number {
        return this.PORT;
    }
    
    /**
     * @inheritdoc
     */
    public getWorkspace(): string {
        return this.WORKSPACE;
    }

    /**
     * @inheritdoc
     */
    public getSpiContext(): SpiContext {
        return this.SPI_CONTEXT;
    }

    /**
     * Initialize this server.
     * 
     * @param {HeliosConfig} config the configuration for this server instance.
     */
    private initServer(config: HeliosConfig): void {
        const router: HeliosRouter = new HeliosRouterImpl(this);
        const path: string = config.path ? config.path : Root.DEFAULT_PATH;
        this.SERVER.use(cors()); // TODO: implement cors config
        this.SERVER.use(bodyParser.json());
        this.SERVER.use(helmet());
        this.SERVER.use(path, router.getRouter());
    }

    /**
     * Create and return a new <code>SpiContext</code> object depending on the specified config.
     * 
     * @param {HeliosConfig} config the configuration for this server instance.
     * 
     * @returns a new <code>SpiContext</code> instance.
     */
    private initSpiContext(config: HeliosConfig): SpiContext {
        const builder: SpiContextBuilder = new SpiContextBuilder();
        return builder.build(config);
    }
}