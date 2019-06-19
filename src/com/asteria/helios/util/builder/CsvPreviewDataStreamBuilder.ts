import { HeliosFileStats } from 'asteria-eos';
import { AsteriaContext } from 'asteria-gaia';
import { HeliosContext } from '../../core/HeliosContext';
import { CsvPreviewDataStream } from '../../stream/data/CsvPreviewDataStream';

/**
 * A static builder that provides methods for creating new <code>CsvPreviewDataStream</code> objects.
 */
export class CsvPreviewDataStreamBuilder {

    /**
     * Return a new <code>CsvPreviewDataStream</code> object built from the specified parameters.
     * 
     * @param {HeliosContext} heliosContext the context of the current Helios server instance.
     * @param {AsteriaContext} asteriaContext the context of the <code>Hyperion</code> instance that processes data.
     * @param {HeliosFileStats} stats the stats of the processed file.
     * 
     * @returns {CsvPreviewDataStream} a new <code>CsvPreviewDataStream</code> object.
     */
    public static build(heliosContext: HeliosContext, asteriaContext: AsteriaContext,
                        stats: HeliosFileStats): CsvPreviewDataStream {
        const dataStream: CsvPreviewDataStream = new CsvPreviewDataStream();
        dataStream.init(
            {
                serverId: heliosContext.getId(),
                stats: stats
            },
            asteriaContext
        );
        return dataStream;
    }
}