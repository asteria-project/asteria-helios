import { HeliosConfig } from '../../../eos/config/HeliosConfig';
import { SpiContext } from '../SpiContext';
import { ProcessorRegistry } from '../processor/ProcessorRegistry';
import { AbstractAsteriaObject } from 'asteria-gaia';
import { ProcessorRegistryFactory } from '../factory/ProcessorRegistryFactory';

/**
 * The <code>SpiContextImpl</code> class is the default implementation of the <code>SpiContext</code> interface.
 */
export class SpiContextImpl extends AbstractAsteriaObject implements SpiContext {

    /**
     * The reference to the current server config.
     */
    private readonly CONFIG: HeliosConfig = null;

    /**
     * The reference to the processor registry used whithin this context.
     */
    private processorRegistry: ProcessorRegistry = null;

    /**
     * Create a new <code>SpiContextImpl</code> instance.
     * 
     * @param {HeliosConfig} config the reference to the current server config.
     */
    constructor(config: HeliosConfig) {
        super('com.asteria.helios.spi.core::SpiContextImpl');
        this.CONFIG = config;
    }

    /**
     * @inheritdoc
     */
    public getProcessorRegistry(): ProcessorRegistry {
        if (!this.processorRegistry) {
            this.initProcessorRegistry();
        }
        return this.processorRegistry;
    }
    
    /**
     * Create a <code>ProcessorRegistry</code> instance depending on the specified config.
     */
    private initProcessorRegistry(): void {
        const factory: ProcessorRegistryFactory = new ProcessorRegistryFactory(this.CONFIG);
        this.processorRegistry = factory.create();
    }
}