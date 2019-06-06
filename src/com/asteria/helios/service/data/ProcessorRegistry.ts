import { Hyperion } from 'asteria-hyperion';
import { HeliosService } from '../HeliosService';
import { AsteriaRegistryAsync } from 'asteria-gaia';


/**
 * The <code>ProcessorRegistry</code> interface provides access to the Helios registry where all Hyperion processors are
 * stored.
 */
export interface ProcessorRegistry extends AsteriaRegistryAsync<Hyperion>, HeliosService {}