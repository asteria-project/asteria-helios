import { SpiContext } from '../SpiContext';
import { AbstractAsteriaObject, AsteriaException, AsteriaErrorCode } from 'asteria-gaia';
import { ServiceContext } from '../service/ServiceContext';
import { ServiceContextRegistry } from '../service/ServiceContextRegistry';
import { SpiServiceFactory } from '../factory/SpiServiceFactory';
import { HeliosLogger } from '../../util/logging/HeliosLogger';
import { HeliosConfig } from '../../core/HeliosConfig';
import { ProcessorRegistryIMServiceContext } from '../../connector/data/im/processor/context/ProcessorRegistryIMServiceContext';
import { FileTemplateRegistryServiceContext } from '../../connector/data/file/template/context/FileTemplateRegistryServiceContext';
import { RouteConfigRegistryIMServiceContext } from '../../connector/data/im/route/context/RouteConfigRegistryIMServiceContext';
import { HeliosService } from '../../service/HeliosService';

/**
 * The <code>SpiContextImpl</code> class is the default implementation of the <code>SpiContext</code> interface.
 */
export class SpiContextImpl extends AbstractAsteriaObject implements SpiContext {

    /**
     * The reference to the current server config.
     */
    private readonly CONFIG: HeliosConfig = null;
    
    /**
     * The list of services registred for this SPI.
     */
    private readonly SERVICES: Map<string, any> = null;

    /**
     * Create a new <code>SpiContextImpl</code> instance.
     * 
     * @param {HeliosConfig} config the reference to the current server config.
     */
    constructor(config: HeliosConfig) {
        super('com.asteria.helios.spi.core::SpiContextImpl');
        this.CONFIG = config;
        this.SERVICES = new Map<string, HeliosService>();
        this.initContext();
    }

    /**
     * @inheritdoc
     */
    public addServiceContext(context: ServiceContext): void {
        HeliosLogger.getLogger().info(`adding service context: ${context.getClassName()}`);
        const factory: SpiServiceFactory = context.getFactory(this.CONFIG);
        const service: HeliosService = factory.create();
        const svcName: string = context.getName();
        this.SERVICES.set(svcName, service);
    }
    
    /**
     * @inheritdoc
     */
    public lookup(callback: (err: AsteriaException)=> void): void {
        HeliosLogger.getLogger().info('initializing services');
        try {
            const serviceList: Array<string> = Array.from(this.SERVICES.keys());
            serviceList.forEach((serviceName: string)=> {
                const service: HeliosService = this.SERVICES.get(serviceName);
                service.start();
                HeliosLogger.getLogger().info(`service "${serviceName}" started`);
            });
        } catch (e) {
            const error: AsteriaException = new AsteriaException(
                AsteriaErrorCode.INITIALIZATION_FAILURE,
                'service initialization failed',
                e.toString()
            );
            callback(error);
        }
        HeliosLogger.getLogger().info('services initialized');
        callback(null);
        
    }

    /**
     * @inheritdoc
     */
    public getService(name: string): any {
        return this.SERVICES.get(name);
    }
    
    /**
     * Initialize the service context registry for this SPI with the default Helios services.
     */
    private initContext(): void {
        HeliosLogger.getLogger().info('registering default services');
        this.addServiceContext(new RouteConfigRegistryIMServiceContext());
        this.addServiceContext(new ProcessorRegistryIMServiceContext());
        this.addServiceContext(new FileTemplateRegistryServiceContext());
        HeliosLogger.getLogger().info('default services registered');
    }
}