import { AbstractRegistry } from '../../../../../core/impl/AbstractRegistry';
import { RouteConfigRegistry } from '../../../../../service/data/RouteConfigRegistry';
import { HeliosRouteConfigurator } from '../../../../../route/HeliosRouteConfigurator';
import { RuokConfigurator } from '../../../../../route/configurator/RuokConfigurator';
import { TemplatesConfigurator } from '../../../../../route/configurator/TemplatesConfigurator';
import { JobsConfigurator } from '../../../../../route/configurator/JobsConfigurator';
import { ProcessConfigurator } from '../../../../../route/configurator/ProcessConfigurator';

/**
 * An "in-memory" implementation of the <code>RouteConfigRegistry</code> interface.
 */
export class RouteConfigRegistryIM extends AbstractRegistry<HeliosRouteConfigurator> implements RouteConfigRegistry {

    /**
     * Create a new <code>RouteConfigRegistryIM</code> instance.
     */
    constructor() {
        super('com.asteria.helios.connector.im.route.impl::RouteConfigRegistryIM');
        
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
    public add(config: HeliosRouteConfigurator): void {
        this.MAP.set(config.getId(), config);
    }
    
    /**
     * @inheritdoc
     */
    public remove(config: HeliosRouteConfigurator): void {
        this.MAP.delete(config.getId());
    }

    /**
     * @inheritdoc
     */
    public get(id: string): HeliosRouteConfigurator {
        return this.MAP.get(id);
    }

    /**
     * Initialize the registry.
     */
    private init(): void {
        if (!this.MAP.has('ruok')) {
            this.add(new RuokConfigurator());
        }
        if (!this.MAP.has('jobs')) {
            this.add(new JobsConfigurator());
        }
        if (!this.MAP.has('templates')) {
            this.add(new TemplatesConfigurator());
        }
        if (!this.MAP.has('process')) {
            this.add(new ProcessConfigurator());
        }
    }
}