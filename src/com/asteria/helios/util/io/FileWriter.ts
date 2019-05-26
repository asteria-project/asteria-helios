import * as fs from 'fs';
import { AsteriaException, AsteriaErrorCode } from 'asteria-gaia';

/**
 * A utility class for writing Helios files.
 */
export class FileWriter {

    /**
     * Write the file with the specified path.
     * 
     * @param {string} filePath  the path to the file to write.
     * @param {any} data  the data to write into the file.
     * @param {Function} callback the callback method invoked once the file has been entirely written.
     */
    public writeFile(filePath: string, data: any, callback: Function): void {
        fs.writeFile(filePath, data, (err: NodeJS.ErrnoException)=> {
            let error: AsteriaException = null;
            if (err) {
                error = new AsteriaException(AsteriaErrorCode.FILE_WRITE_ERROR, err.message, err.stack);
            }
            callback(error);
        });
    }
    
    /**
     * Write synchronously the file with the specified path.
     * 
     * @param {string} filePath  the path to the file to write.
     * @param {any} data the data to write into the file.
     * @param {Function} callback the callback method invoked once the file has been entirely written.
     */
    public writeFileSync(filePath: string, data: any, callback: Function): void {
        try {
            fs.writeFileSync(filePath, data);
            callback();
        } catch (err) {
            throw new AsteriaException(AsteriaErrorCode.FILE_WRITE_ERROR, err.message, err.stack);
        }
    }
}