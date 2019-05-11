import express from 'express';

/**
 * The <code>HeliosRouter</code> interface allows to define the HTTP routes for an Helios application.
 */
export interface HeliosRouter {

    /**
     * Return the router associated with this <code>HeliosRouter</code> object.
     * 
     * @returns {express.Router} the router associated with this <code>HeliosRouter</code> object.
     */
    getRouter(): express.Router;
}