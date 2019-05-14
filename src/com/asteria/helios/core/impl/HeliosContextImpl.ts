import express from 'express';
import helmet from 'helmet';
import * as bodyParser from 'body-parser';
import * as path from 'path';
import { Uuid } from "asteria-ouranos";
import { AbstractAsteriaObject } from 'asteria-gaia';
import { HeliosConfig } from '../../../eos/config/HeliosConfig';
import { HeliosContext } from '../HeliosContext';
import { HeliosRouterImpl } from '../../route/impl/HeliosRouterImpl';
import { HeliosRouter } from '../../route/HeliosRouter';
import { ProcessorRegistry } from '../../spi/processor/ProcessorRegistry';
import { ProcessorRegistryFactory } from '../../spi/processor/factory/ProcessorRegistryFactory';

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
     * The reference to the processor registry used whithin this context.
     */
    private readonly PROCESSOR_REGISTRY: ProcessorRegistry;

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
        this.PROCESSOR_REGISTRY = this.initProcessorRegistry(config);
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
        return this.PROCESSOR_REGISTRY;
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

    /**
     * Create and return a new <code>ProcessorRegistry</code> instance depending on the specified config.
     * 
     * @param {HeliosConfig} config the configuration for this server instance.
     * 
     * @returns a new <code>ProcessorRegistry</code> instance.
     */
    private initProcessorRegistry(config: HeliosConfig): ProcessorRegistry {
        const factory: ProcessorRegistryFactory = new ProcessorRegistryFactory(config);
        return factory.create();
    }
}