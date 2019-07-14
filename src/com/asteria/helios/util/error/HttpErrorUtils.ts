import { Request, Response } from 'express';
import { HeliosHttpError } from 'asteria-eos';
import { HttpStatusCode } from 'asteria-gaia';
import { HeliosRouterLogUtils } from '../route/HeliosRouterLogUtils';

/**
 * A utility class for managing Helios HTTP errors.
 */
export class HttpErrorUtils {
    
    /**
     * A utility method that applies common process to all HELIOS errors, including:
     * <ul>
     *   <li>create a new <code>HeliosHttpError</code> object for the specified error</li>
     *   <li>log the error whether error status is <code>HttpStatusCode.INTERNAL_SERVER_ERROR</code></li>
     *   <li>send HTTP status and the <code>HeliosHttpError</code> object as a response to the HTTP call</li>
     * </ul>
     * 
     * @param {Request} req the reference to the original HTTP request.
     * @param {Response} res the reference to the original HTTP response.
     * @param {string} route the string representation of the route for which to process the error.
     * @param {(error: any)=> HeliosHttpError} errorbuilderFunc the method invoked to build the new
     *                                                          <code>HeliosHttpError</code> object.
     * @param {any} error the error on which to perform the Helios common error process.
     */
    public static processError(req: Request, res: Response, route: string, 
                               errorbuilderFunc: (error: any)=> HeliosHttpError, error: any): void {
        const heliosHttpError: HeliosHttpError = errorbuilderFunc.call(this, error);
        const status: HttpStatusCode = heliosHttpError.status;
        HeliosRouterLogUtils.processInternalError(req, route, status, error);
        res.status(status).send(heliosHttpError);
    }
}