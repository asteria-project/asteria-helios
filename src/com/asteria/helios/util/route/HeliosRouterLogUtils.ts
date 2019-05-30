import express from 'express';
import { HeliosLogger } from '../logging/HeliosLogger';
import { CommonChar } from 'asteria-gaia';

/**
 * The <code>HeliosRouterLogUtils</code> class provides static methods for logging Helios HTTP information.
 */
export class HeliosRouterLogUtils {
    
    /**
     * Print logs for the specified Request.
     * 
     * @param {Request} req the Express request reference for which to print logs.
     * @param {string} route the "METHOD / route" pari for which to print logs.
     */
    public static logRoute(req: express.Request, route: string, message?: string): void {
        HeliosLogger.getLogger().info(`${req.hostname} ${route} ${message || CommonChar.EMPTY}`);
    }

    /**
     * Print error logs for the specified Request.
     * 
     * @param {Request} req the Express request reference for which to print logs.
     * @param {string} route the "METHOD / route" pari for which to print logs.
     */
    public static logRouteError(req: express.Request, route: string, message?: string): void {
        HeliosLogger.getLogger().error(`${req.hostname} ${route} error=[${message}]`);
    }
}