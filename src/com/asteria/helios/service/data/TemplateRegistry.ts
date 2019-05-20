import { Registry } from '../../core/Registry';
import { HeliosTemplate } from 'asteria-eos';

/**
 * The <code>TemplateRegistry</code> interface provides access to the Helios registry where all Helios templates are
 * stored.
 */
export interface TemplateRegistry extends Registry<HeliosTemplate> {}