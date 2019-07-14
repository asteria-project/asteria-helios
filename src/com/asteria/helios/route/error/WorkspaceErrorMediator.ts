import { HeliosHttpError, HeliosHttpErrorCode } from 'asteria-eos';
import { HttpStatusCode, AsteriaError } from 'asteria-gaia';
import { HeliosHttpErrorBuilder } from '../../util/builder/HeliosHttpErrorBuilder';
import { FileErrorCode } from '../../lang/enum/FileErrorCode';

/**
 * The <code>WorkspaceErrorMediator</code> allows to manage errors of <code>WorkspaceConfigurator</code> objects.
 */
export class WorkspaceErrorMediator {

    /**
     * Return the right Helios HTTP error object associated with the 'list' path, depending on the specified error.
     * 
     * @param {any} error the error to process.
     * 
     * @returns {HeliosHttpError} the right Helios HTTP error object associated with the 'list' path.
     */
    public resolveListError(error: any): HeliosHttpError {
        const status: HttpStatusCode = error.code === FileErrorCode.ENOENT ? HttpStatusCode.NOT_FOUND :
                                                                             HttpStatusCode.INTERNAL_SERVER_ERROR;
        const heliosHttpError: HeliosHttpError = HeliosHttpErrorBuilder.build(
            HeliosHttpErrorCode.ERR_DIRECTORY_LISTING_FAILED,
            status,
            `Failed to retrieve directory listing.`
        );
        return heliosHttpError;
    }
    
    /**
     * Return the right Helios HTTP error object associated with the 'upload' path, depending on the specified HTTP
     * error.
     * 
     * @param {any} error the error to process.
     * 
     * @returns {HeliosHttpError} the right Helios HTTP error object associated with the 'list' upload.
     */
    public resolveUploadHttpError(error: any): HeliosHttpError {
        const message: string = error.message;
        let status: HttpStatusCode = HttpStatusCode.INTERNAL_SERVER_ERROR;
        let code: HeliosHttpErrorCode = HeliosHttpErrorCode.ERR_INTERNAL_PROCESS_FAILURE;
        if (message === 'Missing Content-Type') {
            status = HttpStatusCode.UNSUPPORTED_MEDIA_TYPE;
            code = HeliosHttpErrorCode.ERR_MISSING_CONTENT_TYPE;
        } else if (message.startsWith('Unsupported content type')) {
            status = HttpStatusCode.UNSUPPORTED_MEDIA_TYPE;
            code = HeliosHttpErrorCode.ERR_UNSUPPORTED_CONTENT_TYPE;
        } else if (message === 'Multipart: Boundary not found') {
            status = HttpStatusCode.NOT_ACCEPTABLE;
            code = HeliosHttpErrorCode.ERR_MULTIPART_BOUNDARY_NOT_FOUND;
        }
        const heliosHttpError: HeliosHttpError = HeliosHttpErrorBuilder.build(code, status, `${message}.`);
        return heliosHttpError;
    }
    
    /**
     * Return the right Helios HTTP error object associated with the 'remove' path.
     * 
     * @param {any} error the error to process.
     * 
     * @returns {HeliosHttpError} the right Helios HTTP error object associated with the 'remove' path.
     */
    public resolveRemoveError(error: any): HeliosHttpError {
        let message: string = error.message;
        let status: HttpStatusCode = HttpStatusCode.INTERNAL_SERVER_ERROR;
        let code: HeliosHttpErrorCode = HeliosHttpErrorCode.ERR_INTERNAL_PROCESS_FAILURE;
        if (error.code === FileErrorCode.ENOENT) {
            status = HttpStatusCode.NOT_FOUND;
            message = `Failed to find directory or file.`;
            code = HeliosHttpErrorCode.ERR_RESOURCE_NOT_FOUND;
        }                                                     
        const heliosHttpError: HeliosHttpError = HeliosHttpErrorBuilder.build(code, status, message);
        return heliosHttpError;
    }
    
    /**
     * Return the right Helios HTTP error object associated with the 'download' path.
     * 
     * @param {any} error the error to process.
     * 
     * @returns {HeliosHttpError} the right Helios HTTP error object associated with the 'download' path.
     */
    public resolveDownloadError(error: any): HeliosHttpError {
        let message: string = error.message;
        let status: HttpStatusCode = HttpStatusCode.INTERNAL_SERVER_ERROR;
        let code: HeliosHttpErrorCode = HeliosHttpErrorCode.ERR_INTERNAL_PROCESS_FAILURE;
        if (error.code === FileErrorCode.EISDIR) {
            status = HttpStatusCode.NOT_ACCEPTABLE;
            code = HeliosHttpErrorCode.ERR_RESOURCE_IS_A_DIRECTORY;
            message = `Resource is a directory while a file is expected.`;
        } else if (error.code === FileErrorCode.ENOENT) {
            status = HttpStatusCode.NOT_FOUND;
            message = `Invalid file path.`;
            code = HeliosHttpErrorCode.ERR_RESOURCE_NOT_FOUND;
        }
        const heliosHttpError: HeliosHttpError = HeliosHttpErrorBuilder.build(code, status, message);
        return heliosHttpError;
    }
    
