import { StreamProcessConfig } from 'asteria-gaia';
import { HeliosFileStats } from 'asteria-eos';

/**
 * The <code>CsvPreviewDataStreamConfig</code> interface represents the configuration of a
 * <code>CsvPreviewDataStream</code> stream process.
 */
export interface CsvPreviewDataStreamConfig extends StreamProcessConfig {

    /**
     * The reference to the identifier for the current Helios server instance.
     */
    serverId: string;

    /**
     * The stats object of the associated file.
     */
    stats: HeliosFileStats;

    /**
     * The path to the file to process.
     */
    path: string;
}