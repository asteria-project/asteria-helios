import { AbstractRegistry } from '../../../core/impl/AbstractRegistry';
import { TemplateRegistry } from '../TemplateRegistry';
import { HeliosTemplate } from 'asteria-eos';
import { FileLoader } from '../../../util/io/FileLoader';
import * as path from 'path';
import { HeliosLogger } from '../../../util/logging/HeliosLogger';
import { HeliosConfig } from '../../../core/HeliosConfig';

/**
 * An implementation of the <code>TemplateRegistry</code> interface that stores templates in the file system.
 */
export class FileTemplateRegistry extends AbstractRegistry<HeliosTemplate> implements TemplateRegistry {

    /**
     * Create a new <code>FileTemplateRegistry</code> instance.
     * 
     * @param {HeliosConfig} config the reference to the current server config.
     */
    constructor(config: HeliosConfig) {
        super('com.asteria.helios.connector.template.impl::FileTemplateRegistry');
        this.init(config);
    }

    /**
     * Initialize this registry.
     */
    private init(config: HeliosConfig): void {
        HeliosLogger.getLogger().info('initializing template registry');
        const fileLoader: FileLoader = new FileLoader();
        const filePath: string = path.join(process.cwd(), 'data', 'templates.json');
        fileLoader.loadFileSync(filePath, (input: string)=> {
            //console.log(data)
            const templates: Array<HeliosTemplate> = JSON.parse(input).data;
            templates.forEach((template: HeliosTemplate)=> {
                this.add(template);
            });
            HeliosLogger.getLogger().info('template registry initialization complete');
        });
    }

    /**
     * @inheritdoc
     */
    public add(template: HeliosTemplate): void {
        this.MAP.set(template.id, template);
    }
    
    /**
     * @inheritdoc
     */
    public remove(template: HeliosTemplate): void {
        this.MAP.delete(template.id);
    }

    /**
     * @inheritdoc
     */
    public get(id: string): HeliosTemplate {
        return this.MAP.get(id);
    }
}