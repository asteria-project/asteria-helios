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
    PROCESS = '/process',
    
    /**
     * Represent the route to work with the list of registered jobs (Hyperion processor instances).
     */
    JOBS = '/jobs',
    
    /**
     * Represent the route to work with the list of registered Helios templates.
     */
    TEMPLATES = '/templates',

    /**
     * Represent the route to work with the Helios workspace.
     */
    WOKSPACE = '/workspace'
}