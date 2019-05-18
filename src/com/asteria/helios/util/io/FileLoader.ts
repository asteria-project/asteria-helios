import * as fs from 'fs';
import { AsteriaException, AsteriaErrorCode } from 'asteria-gaia';

/**
 * A utility class for loading config Helios files.
 */
export class FileLoader {

    /**
     * Load the file with the specified path.
     * 
     * @param {string} filePath  the path to the file to load.
     * @param {Function} callback the callback method invoked once the file has been entirely loaded.
     */
    public loadFile(filePath: string, callback: Function): void {
        fs.readFile(filePath, (err: NodeJS.ErrnoException, data: Buffer)=> {
            if (err) {
                throw new AsteriaException(AsteriaErrorCode.FILE_READ_ERROR, err.message, err.stack)
            }
            callback(data);
        });
    }
    
    /**
     * Load synchronously the file with the specified path.
     * 
     * @param {string} filePath  the path to the file to load.
     * @param {Function} callback the callback method invoked once the file has been entirely loaded.
     */
    public loadFileSync(filePath: string, callback: Function): void {
        try {
            const file: string = fs.readFileSync(filePath, 'utf8');
            callback(file);
        } catch (err) {
            throw new AsteriaException(AsteriaErrorCode.FILE_READ_ERROR, err.message, err.stack)
        }
    }
}