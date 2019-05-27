import { HeliosService } from '../../service/HeliosService';

/**
 * The <code>SpiServiceFactory</code> class allows to create service factories that are implemented whithin a
 * <code>ServiceContext</code> implementation.
 */
export interface SpiServiceFactory {

    /**
     * Create and return a new service object for the current Helios server.
     * 
     * @returns {HeliosService} a new service object for the current Helios server.
     */
    create(): HeliosService;
}