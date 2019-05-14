/**
 * The <code>HeliosJobStatus</code> enum contains the available status types for an <code>HeliosJob</code> object.
 */
export enum HeliosJobStatus {

    /**
     * Indicates that a job execution is currently in progress.
     */
    IN_PROGRESS = 'IN_PROGRESS',
    
    /**
     * Indicates that a job execution succeeded.
     */
    DONE = 'DONE',
    
    /**
     * Indicates that a job execution failed.
     */
    FAILED = 'FAILED'
}