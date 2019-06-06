import { HeliosService } from '../HeliosService';
import { AsteriaRegistryAsync } from 'asteria-gaia';
import { HyperionModule, HyperionModuleRegistry } from 'asteria-hyperion';

/**
 * The <code>ModuleRegistry</code> interface provides access to the Helios registry where all Hyperion modules are
 * stored.
 */
export interface ModuleRegistry extends AsteriaRegistryAsync<HyperionModule>, HeliosService {

    /**
     * Return the reference to the <code>HyperionModuleRegistry</code> object used by Helios to initialize Hyperion
     * processes.
     * 
     * @returns {HyperionModuleRegistry} the reference to the <code>HyperionModuleRegistry</code> object for the current
     *                                   Helios server instance.
     */
    getHyperionModuleRegistry(): HyperionModuleRegistry;
}