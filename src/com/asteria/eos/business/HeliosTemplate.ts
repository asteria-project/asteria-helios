import { HeliosProcessDescriptor } from './HeliosProcessDescriptor';

/**
 * The <code>HeliosTemplate</code> interface represents the template used by helios to define an Asteria process.
 */
export interface HeliosTemplate {

    /**
     * The name of the template.
     */
    name: string;

    /**
     * The unique identifier for this template.
     */
    id: string;

    /**
     * The functional description of the template.
     */
    description: string;

    /**
     * The list of Asteria processes associated with this template.
     */
    processes: HeliosProcessDescriptor[];
}