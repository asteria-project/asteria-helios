import { ServiceContext } from './ServiceContext';
import { AsteriaRegistryAsync } from 'asteria-gaia';

/**
 * The <code>ServiceContextRegistry</code> interface provides access to the Helios registry where all Helios service
 * contexts are stored.
 */
export interface ServiceContextRegistry extends AsteriaRegistryAsync<ServiceContext> {}