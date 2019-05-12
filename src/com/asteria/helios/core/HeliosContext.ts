import express from 'express';
import { ProcessorRegistry } from '../spi/processor/ProcessorRegistry';

/**
 * The <code>HeliosContext</code> interface represents the exection context of a server object in the Helios framework.
 */
export interface HeliosContext {

    /**
     * Return the unique identifier for this context.
     * 
     * @returns {string} the unique identifier for this context.
     */
    getId(): string;

    /**
     * Return the HTP server associated with this context.
     * 
     * @returns {Express} the HTP server associated with this context.
     */
    getServer(): express.Express;

    /**
     * Return the port used by the server for listening conections.
     * 
     * @returns {number} the port used by the server for listening conections.
     */
    getPort(): number;
    
    /**
     * Return the path to the workspace associated with this context.
     * 
     * @returns {string} the path to the workspace associated with this context.
     */
    getWorkspace(): string;

    /**
     * Return the reference to the registry where all Hyperion processors are stored.
     * 
     * @returns {ProcessorRegistry} the reference to the registry where all Hyperion processors are stored.
     */
    getProcessRegistry(): ProcessorRegistry;
}