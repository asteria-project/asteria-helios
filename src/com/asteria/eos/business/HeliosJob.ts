import { HeliosJobStatus } from './HeliosJobStatus';

/**
 * The <code>HeliosJob</code> interface represents a job executed by the Helios server.
 */
export interface HeliosJob {

    /**
     * The name of the job.
     */
    name: string;

    /**
     * The unique identifier for this job.
     */
    id: string;

    /**
     * The reference to the template that define this job.
     */
    description: string;

    /**
     * The current status of this job.
     */
    status: HeliosJobStatus;
    
    /**
     * A timestamp that represents the creation date for this job.
     */
    date: number;
}