/**
 * The <code>BusboyEventType</code> enum contains possible event types used by the Busboy stream API.
 */
export enum BusboyEventType {

    /**
     * Specified an event of the type of 'file'.
     */
    FILE = 'file',
    
    /**
     * Specified an event of the type of 'finish'.
     */
    FINISH = 'finish'
}