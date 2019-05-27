import { Registry } from '../../core/Registry';
import { HeliosRouteConfigurator } from '../../route/HeliosRouteConfigurator';
import { HeliosService } from '../HeliosService';


/**
 * The <code>RouteConfigRegistry</code> interface provides access to the Helios registry where all route configurators
 * are stored.
 */
export interface RouteConfigRegistry extends Registry<HeliosRouteConfigurator>, HeliosService {}