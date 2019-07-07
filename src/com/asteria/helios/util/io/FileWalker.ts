import * as fs from 'fs';
import * as path from 'path';
import { AsteriaException, AsteriaErrorCode } from 'asteria-gaia';
import { HeliosFileStats } from 'asteria-eos';
import { HeliosFileStatsBuilder } from '../builder/HeliosFileStatsBuilder';
import { WorkspacePathUtils } from './WorkspacePathUtils';
import { HeliosContext } from '../../core/HeliosContext';

/**
 * The <code>FileWalker</code> class allows to traverse and return the structure of a directory.
 */
export class FileWalker {

    /**
     * The reference to the context associated with the current server instance.
     */
    private readonly CONTEXT: HeliosContext = null;

    /**
     * Create a new <code>FileWalker</code> instance.
     * 
     * @param {HeliosContext} context the context associated with the current server instance.
     */
    constructor(context: HeliosContext) {
        this.CONTEXT = context;
    }

    /**
     * Traverse the structure of the spefied directory path and return its structure.
     * 
     * @param {string} dirPath the path to the directory for which to get the structure.
     * @param {Function} callback the callback function that exposes data once the directory has been processed.
     */
    public readDir(dirPath: string, callback: (error: AsteriaException, data: HeliosFileStats[])=> void): void {
        fs.readdir(dirPath, (err: NodeJS.ErrnoException, files: string[]) => {
            if (err) {
                const error: AsteriaException = new AsteriaException(
                    AsteriaErrorCode.FILE_READ_ERROR,
                    `unable to read files in path "${dirPath}"`,
                    err.toString()
                );
                callback(error, null);
            } else {
                const result: HeliosFileStats[] = new Array<HeliosFileStats>();
                const fixedPath: string = WorkspacePathUtils.getInstance(this.CONTEXT).maskRealPath(dirPath);
                let cursor: number = files.length;
                if (cursor === 0) {
                    callback(null, result);
                } else {
                    files.forEach((file: string) => {
                        let itemPath: string = path.join(dirPath, file);
                        fs.stat(itemPath, (err: NodeJS.ErrnoException, stats: fs.Stats) => {
                            if (err) {
                                const error: AsteriaException = new AsteriaException(
                                    AsteriaErrorCode.FILE_READ_ERROR,
                                    `unable to read file "${itemPath}"`,
                                    err.toString()
                                );
                                callback(error, null);
                            } else {
                                const fileStats: HeliosFileStats = HeliosFileStatsBuilder.build(file, fixedPath, stats);
                                result.push(fileStats);
                                cursor--;
                            }
                            if (cursor === 0) {
                                callback(null, result);
                            }
                        });
                    });
                }
            }
        });
    };
}