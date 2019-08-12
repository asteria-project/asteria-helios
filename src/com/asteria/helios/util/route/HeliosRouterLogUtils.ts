import { Request } from 'express';
import { HeliosLogger } from '../logging/HeliosLogger';
import { CommonChar, AsteriaContext } from 'asteria-gaia';
import { Hyperion } from 'asteria-hyperion';
import { HttpStatusCode } from 'jsax-rs';

/**
 * The <code>HeliosRouterLogUtils</code> class provides static methods for logging Helios HTTP information.
 */
export class HeliosRouterLogUtils {
    
    /**
     * Print logs for the specified Request.
     * 
     * @param {Request} req the Express request reference for which to print logs.
     * @param {string} route the "METHOD / route" part for which to print logs.
     */
    public static logRoute(req: Request, route: string, message?: string): void {
        HeliosLogger.getLogger().info(`${req.hostname} ${route} ${message || CommonChar.EMPTY}`);
    }

    /**
     * Print error logs for the specified Request.
     * 
     * @param {Request} req the Express request reference for which to print logs.
     * @param {string} route the "METHOD / route" part for which to print logs.
     */
    public static logRouteError(req: Request, route: string, message?: string): void {
        HeliosLogger.getLogger().error(`${req.hostname} ${route} error=[${message}]`);
    }
    
    /**
     * Print error logs for the specified Request whether <code>status</code> is
     * <code>HttpStatusCode.INTERNAL_SERVER_ERROR</code>.
     * 
     * @param {Request} req the Express request reference for which to print logs.
     * @param {string} route the "METHOD / route" part for which to print logs.
     * @param {HttpStatusCode} status the HTTP status to check for printing the error log.
     * @param {any} error the reference to the error to log whether <code>status</code> is
     *                    <code>HttpStatusCode.INTERNAL_SERVER_ERROR</code>..
     */
    public static processInternalError(req: Request, route: string, status: HttpStatusCode, error: any): void {
        if (status === HttpStatusCode.INTERNAL_SERVER_ERROR) {
            HeliosRouterLogUtils.logRouteError(req, route, error.toString());
        }
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