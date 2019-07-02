import { Request, Response } from 'express';
import { HeliosLogger } from '../logging/HeliosLogger';
import { CommonChar, AsteriaContext } from 'asteria-gaia';
import { Hyperion } from 'asteria-hyperion';

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
    public static logRoute(req: Request, route: string, message?: string): void {
        HeliosLogger.getLogger().info(`${req.hostname} ${route} ${message || CommonChar.EMPTY}`);
    }

    /**
     * Print error logs for the specified Request.
     * 
     * @param {Request} req the Express request reference for which to print logs.
     * @param {string} route the "METHOD / route" pari for which to print logs.
     */
    public static logRouteError(req: Request, route: string, message?: string): void {
        HeliosLogger.getLogger().error(`${req.hostname} ${route} error=[${message}]`);
    }
    
    /**
     * Print information when a processor is added to, or removed from, the processor registry.
     * 
     * @param {Hyperion} processor the reference to the processor registry.
     * @param {boolean} add indicates whether the processor is add (<code>true</code>), or not (<code>false</code>).
     */
    public static logProcessorRegistryInfo(processor: Hyperion, add: boolean): void {
        const ctx: AsteriaContext = processor.getContext();
        const type: string = add ? 'added to' : 'removed from';
        HeliosLogger.getLogger().info(
            `hyperion processor ${type} registry: name=${ctx.getName()}, id=${ctx.getId()}`
        );
    }
}