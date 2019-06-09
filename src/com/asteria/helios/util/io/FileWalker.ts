import * as fs from 'fs';
import * as path from 'path';
import { AsteriaException, AsteriaErrorCode } from 'asteria-gaia';
import { HeliosFileStats } from 'asteria-eos';
import { HeliosFileStatsBuilder } from '../builder/HeliosFileStatsBuilder';

/**
 * The <code>FileWalker</code> class allows to traverse and return the structure of a directory.
 */
export class FileWalker {
    
    /**
     * Traverse the structure of the spefied directory path and return its structure.
     * 
     * @param {string} dirPath the path to the directory for which to get the structure.
     * @param {Function} callback the callback function that exposes data once the directory has been processed.
     */
    public readDir(dirPath: string, callback: (error: AsteriaException, data: HeliosFileStats[])=> void): void {
        fs.readdir(dirPath, (err: NodeJS.ErrnoException, files: string[]) => {
            let cursor: number = files.length;
            const result: HeliosFileStats[] = new Array<HeliosFileStats>();
            files.forEach((file: string) => {
                let itemPath = path.join(dirPath, file);
                fs.stat(itemPath, (err: NodeJS.ErrnoException, stats: fs.Stats) => {
                    if (err) {
                        const error: AsteriaException = new AsteriaException(
                            AsteriaErrorCode.FILE_READ_ERROR,
                            `unable to read file "${itemPath}"`,
                            err.toString()
                        );
                        callback(error, null);
                    } else {
                        const fileStats: HeliosFileStats = HeliosFileStatsBuilder.build(file, dirPath, stats);
                        result.push(fileStats);
                        cursor--;
                    }
                    if (cursor === 0) {
                        callback(null, result);
                    }
                });
            });
        });
    };
}