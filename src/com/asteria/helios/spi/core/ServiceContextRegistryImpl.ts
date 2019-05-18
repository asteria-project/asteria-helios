import { AbstractRegistry } from '../../core/impl/AbstractRegistry';
import { ServiceContext } from '../service/ServiceContext';
import { ServiceContextRegistry } from '../service/ServiceContextRegistry';

/**
 * The <code>ServiceRegistryImpl</code> class is the default implementation of the <code>ServiceContextRegistry</code>
 * interface.
 */
export class ServiceContextRegistryImpl extends AbstractRegistry<ServiceContext> implements ServiceContextRegistry {

    /**
     * Create a new <code>ServiceRegistryImpl</code> instance.
     */
    constructor() {
        super('com.asteria.helios.spi.core::ServiceContextRegistryImpl');
    }
    
    /**
     * @inheritdoc
     */
    public add(service: ServiceContext): void {
        this.MAP.set(service.getName(), service);
    }
    
    /**
     * @inheritdoc
     */
    public remove(service: ServiceContext): void {
        this.MAP.delete(service.getName());
    }

    /**
     * @inheritdoc
     */
    public get(id: string): ServiceContext {
        return this.MAP.get(id);
    }
}