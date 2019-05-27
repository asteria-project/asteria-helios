import { Hyperion } from 'asteria-hyperion';
import { AbstractRegistry } from '../../../../../core/impl/AbstractRegistry';
import { ProcessorRegistry } from '../../../../../service/data/ProcessorRegistry';

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
    public add(processor: Hyperion): void {
        this.MAP.set(processor.getContext().getId(), processor);
    }
    
    /**
     * @inheritdoc
     */
    public remove(processor: Hyperion): void {
        this.MAP.delete(processor.getContext().getId());
    }

    /**
     * @inheritdoc
     */
    public get(id: string): Hyperion {
        return this.MAP.get(id);
    }
}