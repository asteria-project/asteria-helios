
import { AbstractAsteriaObject } from 'asteria-gaia';
import { Helios } from '../Helios';
import { HeliosLogger } from '../../util/logging/HeliosLogger';
import { HeliosContext } from '../HeliosContext';
import { HeliosContextImpl } from "./HeliosContextImpl";
import { SplashScreen } from '../../util/spashscreen/SpashScreen';
import { HeliosConfig } from '../HeliosConfig';

/**
 * The default implementation of the <code>Helios</code> interface.
 */
export class HeliosImpl extends AbstractAsteriaObject implements Helios {

    /**
     * The execution context for this server instance.
     */
    private readonly CONTEXT: HeliosContext = null;

    /**
     * Create a new <code>HeliosImpl</code> instance.
     * 
     * @param {HeliosConfig} config the configuration for this server instance.
     */
    constructor(config: HeliosConfig) {
        super('com.asteria.helios.core.impl::HeliosImpl');
        SplashScreen.create();
        this.CONTEXT = new HeliosContextImpl(config);
    }

    /**
     * @inheritdoc
     */
    public getContext(): HeliosContext {
        return this.CONTEXT;
    }

    /**
     * @inheritdoc
     */
    public start(): void {
        HeliosLogger.getLogger().info('starting server');
        const port: number = this.CONTEXT.getPort();
        try {
            this.CONTEXT.getSpiContext().lookup();
            this.CONTEXT.getServer().listen(port);
            HeliosLogger.getLogger().info(`listening conections on port ${port}`);
        } catch (e) {
            HeliosLogger.getLogger().fatal(`server start failed:\n${e}`);
        }
        HeliosLogger.getLogger().info('server is ready for data analytics');
    }
}