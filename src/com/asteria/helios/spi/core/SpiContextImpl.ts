import { SpiContext } from '../SpiContext';
import { AbstractAsteriaObject, AsteriaException } from 'asteria-gaia';
import { ServiceContext } from '../service/ServiceContext';
import { ServiceContextRegistryImpl } from './ServiceContextRegistryImpl';
import { ServiceContextRegistry } from '../service/ServiceContextRegistry';
import { SpiServiceFactory } from '../factory/SpiServiceFactory';
import { HeliosLogger } from '../../util/logging/HeliosLogger';
import { HeliosConfig } from '../../core/HeliosConfig';
import { ProcessorRegistryIMServiceContext } from '../../connector/data/file/processor/context/ProcessorRegistryIMServiceContext';
import { FileTemplateRegistryServiceContext } from '../../connector/data/file/template/context/FileTemplateRegistryServiceContext';

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
        this.SERVICE_CONTEXT_REGISTRY.add(context, (err:AsteriaException)=> {
            if (err) {
                throw err;
            }
        });
    }
    
    /**
     * @inheritdoc
     */
    public lookup(callback: (err:AsteriaException)=> void): void {
        HeliosLogger.getLogger().info('initializing services');
        this.SERVICE_CONTEXT_REGISTRY.getIds((err:AsteriaException, ids:Array<string>)=> {
            if (err) {
                callback(err);
            }
            let cursor: number = ids.length;
            ids.forEach((id: string)=> {
                this.SERVICE_CONTEXT_REGISTRY.get(id, (err: AsteriaException, ctx: ServiceContext)=> {
                    if (err) {
                        callback(err);
                    }
                    const factory: SpiServiceFactory = ctx.getFactory(this.CONFIG);
                    const service: any = factory.create();
                    const svcName: string = ctx.getName();
                    this.SERVICES.set(svcName, service);
                    cursor--;
                    HeliosLogger.getLogger().info(`service "${svcName}" started`);
                    if(cursor === 0) {
                        HeliosLogger.getLogger().info('services initialized');
                        callback(null);
                    }
                });
            });
        });
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