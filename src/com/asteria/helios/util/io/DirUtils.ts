import * as path from 'path';
import * as fs from 'fs';

/**
 * The <code>DirUtils</code> singleton provides convenient methods to work with directories.
 */
export class DirUtils {

    /**
     * A regular expression that is used ot check Windows 32 invalid file paths.
     */
    private static readonly INVALID_PATH_CHARS: RegExp = /[<>:"|?*]/;

    /**
     * Store the octal value of the <code>0777</code> chmod value.
     */
    private static readonly o777: number = parseInt('0777', 8);

    /**
     * The static reference to this singleton.
     */
    private static _instance: DirUtils = null;

    /**
     * Create a new <code>DirUtils</code> instance.
     */
    private constructor() {}

    /**
     * Return the reference to this singleton.
     * 
     * @returns {DirUtils} the reference to this singleton.
     */
    public static getInstance(): DirUtils {
        return DirUtils._instance || (DirUtils._instance = new DirUtils());
    }

    /**
     * Recursively remove file or directory for the specified path.
     * 
     * @param {string} dirPath the path for which to remove elements.
     * @param {(err: NodeJS.ErrnoException) => void} callback the callback method called at the end of the process.
     */
    public rimrf(dirPath: string, callback: (err: NodeJS.ErrnoException) => void) {
        fs.stat(dirPath, (err: NodeJS.ErrnoException, stats: fs.Stats) => {
            if (err) {
                callback(err);
            } else {
                if (stats.isFile()) {
                    fs.unlink(dirPath, callback)
                } else if (stats.isDirectory()) {
                    this.removeDir(dirPath, callback);
                }
            }
        });
    }

    /**
     * Recursively create directories for the specified path.
     * 
     * See https://github.com/jprichardson/node-fs-extra/blob/master/lib/mkdirs/mkdirs.js for more details.
     * 
     * @param {string} dirPath the path for which to create directories recursively.
     * @param {number} mode Specifies chmod value. Not supported on Windows. Default: <code>0o777</code>.
     * @param {(err: NodeJS.ErrnoException) => void} callback the callback method called at the end of the process.
     */
    public mkdirp(dirPath: string, mode: number, callback: (err: NodeJS.ErrnoException) => void) {
        if (process.platform === 'win32' && this.invalidWin32Path(dirPath)) {
            const errInval: NodeJS.ErrnoException = new Error(dirPath + ' contains invalid WIN32 path characters.')
            errInval.code = 'EINVAL';
            callback(errInval);
        } else {
            const optMode: number = mode === undefined || mode === null ? DirUtils.o777 & (~process.umask()) : mode;
            const resolvedPath: string = path.resolve(dirPath);
            fs.mkdir(resolvedPath, optMode, (er: NodeJS.ErrnoException) => {
                if (!er) {
                    callback(null);
                } else {
                    switch (er.code) {
                        case 'ENOENT':
                            if (path.dirname(resolvedPath) === resolvedPath) {
                                callback(er);
                            } else {
                                this.mkdirp(path.dirname(resolvedPath), optMode, (er: NodeJS.ErrnoException) => {
                                    if (er) {
                                        callback(er);
                                    } else {
                                        this.mkdirp(resolvedPath, optMode, callback);
                                    }
                                });
                            }
                            break;
                        // In the case of any other error, just see if there's a dir
                        // there already. If so, then hooray!  If not, then something
                        // is borked.
                        default:
                            fs.stat(resolvedPath, (er2: NodeJS.ErrnoException, stats: fs.Stats) => {
                                // If the stat fails, then that's super weird.
                                // Let the original error be the failure reason.
                                if (er2 || !stats.isDirectory()) {
                                    callback(er);
                                } else {
                                    callback(null);
                                }
                            });
                    }
                }
            });
        }
    }

    /**
     * Return a boolean value that indicates whether the specified path contains invalid Windows 32 characters
     * (<code>true</code>), or not (<code>false</code>).
     * 
     * @param {string} pathToCheck the path to check.
     * 
     * @returns {boolean} <code>true</code>) whether the specified path contains invalid Windows 32 characters; 
     *                    (<code>false</code> otherwise.
     */
    private invalidWin32Path(pathToCheck: string): boolean {
        const rootPath: string = this.getRootPath(pathToCheck);
        const resolvedPath: string = pathToCheck.replace(rootPath, '');
        return DirUtils.INVALID_PATH_CHARS.test(resolvedPath);
    }
    
    /**
     * Return the reference to the "drive" path in Windows environments.
     * 
     * @param {string} pathToEvaluate the path to evaluate.
     * 
     * @returns {string} the reference to the "drive" path in Windows environments.
     */
    private getRootPath(pathToEvaluate: string): string {
        const buffer: Array<string> = path.normalize(path.resolve(pathToEvaluate)).split(path.sep);
        return (buffer.length > 0) ? buffer[0] : null;
    }

    /**
     * Recursively remove directories and files from the directory at the specified path.
     * 
     * See https://geedew.com/remove-a-directory-that-is-not-empty-in-nodejs/ for more details.
     * 
     * @param {string} dirPath the path to the directory to remove.
     * @param {(err: NodeJS.ErrnoException) => void} callback the callback method called at the end of the process.
     */
    private removeDir(dirPath: string, callback: (err: NodeJS.ErrnoException) => void): void {
        let _self: DirUtils = this;
        fs.readdir(dirPath, (err: NodeJS.ErrnoException, files: string[])=> {
            if (err) {
                callback(err);
            } else {
                const numFiles: number = files.length;
                let count: number = 0;
                const folderDone: (err: NodeJS.ErrnoException)=> void = (err: NodeJS.ErrnoException)=> {
                    count++;
                    if (count >= numFiles || err) {
                        fs.rmdir(dirPath, callback);
                    }
                };
                if (!numFiles) {
                    folderDone(null);
                } else {
                    files.forEach((file: string)=> {
                        const curPath: string = path.join(dirPath, file);
                        fs.lstat(curPath, (err: NodeJS.ErrnoException, stats: fs.Stats)=> {
                            if (err) {
                                callback(err);
                                return;
                            } else {
                                if (stats.isDirectory()) {
                                    _self.removeDir(curPath, folderDone);
                                } else {
                                    fs.unlink(curPath, folderDone);
                                }
                            }
                        });
                    });
                }
            }
        });
    }
}