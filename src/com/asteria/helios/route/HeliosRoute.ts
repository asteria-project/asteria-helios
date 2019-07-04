/**
 * The <code>HeliosRoute</code> enum contains all routes for an Helios app.
 */
export enum HeliosRoute {

    /**
     * Is the server still alive?
     */
    RUOK = '/ruok',

    /**
     * Represent the route to access the Helios processor controller.
     */
    PROCESS = '/process/controller',
    
    /**
     * Represent the route to access the Helios processor controller for the specified process identifier.
     */
    PROCESS_ID = '/process/controller/:id',
    
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
    WOKSPACE_CONTROLLER_UPLOAD = '/workspace/controller/upload'
}