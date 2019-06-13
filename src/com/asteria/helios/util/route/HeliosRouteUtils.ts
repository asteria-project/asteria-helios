import express from 'express';
import { HeliosLogger } from '../logging/HeliosLogger';
import { CommonChar, AsteriaErrorCode, ErrorUtil } from 'asteria-gaia';

/**
 * The <code>HeliosRouteUtils</code> class provides static methods for working with Helios HTTP calls.
 */
export class HeliosRouteUtils {

    /**
     * A visitor method that closes the conection when an error occured out for an Asteria process.
     * 
     * @param {Response} res the reference to the HTTP response for which to close connection.
     * @param {any} error the error responsible for closing connection.
     * @param {AsteriaErrorCode} code the code of the error responsible for closing connection.
     */
    public static closeOnError(res: express.Response, error: any, code: AsteriaErrorCode): void {
        HeliosLogger.getLogger().error(error.toString());
        res.sendStatus(ErrorUtil.resolveHttpCode(code));
    }
}