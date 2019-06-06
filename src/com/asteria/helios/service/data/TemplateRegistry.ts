import { HeliosTemplate } from 'asteria-eos';
import { HeliosService } from '../HeliosService';
import { AsteriaRegistryAsync } from 'asteria-gaia';

/**
 * The <code>TemplateRegistry</code> interface provides access to the Helios registry where all Helios templates are
 * stored.
 */
export interface TemplateRegistry extends AsteriaRegistryAsync<HeliosTemplate>, HeliosService {}