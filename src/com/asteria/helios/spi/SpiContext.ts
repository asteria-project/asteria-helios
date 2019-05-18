import { ProcessorRegistry } from './processor/ProcessorRegistry';

/**
 * The <code>SpiContext</code> interface defines the API the Helios Service Provider Interface.
 */
export interface SpiContext {

    /**
     * Return the reference to the registry where all Hyperion processors are stored.
     * 
     * @returns {ProcessorRegistry} the reference to the registry where all Hyperion processors are stored.
     */
    getProcessorRegistry(): ProcessorRegistry;
}