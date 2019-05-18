import { Registry } from '../../core/Registry';
import { HeliosTemplate } from '../../../eos/business/HeliosTemplate';

/**
 * The <code>TemplateRegistry</code> interface provides access to the Helios registry where all Helios templates are
 * stored.
 */
export interface TemplateRegistry extends Registry<HeliosTemplate> {}