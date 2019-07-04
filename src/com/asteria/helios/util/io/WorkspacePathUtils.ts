import * as path from 'path';
import { HeliosContext } from '../../core/HeliosContext';

/**
 * The <code>WorkspacePathUtils</code> singleton provides convenient methods to work with workspace paths.
 */
export class WorkspacePathUtils {

    /**
    /**
     * The reference to the Helios current workspace.
     */
    private readonly WORKSPACE_PATH: string = null;

    /**
     * The static reference to this singleton.
     */
    private static _instance: WorkspacePathUtils = null;

    /**
     * Create a new <code>FileWalker</code> instance.
     * 
     * @param {HeliosContext} context the context associated with the current server instance.
     */
    private constructor(context: HeliosContext) {
        this.WORKSPACE_PATH = context.getWorkspace();
    }

    /**
     * Return the reference to this singleton.
     * 
     * @param {HeliosContext} context the context associated with the current server instance.
     * 
     * @returns {WorkspacePathUtils} the reference to this singleton.
     */
    public static getInstance(context: HeliosContext): WorkspacePathUtils {
        return WorkspacePathUtils._instance || (WorkspacePathUtils._instance = new WorkspacePathUtils(context));
    }

    /**
     * Return the real path, from the workspace root, to the spefied directory path.
     * 
     * @param {string} dirPath the path to the directory for which to get the real path.
     * 
     * @returns {string} the real path, from the workspace root, to the spefied directory path.
     */
    public getRealPath(dirPath: string): string {
        return path.join(this.WORKSPACE_PATH, path.normalize(dirPath));
    }
}