import * as path from 'path';
import { Uuid } from 'asteria-ouranos';
import { AbstractAsteriaObject } from 'asteria-gaia';
import { HeliosContext } from '../HeliosContext';
import { SpiContext } from '../../spi/SpiContext';
import { SpiContextBuilder } from '../../spi/factory/SpiContextBuilder';
import { HeliosLogger } from '../../util/logging/HeliosLogger';
import { HeliosConfig } from '../HeliosConfig';
import { HeliosServer } from '../HeliosServer';
import { HeliosServerImpl } from './HeliosServerImpl';
import { Root } from '../Root';

/**
 * The default implementation of the <code>HeliosContext</code> interface.
 */
export class HeliosContextImpl extends AbstractAsteriaObject implements HeliosContext {

    /**
     * The internal reference to the <code>HeliosServer</code> object.
     */
    private readonly SERVER: HeliosServer = null;

    /**
     * The unique identifier for this server instance.
     */
    private readonly GUID: string = null;

    /**
     * The path to the workspace associated with this context.
     */
    private readonly WORKSPACE: string = null;

    /**
     * The reference to the SPI context used whithin this context.
     */
    private readonly SPI_CONTEXT: SpiContext = null;

    /**
     * The port used by the context server for listening conections.
     */
    private readonly PORT: number = null;

    /**
     * The the Helios application path.
     */
    private readonly PATH: string = null;

    /**
     * Indicates whether the server started in development  in "development mode" (<code>true</code>), or in
     * "production mode" (<code>true</code>).
     */
    private readonly IS_DEV_MODE: boolean = false;

    /**
     * Create a new <code>HeliosContextImpl</code> instance.
     * 
     * @param {HeliosConfig} config the configuration for this server instance.
     * @param {boolean} isDevMode indicates whether this server starts in "development mode" (<code>true</code>), or in
     *                            "production mode" (<code>true</code>).
     */
    constructor(config: HeliosConfig, isDevMode: boolean = false) {
        super('com.asteria.helios.core.impl::HeliosContextImpl');
        HeliosLogger.getLogger().info('initializing server context');
        this.IS_DEV_MODE = isDevMode;
        if (this.IS_DEV_MODE) {
            HeliosLogger.getLogger().warn('server is running in development mode');
        }
        this.GUID = Uuid.v4();
        this.PORT = config.port;
        this.PATH = config.path ? config.path : Root.DEFAULT_PATH;
        HeliosLogger.getLogger().info(`server created with ID: ${this.GUID}`);
        this.SERVER = new HeliosServerImpl(this);
        this.WORKSPACE = path.join(process.cwd(), config.workspace);
        this.SPI_CONTEXT = this.initSpiContext(config);
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
    public isDevMode(): boolean {
        return this.IS_DEV_MODE;
    }

    /**
     * @inheritdoc
     */
    public getServer(): HeliosServer {
        return this.SERVER;
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
    public getPath(): string {
        return this.PATH;
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