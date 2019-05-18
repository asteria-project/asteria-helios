import { SpiContext } from '../SpiContext';
import { AbstractAsteriaObject } from 'asteria-gaia';
import { ServiceContext } from '../service/ServiceContext';
import { ProcessorRegistryIMServiceContext } from '../../connector/processor/context/ProcessorRegistryIMServiceContext';
import { ServiceContextRegistryImpl } from './ServiceContextRegistryImpl';
import { ServiceContextRegistry } from '../service/ServiceContextRegistry';
import { SpiServiceFactory } from '../factory/SpiServiceFactory';
import { HeliosLogger } from '../../util/logging/HeliosLogger';
import { FileTemplateRegistryServiceContext } from '../../connector/template/context/FileTemplateRegistryServiceContext';
import { HeliosConfig } from '../../core/HeliosConfig';

/**
 * The <code>SpiContextImpl</code> class is the default implementation of the <code>SpiContext</code> interface.
 */
export class SpiContextImpl extends AbstractAsteriaObject implements SpiContext {

    /**
     * The reference to the current server config.
     */
    private readonly CONFIG: HeliosConfig = null;

    /**
     * The service context registry for this SPI.
     */
    private readonly SERVICE_CONTEXT_REGISTRY: ServiceContextRegistry = null;
    
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
        this.SERVICE_CONTEXT_REGISTRY = this.createContext();
        this.SERVICES = new Map<string, any>();
        this.initContext();
    }

    /**
     * @inheritdoc
     */
    public addServiceContext(context: ServiceContext): void {
        HeliosLogger.getLogger().info(`adding service context: ${context.getClassName()}`);
        this.SERVICE_CONTEXT_REGISTRY.add(context);
    }
    
    /**
     * @inheritdoc
     */
    public lookup(): void {
        HeliosLogger.getLogger().info('initializing services');
        this.SERVICE_CONTEXT_REGISTRY.getIds().forEach((id: string)=> {
            const ctx: ServiceContext = this.SERVICE_CONTEXT_REGISTRY.get(id);
            const factory: SpiServiceFactory = ctx.getFactory(this.CONFIG);
            const service: any = factory.create();
            const svcName: string = ctx.getName();
            this.SERVICES.set(svcName, service);
            HeliosLogger.getLogger().info(`service "${svcName}" started`);
        });
        HeliosLogger.getLogger().info('services initialized');
    }

    /**
     * @inheritdoc
     */
    public getService(name: string): any {
        return this.SERVICES.get(name);
    }

    /**
     * Create and return the service context registry for this SPI.
     * 
     * @return {ServiceContextRegistry} the service context registry for this SPI.
     */
    private createContext(): ServiceContextRegistry {
        return new ServiceContextRegistryImpl();
    }
    
    /**
     * Initialize the service context registry for this SPI with the default Helios services.
     */
    private initContext(): void {
        this.addServiceContext(new ProcessorRegistryIMServiceContext());
        this.addServiceContext(new FileTemplateRegistryServiceContext());
    }
}