import { Request } from 'express';
import busboy from 'busboy';

/**
 * A utility class for working with incoming HTML form data.
 */
export class FormDataUtils {

    /**
     * Build and return a new <code>Busboy</code> parser object for the specified request.
     * 
     * @param {Request} req the request for which to create a new <code>Busboy</code> parser object.
     * 
     * @returns {Request} a new <code>Busboy</code> parser object.
     */
    public static buildFormDataStream(req: Request): busboy.Busboy {
        const parser: busboy.Busboy = new busboy(
            { 
                headers: req.headers,
                limits: {
                    files: 1
                }
            }
        );
        return parser;
    }
}