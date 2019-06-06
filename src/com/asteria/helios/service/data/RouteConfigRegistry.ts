import { HeliosRouteConfigurator } from '../../route/HeliosRouteConfigurator';
import { HeliosService } from '../HeliosService';
import { AsteriaRegistryAsync } from 'asteria-gaia';


/**
 * The <code>RouteConfigRegistry</code> interface provides access to the Helios registry where all route configurators
 * are stored.
 */
export interface RouteConfigRegistry extends AsteriaRegistryAsync<HeliosRouteConfigurator>, HeliosService {}