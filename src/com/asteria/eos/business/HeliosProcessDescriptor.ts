/**
 * The <code>HeliosProcessDescriptor</code> interface represents the description of an Asteria process in helios.
 */
export interface HeliosProcessDescriptor {

    /**
     * The type of the template represented by this descriptor.
     */
    type: string;

    /**
     * The config of the template represented by this descriptor.
     */
    config: any;
}