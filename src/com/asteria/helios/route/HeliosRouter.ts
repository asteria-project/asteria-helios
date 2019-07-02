import { Router } from 'express';
import { AsteriaException } from 'asteria-gaia';

/**
 * The <code>HeliosRouter</code> interface allows to define the HTTP routes for an Helios application.
 */
export interface HeliosRouter {

    /**
     * Return the router associated with this <code>HeliosRouter</code> object.
     * 
     * @returns {Router} the router associated with this <code>HeliosRouter</code> object.
     */
    getRouter(): Router;

    /**
     * Initialize the HTTP routes.
     * 
     * @param {(err:AsteriaException)=> void} callback the callback method invoked until the HTTP routes have been
     *                                                 initialized.
     */
    lookupRoutes(callback: (err: AsteriaException)=> void): void;
}