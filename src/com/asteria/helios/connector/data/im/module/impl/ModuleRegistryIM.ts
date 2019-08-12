import { AsteriaException, AbstractAsteriaRegistryAsync } from 'asteria-gaia';
import { HyperionModule, HyperionModuleRegistry, HyperionModuleRegistryFactory, CsvPreviewModule } from 'asteria-hyperion';
import { ModuleRegistry } from '../../../../../service/config/ModuleRegistry';

/**
 * An "in-memory" implementation of the <code>ModuleRegistry</code> interface.
 */
export class ModuleRegistryIM extends AbstractAsteriaRegistryAsync<HyperionModule> implements ModuleRegistry {

    /**
     * The internal reference to the <code>HyperionModuleRegistry</code> object for the current Helios server instance.
     */
    private _moduleRegistry: HyperionModuleRegistry = null;

    /**
     * Create a new <code>ModuleRegistryIM</code> instance.
     */
    constructor() {
        super('com.asteria.helios.connector.im.module.impl::ModuleRegistryIM', false);
    }

    /**
     * @inheritdoc
     */
    public start(): void {
        this.init();
    }

    /**
     * @inheritdoc
     */
    public add(module: HyperionModule, callback: (err: AsteriaException)=> void): void {
        this._moduleRegistry.add(module);
        callback(null);
    }
    
    /**
     * @inheritdoc
     */
    public remove(module: HyperionModule, callback: (err: AsteriaException)=> void): void {
        this._moduleRegistry.remove(module);
        callback(null);
    }

    /**
     * @inheritdoc
     */
    public removeId(id: string, callback: (err: AsteriaException)=> void): void {
        this._moduleRegistry.removeId(id);
        callback(null);
    }

    /**
     * @inheritdoc
     */
    public get(id: string, callback: (err: AsteriaException, module: HyperionModule)=> void): void {
        callback(null, this._moduleRegistry.get(id));
    }
    
    /**
     * @inheritdoc
     */
    public has(id: string, callback: (err: AsteriaException, exists: boolean)=> void): void {
        callback(null, this._moduleRegistry.has(id));
    }

    /**
     * @inheritdoc
     */
    public getAll(callback: (err: AsteriaException, module: Array<HyperionModule>)=> void): void {
        callback(null, this._moduleRegistry.getAll());
    }
    
    /**
     * @inheritdoc
     */
    public getIds(callback: (err: AsteriaException, moduleIds: Array<string>)=> void): void {
        callback(null, this._moduleRegistry.getIds());
    }

    /**
     * @inheritdoc
     */
    public getHyperionModuleRegistry(): HyperionModuleRegistry {
        return this._moduleRegistry;
    }

    /**
     * Initialize the registry.
     */
    private init(): void {
        const factory: HyperionModuleRegistryFactory = new HyperionModuleRegistryFactory();
        this._moduleRegistry = factory.create();
        this._moduleRegistry.add(new CsvPreviewModule());
    }
}