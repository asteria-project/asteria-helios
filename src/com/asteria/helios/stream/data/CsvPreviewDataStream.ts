import { TransformOptions } from 'stream';
import { AsteriaStream, AsteriaContext, CommonChar } from 'asteria-gaia';
import { CronosTransformStream } from 'asteria-cronos';
import { HeliosData, HeliosCsvPreview } from 'asteria-eos';
import { HeliosDataBuilder } from '../../util/builder/HeliosDataBuilder';
import { CsvPreviewDataStreamConfig } from '../../lang/file/CsvPreviewDataStreamConfig';

/**
 * The <code>CsvPreviewDataStream</code> class is a transformation stream that create the content preview of a CSV file.
 */
export class CsvPreviewDataStream extends CronosTransformStream implements AsteriaStream {

    /**
     * The  config object for this <code>CsvPreviewDataStream</code> instance.
     */
    private _config: CsvPreviewDataStreamConfig = null;

    /**
     * Create a new <code>CsvPreviewDataStream</code> instance.
     * 
     * @param {TransformOptions} opts the options config for this stream.
     */
    constructor(opts?: TransformOptions) {
        super('com.asteria.helios.stream.data::CsvPreviewDataStream', opts);
    }

    /**
     * @inheritdoc
     */
    public init(config: CsvPreviewDataStreamConfig, context: AsteriaContext): void {
        this._config = config;
    }

    /**
     * @inheritdoc
     */
    public transform(chunk: any): void {
        const input: string = CommonChar.EMPTY + chunk;
        const data: HeliosCsvPreview = {
            stats: this._config.stats,
            content: input
        };
        const heliosData: HeliosData<HeliosCsvPreview> = HeliosDataBuilder.build(this._config.serverId, data);
        const result: string = JSON.stringify(heliosData);
        this.onComplete(null, result);
    }
}
