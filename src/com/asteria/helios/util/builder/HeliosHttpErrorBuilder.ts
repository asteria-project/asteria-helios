import { HeliosHttpErrorCode, HeliosHttpError } from 'asteria-eos';

/**
 * A static builder that provides methods for creating new <code>HeliosHttpError</code> objects.
 */
export class HeliosHttpErrorBuilder {

    /**
     * Build and return new <code>HeliosHttpError</code> objects.
     * 
     * @param {HeliosHttpErrorCode} code the Helios HTTP status associated with the new error object.
     * @param {number} status code the standard HTTP status associated with the new error object.
     * @param {string} message the functional message that describes the new error object.
     * 
     * @returns {HeliosHttpError} a new <code>HeliosHttpError</code> object.
     */
    public static build(code: HeliosHttpErrorCode, status: number, message: string): HeliosHttpError {
        return {
            code: code,
            status: status,
            message: message
        };
    }
}