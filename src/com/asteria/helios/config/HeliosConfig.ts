
/**
 * The <code>HeliosConfig</code> interface represents configuration of a server object in the Helios framework.
 */
export interface HeliosConfig {

    /**
     * The port to listen for connections.
     */
    port: number;

    /**
     * The path to the workspace, from the root of the server environment.
     */
    workspace: string;
}