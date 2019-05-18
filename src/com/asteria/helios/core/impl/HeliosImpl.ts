
import { AbstractAsteriaObject } from 'asteria-gaia';
import { Helios } from '../Helios';
import { HeliosLogger } from '../../util/logging/HeliosLogger';
import { HeliosContext } from '../HeliosContext';
import { HeliosContextImpl } from "./HeliosContextImpl";
import { SplashScreen } from '../../util/spashscreen/SpashScreen';
import { HeliosConfig } from '../../../eos/config/HeliosConfig';

/**
 * The default implementation of the <code>Helios</code> interface.
 */
export class HeliosImpl extends AbstractAsteriaObject implements Helios {

    /**
     * The execution context for this server instance.
     */
    private readonly CONTEXT: HeliosContext;

    /**
     * Create a new <code>HeliosImpl</code> instance.
     * 
     * @param {HeliosConfig} config the configuration for this server instance.
     */
    constructor(config: HeliosConfig) {
        super('com.asteria.helios.core.impl::HeliosImpl');
        SplashScreen.create();
        this.CONTEXT = new HeliosContextImpl(config);
        HeliosLogger.getLogger().info(`server created with ID: ${this.CONTEXT.getId()}`);
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
        HeliosLogger.getLogger().info('server started');
        const port: number = this.CONTEXT.getPort();
        try {
            this.CONTEXT.getServer().listen(port);
            HeliosLogger.getLogger().info(`listening conections on port ${port}`);
        } catch (e) {
            HeliosLogger.getLogger().fatal(`server start failed:\n${e}`);
        }
    }
}