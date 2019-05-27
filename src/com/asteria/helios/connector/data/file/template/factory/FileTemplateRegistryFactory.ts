import { AbstractAsteriaObject } from 'asteria-gaia';
import { SpiServiceFactory } from '../../../../../spi/factory/SpiServiceFactory';
import { FileTemplateRegistry } from '../impl/FileTemplateRegistry';
import { HeliosConfig } from '../../../../../core/HeliosConfig';
import { TemplateRegistry } from '../../../../../service/data/TemplateRegistry';

/**
 * The <code>ProcessorRegistryIMFactory</code> class allows to create "in memory" <code>ProcessorRegistry</code> 
 * objects depending on the current server congig.
 */
export class FileTemplateRegistryFactory extends AbstractAsteriaObject implements SpiServiceFactory {

    /**
     * The reference to the current server config.
     */
    private readonly CONGIG: HeliosConfig = null;

    /**
     * Create a new <code>ProcessorRegistryFactory</code> instance.
     * 
     * @param {HeliosConfig} config the reference to the current server config.
     */
    constructor(config: HeliosConfig) {
        super('com.asteria.helios.connector.file.template.factory::FileTemplateRegistryFactory');
        this.CONGIG = config;
    }

    /**
     * Create and return a new <code>TemplateRegistry</code> for the current Helios server.
     * 
     * @returns {TemplateRegistry} a new <code>TemplateRegistry</code> for the current Helios server.
     */
    public create(): TemplateRegistry {
        const registry: TemplateRegistry = new FileTemplateRegistry(this.CONGIG);
        return registry;
    }
}