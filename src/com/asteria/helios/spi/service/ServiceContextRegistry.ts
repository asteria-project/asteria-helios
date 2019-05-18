import { ServiceContext } from './ServiceContext';
import { Registry } from '../../core/Registry';

/**
 * The <code>ServiceContextRegistry</code> interface provides access to the Helios registry where all Helios service
 * contexts are stored.
 */
export interface ServiceContextRegistry extends Registry<ServiceContext> {}