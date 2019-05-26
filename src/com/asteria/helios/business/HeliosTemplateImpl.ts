import { HeliosTemplate, HeliosProcessDescriptor } from 'asteria-eos';

/**
 * The default implementation of the <code>HeliosTemplate</code> interface.
 */
export class HeliosTemplateImpl implements HeliosTemplate {

    /**
     * @inheritdoc
     */
    public readonly id: string = null;

    /**
     * @inheritdoc
     */
    public readonly name: string = null;

    /**
     * @inheritdoc
     */
    public description: string = null;
    
    /**
     * @inheritdoc
     */
    public processes: Array<HeliosProcessDescriptor> = null;

    /**
     * Create a new <code>HeliosTemplateImpl</code> instance.
     * 
     * @param {string} id the Unique Idenfier for this object.
     * @param {string} name the name for this <code>HeliosTemplateImpl</code> instance.
     */
    constructor(id: string, name: string) {
        this.id = id;
        this.name = name;
    }
}