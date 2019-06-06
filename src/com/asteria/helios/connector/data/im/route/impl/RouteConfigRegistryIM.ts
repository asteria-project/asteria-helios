import { RouteConfigRegistry } from '../../../../../service/config/RouteConfigRegistry';
import { HeliosRouteConfigurator } from '../../../../../route/HeliosRouteConfigurator';
import { RuokConfigurator } from '../../../../../route/configurator/RuokConfigurator';
import { TemplatesConfigurator } from '../../../../../route/configurator/TemplatesConfigurator';
import { JobsConfigurator } from '../../../../../route/configurator/JobsConfigurator';
import { ProcessConfigurator } from '../../../../../route/configurator/ProcessConfigurator';
import { AsteriaException, AbstractAsteriaRegistryAsync } from 'asteria-gaia';

/**
 * An "in-memory" implementation of the <code>RouteConfigRegistry</code> interface.
 */
export class RouteConfigRegistryIM extends AbstractAsteriaRegistryAsync<HeliosRouteConfigurator>
                                   implements RouteConfigRegistry {

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
    public add(config: HeliosRouteConfigurator, callback: (err: AsteriaException)=> void): void {
        this.MAP.set(config.getId(), config);
        callback(null);
    }
    
    /**
     * @inheritdoc
     */
    public remove(config: HeliosRouteConfigurator, callback: (err: AsteriaException)=> void): void {
        this.MAP.delete(config.getId());
        callback(null);
    }

    /**
     * @inheritdoc
     */
    public get(id: string, callback: (err: AsteriaException, template: HeliosRouteConfigurator)=> void): void {
        callback(null, this.MAP.get(id));
    }

    /**
     * Initialize the registry.
     */
    private init(): void {
        if (!this.MAP.has('ruok')) {
            this.add(new RuokConfigurator(), (err: AsteriaException)=>{});
        }
        if (!this.MAP.has('jobs')) {
            this.add(new JobsConfigurator(), (err: AsteriaException)=>{});
        }
        if (!this.MAP.has('templates')) {
            this.add(new TemplatesConfigurator(), (err: AsteriaException)=>{});
        }
        if (!this.MAP.has('process')) {
            this.add(new ProcessConfigurator(), (err: AsteriaException)=>{});
        }
    }
}