import { ApplicationConfig } from 'jsax-rs';

/**
 * The <code>HeliosConfig</code> interface represents the configuration for an Helios server.
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

    /**
     * The root path to the Helios HTTP API.
     */
    path?: string;

    /**
     * The HATEOAS configuration of the Helios server instance.
     */
    hateoas?: ApplicationConfig;
}