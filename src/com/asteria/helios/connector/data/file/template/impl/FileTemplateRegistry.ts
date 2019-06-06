import { HeliosTemplate } from 'asteria-eos';
import { FileLoader } from '../../../../../util/io/FileLoader';
import * as path from 'path';
import { HeliosLogger } from '../../../../../util/logging/HeliosLogger';
import { HeliosConfig } from '../../../../../core/HeliosConfig';
import { TemplateRegistry } from '../../../../../service/data/TemplateRegistry';
import { FileWriter } from '../../../../../util/io/FileWriter';
import { AsteriaException, AbstractAsteriaRegistryAsync } from 'asteria-gaia';

/**
 * An implementation of the <code>TemplateRegistry</code> interface that stores templates in the file system.
 */
export class FileTemplateRegistry extends AbstractAsteriaRegistryAsync<HeliosTemplate> implements TemplateRegistry {

    /**
     * The reference to the Helios server config.
     */
    private readonly CONFIG: HeliosConfig = null;

    /**
     * The path to the templates file.
     */
    private readonly FILE_PATH: string = null;

    /**
     * Create a new <code>FileTemplateRegistry</code> instance.
     * 
     * @param {HeliosConfig} config the reference to the current server config.
     */
    constructor(config: HeliosConfig) {
        super('com.asteria.helios.connector.file.template.impl::FileTemplateRegistry');
        this.FILE_PATH = path.join(process.cwd(), 'server', 'data', 'templates.json');
        this.CONFIG = config;
    }

    /**
     * @inheritdoc
     */
    public start(): void {
        this.init(this.CONFIG);
    }

    /**
     * Initialize this registry.
     */
    private init(config: HeliosConfig): void {
        HeliosLogger.getLogger().info('initializing template registry');
        const fileLoader: FileLoader = new FileLoader();
        fileLoader.loadFileSync(this.FILE_PATH, (input: string)=> {
            const templates: Array<HeliosTemplate> = JSON.parse(input).data;
            templates.forEach((template: HeliosTemplate)=> {
                this.MAP.set(template.id, template);
            });
            HeliosLogger.getLogger().info('template registry initialization complete');
        });
    }

    /**
     * @inheritdoc
     */
    public add(template: HeliosTemplate, callback: (err: AsteriaException)=> void): void {
        this.MAP.set(template.id, template);
        this.writeData(callback);
    }
    
    /**
     * @inheritdoc
     */
    public remove(template: HeliosTemplate, callback: (err: AsteriaException)=> void): void {
        this.MAP.delete(template.id);
        this.writeData(callback);
    }

    /**
     * @inheritdoc
     */
    public get(id: string, callback: (err: AsteriaException, template: HeliosTemplate)=> void): void {
        callback(null, this.MAP.get(id));
    }

    /**
     * Persist data into the "templates" file.
     * 
     * @param {(err: AsteriaException)=>void} callback the callback finction invoked at the end of the writing process.
     */
    private writeData(callback: (err: AsteriaException)=>void): void {
        const fileWriter: FileWriter = new FileWriter();
        const data: string = this.getOutputData();
        fileWriter.writeFile(this.FILE_PATH, data, (err: AsteriaException)=> {
            callback(err);
        });
    }

    /**
     * Return the data to write into the "templates" file.
     * 
     * @returns {string} the data to write into the "templates" file.
     */
    private getOutputData(): string {
        const templates: Array<HeliosTemplate> = Array.from(this.MAP.values());
        const data: any = { data: templates };
        return JSON.stringify(data);
    }
}