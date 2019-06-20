import * as fs from 'fs';
import { HeliosFileStats } from 'asteria-eos';

/**
 * A static builder that provides methods for creating new <code>HeliosFileStats</code> objects.
 */
export class HeliosFileStatsBuilder {

    /**
     * The reference to the <code>.</code> character.
     */
    private static readonly DOT: string = '.';

    /**
     * Return a new <code>HeliosFileStats</code> object built from the specified parameters.
     * 
     * @param {string} fileName the name of the file for which to get stats.
     * @param {string} path the path to the file for which to get stats.
     * @param {fs.Stats} stats the information about the file for which to get stats.
     * 
     * @returns {HeliosFileStats} a new <code>HeliosFileStats</code> object.
     */
    public static build(fileName: string, path: string, stats: fs.Stats): HeliosFileStats {
        const isFile: boolean = stats.isFile();
        const id: number = fileName.lastIndexOf(HeliosFileStatsBuilder.DOT);
        const result: HeliosFileStats = {
            path: path,
            name: fileName.substr(0, id),
            extention: undefined,
            size: stats.size,
            birthtime: stats.birthtime.getTime(),
            isFile: isFile,
            mode: stats.mode,
            updatetime: stats.mtimeMs
        };
        if (isFile) {
            result.extention = fileName.substr(id + 1);
        }
        return result;
    }
}