import { AbstractRegistry } from '../../core/impl/AbstractRegistry';
import { ServiceContext } from '../service/ServiceContext';
import { ServiceContextRegistry } from '../service/ServiceContextRegistry';
import { AsteriaException } from 'asteria-gaia';

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
    public add(service: ServiceContext, callback: (err: AsteriaException)=> void): void {
        this.MAP.set(service.getName(), service);
        callback(null);
    }
    
    /**
     * @inheritdoc
     */
    public remove(service: ServiceContext, callback: (err: AsteriaException)=> void): void {
        this.MAP.delete(service.getName());
        callback(null);
    }

    /**
     * @inheritdoc
     */
    public get(id: string, callback: (err: AsteriaException, item: ServiceContext)=> void): void {
        callback(null, this.MAP.get(id));
    }
}