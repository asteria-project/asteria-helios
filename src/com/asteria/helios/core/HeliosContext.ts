import { SpiContext } from '../spi/SpiContext';
import { HeliosServer } from './HeliosServer';

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
     * Return the Helios server associated with this context.
     * 
     * @returns {HeliosServer} the Helios server associated with this context.
     */
    getServer(): HeliosServer;
    
    /**
     * Return the port used by the context for listening conections.
     * 
     * @returns {number} the port used by the context for listening conections.
     */
    getPort(): number;

    /**

    /**
     * Return a boolean value that indicates whether the server started in development in "development mode" 
     * (<code>true</code>), or in "production mode" (<code>true</code>).
     * 
     * @returns {boolean} <code>true</code> whether the server started in development in "development mode";
     *                    <code>true</code> otherwise.
     */
    isDevMode(): boolean;

    /**
     * Return the Helios application path.
     * 
     * @returns {string} the Helios application path.
     */
    getPath(): string;

    /**
     * Return the path to the workspace associated with this context.
     * 
     * @returns {string} the path to the workspace associated with this context.
     */
    getWorkspace(): string;

    /**
     * Return the reference to the <code>SpiContext</code> object for this context.
     * 
     * @returns {SpiContext} the <code>SpiContext</code> object for this context.
     */
    getSpiContext(): SpiContext;
}