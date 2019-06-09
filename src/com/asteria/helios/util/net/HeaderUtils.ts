import express from 'express';
import { HeliosContext } from '../../core/HeliosContext';

/**
 * A utility class for working with HTTP headers.
 */
export class HeaderUtils {

    /**
     * A static visitor that adds the <code>Location</code> header to the specified HTTP response.
     * 
     * @param {HeliosContext} context the context used to manage HTTP calls.
     * @param {express.Response} res the HTTP response for which to set the <code>Location</code> header.
     * @param {string} routePath the rout path used to set the <code>Location</code> header.
     */
    public static setLocation(context: HeliosContext, res: express.Response, routePath: string): void {
        const url: string = context.getPath() + routePath;
        res.location(url);
    }
}