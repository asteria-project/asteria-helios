import { Uuid } from 'asteria-ouranos';
import { HeliosTemplate } from 'asteria-eos';
import { HeliosTemplateImpl } from '../../business/HeliosTemplateImpl';

/**
 * A static builder that provides methods for creating new <code>HeliosTemplate</code> objects.
 */
export class HeliosTemplateBuilder {

    /**
     * Return a new <code>HeliosTemplate</code> object built from the partial template sent through the body of an HTTP
     * POST method.
     * 
     * @param {HeliosTemplate} partialTemplate  the partial template sent through the body of an HTTP POST method.
     * 
     * @returns {HeliosTemplate} a new <code>HeliosTemplate</code> object.
     */
    public static buildFromBody(partialTemplate: HeliosTemplate): HeliosTemplate {
        const uuid: string = Uuid.v4();
        const template: HeliosTemplate = new HeliosTemplateImpl(uuid, partialTemplate.name);
        template.description = partialTemplate.description;
        template.processes = partialTemplate.processes;
        return template;
    }
}