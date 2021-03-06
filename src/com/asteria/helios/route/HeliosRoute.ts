/**
 * The <code>HeliosRoute</code> enum contains all routes for an Helios app.
 */
export enum HeliosRoute {

    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // Utils
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    
    /**
     * Is the server still alive?
     */
    RUOK = '/ruok',

    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // Collections
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    
    /**
     * Represent the route to work with the list of registered jobs (Hyperion processor instances).
     */
    JOBS = '/jobs',
    
    /**
     * Represent the route to work with the list of registered Helios templates.
     */
    TEMPLATES = '/templates',

    /**
     * Represent the route to work with an Helios template depending on its identifier.
     */
    TEMPLATES_ID = '/templates/:id',

    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // Controllers
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    /**
     * Represent the route to access the Helios processor controller.
     */
    PROCESS = '/process/controller',
    
    /**
     * Represent the route to run the Helios processor controller for the specified process identifier.
     */
    PROCESS_RUN = '/process/controller/run/:id',
    
    /**
     * Represent the route to work with the Helios workspace.
     */
    WOKSPACE = '/workspace/controller',
    
    /**
     * Represent the route to list files and directories in the specified workspace path.
     */
    WOKSPACE_CONTROLLER_LIST = '/workspace/controller/list',

    /**
     * Represent the route to preview file content in the specified workspace path.
     */
    WOKSPACE_CONTROLLER_PREVIEW = '/workspace/controller/preview',
    
    /**
     * Represent the route to upload a file content in the specified workspace path.
     */
    WOKSPACE_CONTROLLER_UPLOAD = '/workspace/controller/upload',

    /**
     * Represent the route to download a file from the specified workspace path.
     */
    WOKSPACE_CONTROLLER_DOWNLOAD = '/workspace/controller/download',

    /**
     * Represent the route to remove a file, or a directory, from the workspace.
     */
    WOKSPACE_CONTROLLER_REMOVE = '/workspace/controller/remove',
    
    /**
     * Represent the route to create a new directory at the specified workspace path.
     */
    WOKSPACE_CONTROLLER_MKDIR = '/workspace/controller/mkdir',
    
    /**
     * Represent the route to rename the element at the specified workspace path.
     */
    WOKSPACE_CONTROLLER_RENAME = '/workspace/controller/rename'
}