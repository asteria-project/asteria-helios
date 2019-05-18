import { HeliosConfig } from '../../../eos/config/HeliosConfig';
import { SpiContext } from '../SpiContext';
import { SpiContextImpl } from '../core/SpiContextImpl';
import { AbstractAsteriaObject } from 'asteria-gaia';

/**
 * The <code>SpiContextFactory</code> class allows to create <code>SpiContext</code> objects depending on the current 
 * server congig.
 */
export class SpiContextFactory extends AbstractAsteriaObject {

    /**
     * The reference to the current server config.
     */
    private readonly CONFIG: HeliosConfig = null;

    /**
     * Create a new <code>ProcessorRegistryFactory</code> instance.
     * 
     * @param {HeliosConfig} config the reference to the current server config.
     */
    constructor(config: HeliosConfig) {
        super('com.asteria.helios.spi.factory::SpiContextFactory');
        this.CONFIG = config;
    }

    /**
     * Create and return a new <code>SpiContext</code> for the current Helios server.
     * 
     * @returns {SpiContext} a new <code>SpiContext</code> for the current Helios server.
     */
    public create(): SpiContext {
        return new SpiContextImpl(this.CONFIG);
    }
}