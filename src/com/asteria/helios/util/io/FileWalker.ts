import * as fs from 'fs';
import * as path from 'path';
import { AsteriaException, AsteriaErrorCode } from 'asteria-gaia';
import { HeliosFileStats } from 'asteria-eos';
import { HeliosFileStatsBuilder } from '../builder/HeliosFileStatsBuilder';
import { HeliosContext } from '../../core/HeliosContext';

/**
 * The <code>FileWalker</code> class allows to traverse and return the structure of a directory.
 */
export class FileWalker {
    
    private readonly WORKSPACE_PATH: string = null;

    /**
     * Create a new <code>FileWalker</code> instance.
     * 
     * @param {HeliosContext} context the context associated with the current server instance.
     */
    constructor(context: HeliosContext) {
        this.WORKSPACE_PATH = context.getWorkspace();
    }

    /**
     * Traverse the structure of the spefied directory path and return its structure.
     * 
     * @param {string} dirPath the path to the directory for which to get the structure.
     * @param {Function} callback the callback function that exposes data once the directory has been processed.
     */
    public readDir(dirPath: string, callback: (error: AsteriaException, data: HeliosFileStats[])=> void): void {
        const fullPath: string = path.join(this.WORKSPACE_PATH, dirPath);
        fs.readdir(fullPath, (err: NodeJS.ErrnoException, files: string[]) => {
            if (err) {
                const error: AsteriaException = new AsteriaException(
                    AsteriaErrorCode.FILE_READ_ERROR,
                    `unable to read files in path "${fullPath}"`,
                    err.toString()
                );
                callback(error, null);
            } else {
                let cursor: number = files.length;
                const result: HeliosFileStats[] = new Array<HeliosFileStats>();
                files.forEach((file: string) => {
                    let itemPath = path.join(fullPath, file);
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
            }
        });
    };
}