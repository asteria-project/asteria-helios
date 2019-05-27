import { HeliosRouter } from './HeliosRouter';
import { HeliosContext } from '../core/HeliosContext';

/**
 * The <code>HeliosRouteConfigurator</code> interface provides the API you must implement to declare a route in the
 * Helios server.
 */
export interface HeliosRouteConfigurator {

    /**
     * A visitor function that is used to create a new route in the Helios server.
     * 
     * @param {HeliosRouter} router the reference to the internal router object of the the Helios server.
     * @param {HeliosContext} context the reference to the Helios server context.
     */
    createRoute(router: HeliosRouter, context: HeliosContext): void;

    /**
     * Return the identifier of this route configurator object.
     * 
     * @returns {string} the identifier of this route configurator object.
     */
    getId(): string;
}