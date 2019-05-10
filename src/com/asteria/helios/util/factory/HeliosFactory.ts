import { Helios } from '../../core/Helios';
import { HeliosImpl } from '../../core/impl/HeliosImpl';

/**
 * The config for the server to start.
 */
import * as CONFIG from '../../../../../../cfg/server-config-dev.json';

/**
 * A static utility class for creating <code>Helios</code> objects.
 */
export class HeliosFactory {

    /**
     * Create and return a new <code>Helios</code> object.
     */
    public static create(): Helios {
        const server: Helios = new HeliosImpl(CONFIG);
        return server;
    }
}