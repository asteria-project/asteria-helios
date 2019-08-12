import { HeliosHttpError, HeliosHttpErrorCode } from 'asteria-eos';
import { AsteriaError } from 'asteria-gaia';
import { HeliosHttpErrorBuilder } from '../../util/builder/HeliosHttpErrorBuilder';
import { HttpStatusCode } from 'jsax-rs';

/**
 * The <code>TemplateErrorMediator</code> allows to manage errors of <code>TemplateConfigurator</code> objects.
 */
export class TemplateErrorMediator {
    
    /**
     * Return the right Helios HTTP error object associated with the 'templates' path.
     * 
     * @param {any} error the error to process.
     * 
     * @returns {HeliosHttpError} the right Helios HTTP error object associated with the 'templates' path.
     */
    public resolveTemplatesError(error: any): HeliosHttpError {
        let message: string = error.message;
        let status: HttpStatusCode = HttpStatusCode.INTERNAL_SERVER_ERROR;
        let code: HeliosHttpErrorCode = HeliosHttpErrorCode.ERR_INTERNAL_PROCESS_FAILURE;
        if (error instanceof AsteriaError) {
            code = HeliosHttpErrorCode.ERR_ASTERIA_PROCESS_FAILURE;
        }
        const heliosHttpError: HeliosHttpError = HeliosHttpErrorBuilder.build(code, status, message);
        return heliosHttpError;
    }
    
}