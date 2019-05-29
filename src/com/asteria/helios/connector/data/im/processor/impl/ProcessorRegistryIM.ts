import { Hyperion } from 'asteria-hyperion';
import { AbstractRegistry } from '../../../../../core/impl/AbstractRegistry';
import { ProcessorRegistry } from '../../../../../service/data/ProcessorRegistry';
import { AsteriaException } from 'asteria-gaia';

/**
 * An "in-memory" implementation of the <code>ProcessorRegistry</code> interface.
 */
export class ProcessorRegistryIM extends AbstractRegistry<Hyperion> implements ProcessorRegistry {

    /**
     * Create a new <code>ProcessorRegistryIM</code> instance.
     */
    constructor() {
        super('com.asteria.helios.connector.im.processor.impl::ProcessorRegistryIM');
    }

    /**
     * @inheritdoc
     */
    public start(): void {}

    /**
     * @inheritdoc
     */
    public add(processor: Hyperion, callback: (err: AsteriaException)=> void): void {
        this.MAP.set(processor.getContext().getId(), processor);
        callback(null);
    }
    
    /**
     * @inheritdoc
     */
    public remove(processor: Hyperion, callback: (err: AsteriaException)=> void): void {
        this.MAP.delete(processor.getContext().getId());
        callback(null);
    }

    /**
     * @inheritdoc
     */
    public get(id: string, callback: (err: AsteriaException, template: Hyperion)=> void): void {
        callback(null, this.MAP.get(id));
    }
}