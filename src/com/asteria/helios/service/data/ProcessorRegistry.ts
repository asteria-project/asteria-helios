import { Hyperion } from 'asteria-hyperion';
import { Registry } from '../../core/Registry';
import { HeliosService } from '../HeliosService';


/**
 * The <code>ProcessorRegistry</code> interface provides access to the Helios registry where all Hyperion processors are
 * stored.
 */
export interface ProcessorRegistry extends Registry<Hyperion>, HeliosService {}