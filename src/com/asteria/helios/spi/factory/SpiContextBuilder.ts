import { HeliosConfig } from '../../../eos/config/HeliosConfig';
import { SpiContext } from '../SpiContext';
import { SpiContextImpl } from '../core/SpiContextImpl';
import { AbstractAsteriaObject } from 'asteria-gaia';

/**
 * The <code>SpiContextBuilder</code> class allows to create <code>SpiContext</code> objects depending on the current 
 * server congig.
 */
export class SpiContextBuilder extends AbstractAsteriaObject {

    /**
     * Create a new <code>SpiContextBuilder</code> instance.
     */
    constructor() {
        super('com.asteria.helios.spi.factory::SpiContextBuilder');
    }

    /**
     * Build and return a new <code>SpiContext</code> for the current Helios server.
     * 
     * @param {HeliosConfig} config the reference to the current server config.
     * 
     * @returns {SpiContext} a new <code>SpiContext</code> for the current Helios server.
     */
    public build(config: HeliosConfig): SpiContext {
        return new SpiContextImpl(config);
    }
}