    /**
     * Return the right Helios HTTP error object associated with the 'mkdir' path.
     * 
     * @param {any} error the error to process.
     * 
     * @returns {HeliosHttpError} the right Helios HTTP error object associated with the 'mkdir' path.
     */
    public resolveMkdirError(error: any): HeliosHttpError {
        const errorStatus: HttpStatusCode = error.status;
        let message: string = error.message;
        let status: HttpStatusCode = HttpStatusCode.INTERNAL_SERVER_ERROR;
        let code: HeliosHttpErrorCode = HeliosHttpErrorCode.ERR_INTERNAL_PROCESS_FAILURE;
        if (errorStatus && errorStatus === HttpStatusCode.UNPROCESSABLE_ENTITY) {
            status = errorStatus;
            code = HeliosHttpErrorCode.ERR_RESOURCE_PATH_INVALID;
            message = `Resource path is invalid.`;
        } else if (errorStatus && errorStatus === HttpStatusCode.CONFLICT) {
            status = errorStatus;
            code = HeliosHttpErrorCode.ERR_RESOURCE_PATH_INVALID;
            message = `An important resource with the same name already exists.`;
        }
        const heliosHttpError: HeliosHttpError = HeliosHttpErrorBuilder.build(code, status, message);
        return heliosHttpError;
    }
    
    /**
     * Return the right Helios HTTP error object associated with the 'preview' path.
     * 
     * @param {any} error the error to process.
     * 
     * @returns {HeliosHttpError} the right Helios HTTP error object associated with the 'preview' path.
     */
    public resolvePrevieError(error: any): HeliosHttpError {
        const errorCode: any = error.code;
        let message: string = error.message;
        let status: HttpStatusCode = HttpStatusCode.INTERNAL_SERVER_ERROR;
        let code: HeliosHttpErrorCode = HeliosHttpErrorCode.ERR_INTERNAL_PROCESS_FAILURE;
        if (error instanceof AsteriaError) {
            code = HeliosHttpErrorCode.ERR_ASTERIA_PROCESS_FAILURE;
        } else if (errorCode) {
            if (errorCode === FileErrorCode.EISDIR) {
                status = HttpStatusCode.NOT_ACCEPTABLE;
                code = HeliosHttpErrorCode.ERR_RESOURCE_IS_A_DIRECTORY;
                message = `Resource is a directory while a file is expected.`;
            } else if (errorCode === FileErrorCode.ENOENT) {
                status = HttpStatusCode.NOT_FOUND;
                message = `Invalid file path.`;
                code = HeliosHttpErrorCode.ERR_RESOURCE_NOT_FOUND;
            }
        } 
        const heliosHttpError: HeliosHttpError = HeliosHttpErrorBuilder.build(code, status, message);
        return heliosHttpError;
    }
    
    /**
     * Return the right Helios HTTP error object associated with the 'rename' path.
     * 
     * @param {any} error the error to process.
     * 
     * @returns {HeliosHttpError} the right Helios HTTP error object associated with the 'rename' path.
     */
    public resolveRenameError(error: any): HeliosHttpError {
        const errorCode: any = error.code;
        const errorStatus: HttpStatusCode = error.status;
        let message: string = error.message;
        let status: HttpStatusCode = HttpStatusCode.INTERNAL_SERVER_ERROR;
        let code: HeliosHttpErrorCode = HeliosHttpErrorCode.ERR_INTERNAL_PROCESS_FAILURE;
        if (errorStatus && errorStatus === HttpStatusCode.UNPROCESSABLE_ENTITY) {
            status = errorStatus;
            code = HeliosHttpErrorCode.ERR_RESOURCE_PATH_INVALID;
            message = `Resource paths are invalid.`;
        } else if (errorCode && errorCode === FileErrorCode.ENOENT) {
            status = HttpStatusCode.NOT_FOUND;
            message = `Invalid file path.`;
            code = HeliosHttpErrorCode.ERR_RESOURCE_NOT_FOUND;
        } 
        const heliosHttpError: HeliosHttpError = HeliosHttpErrorBuilder.build(code, status, message);
        return heliosHttpError;
    }
}