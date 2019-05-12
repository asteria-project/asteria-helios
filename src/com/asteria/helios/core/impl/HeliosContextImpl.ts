import express from 'express';
import helmet from 'helmet';
import * as bodyParser from 'body-parser';
import * as path from 'path';
import { Uuid } from "asteria-ouranos";
import { AbstractAsteriaObject } from 'asteria-gaia';
import { HeliosConfig } from '../../config/HeliosConfig';
import { HeliosContext } from '../HeliosContext';
import { HeliosRouterImpl } from '../../route/impl/HeliosRouterImpl';
import { HeliosRouter } from '../../route/HeliosRouter';
import { ProcessorRegistry } from '../../spi/processor/ProcessorRegistry';

/**
 * The default implementation of the <code>HeliosContext</code> interface.
 */
export class HeliosContextImpl extends AbstractAsteriaObject implements HeliosContext {

    /**
     * The internal reference to the <code>Express</code> app.
     */
    private readonly SERVER: express.Express;

    /**
     * The unique identifier for this server instance.
     */
    private readonly GUID: string;
    
    /**
     * The port used by the server for listening conections.
     */
    private readonly PORT: number;

    /**
     * The path to the workspace associated with this context.
     */
    private readonly WORKSPACE: string;

    /**
     * Create a new <code>HeliosContextImpl</code> instance.
     * 
     * @param {HeliosConfig} config the configuration for this server instance.
     */
    constructor(config: HeliosConfig) {
        super('com.asteria.helios.core.impl::HeliosContextImpl');
        this.GUID = Uuid.v4();
        this.SERVER = express();
        this.PORT = config.port;
        this.WORKSPACE = path.join(__dirname, config.workspace);
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
    public getProcessRegistry(): ProcessorRegistry {
        return null;
    }

    /**
     * Initialize this server.
     * 
     * @param {HeliosConfig} config the configuration for this server instance.
     */
    private initServer(config: HeliosConfig): void {
        const router: HeliosRouter = new HeliosRouterImpl(this);
        const path: string = config.path ? config.path : '/asteria';
        this.SERVER.use(bodyParser.json());
        this.SERVER.use(helmet());
        this.SERVER.use(path, router.getRouter());
    }
}