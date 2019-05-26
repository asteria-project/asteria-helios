
import { AbstractAsteriaObject, AsteriaException } from 'asteria-gaia';
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
     * @param {boolean} isDevMode indicates whether this server starts in "development mode" (<code>true</code>), or in
     *                            "production mode" (<code>true</code>).
     */
    constructor(config: HeliosConfig, isDevMode: boolean = false) {
        super('com.asteria.helios.core.impl::HeliosImpl');
        SplashScreen.create();
        this.CONTEXT = new HeliosContextImpl(config, isDevMode);
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
        this.CONTEXT.getSpiContext().lookup((err: AsteriaException)=> {
            if (err) {
                HeliosLogger.getLogger().fatal(`server initialization failed:\n${err}`);
            } else {
                try {
                    this.CONTEXT.getServer().listen(port);
                    HeliosLogger.getLogger().info(`listening conections on port ${port}`);
                    HeliosLogger.getLogger().info('server is ready for data analytics');
                } catch (e) {
                    HeliosLogger.getLogger().fatal(`server start failed:\n${e}`);
                }
            }
        });
    }
}