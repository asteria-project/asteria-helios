import { AsteriaLogger, AsteriaLogLevel, AbstractAsteriaObject } from 'asteria-gaia';
import * as logger from 'ts-log-debug';

/**
 * A singleton implementation of the <code>AsteriaLogger</code> interface.
 */
export class HeliosLogger extends AbstractAsteriaObject implements AsteriaLogger {

    /**
     * The static reference to this logger.
     */
    private static _instance: AsteriaLogger = null;

    /**
     * The reference to the internal logging utility.
     */
    private readonly LOGGER: logger.Logger;

    /**
     * The log level specified for this Asteria logger.
     */
    private _logLevel: AsteriaLogLevel = AsteriaLogLevel.INFO;

    /**
     * Create a new <code>Logger</code> instance.
     */
    private constructor() {
        super('com.asteria.helios.util.logging::HeliosLogger');
        this.LOGGER = new logger.Logger('HELIOS');
        this.LOGGER.appenders.set(
            'stdout',
            {
                type: 'stdout',
                level: [
                    AsteriaLogLevel.DEBUG, AsteriaLogLevel.INFO,
                    AsteriaLogLevel.WARN, AsteriaLogLevel.ERROR,
                    AsteriaLogLevel.FATAL,
                ]
            }
        );
    }

    /**
     * Returns the reference to this logger.
     * 
     * @returns {AsteriaLogger} the reference to this logger.
     */
    public static getLogger(): AsteriaLogger {
        return HeliosLogger._instance || (HeliosLogger._instance = new HeliosLogger());
    }

    /**
     * @inheritdoc
     */
    public getLogLevel(): AsteriaLogLevel {
        return this._logLevel;
    }

    /**
     * @inheritdoc
     */
    public setLogLevel(level: AsteriaLogLevel): void {
        this._logLevel = level;
    }

    /**
     * @inheritdoc
     */
    public log(level: AsteriaLogLevel, message: string): void {
        if (level >= this._logLevel) {
            switch (level) {
                case AsteriaLogLevel.DEBUG :
                    this.LOGGER.debug(message);
                    break;
                case AsteriaLogLevel.INFO :
                    this.LOGGER.info(message);
                    break;
                case AsteriaLogLevel.WARN :
                    this.LOGGER.warn(message);
                    break;
                case AsteriaLogLevel.ERROR :
                    this.LOGGER.error(message);
                    break;
                case AsteriaLogLevel.FATAL :
                    this.LOGGER.fatal(message);
                    break;
            }
        }
    }
    
    /**
     * @inheritdoc
     */
    public info(message: string): void {
        this.log(AsteriaLogLevel.INFO, message);
    }
    
    /**
     * @inheritdoc
     */
    public debug(message: string): void {
        this.log(AsteriaLogLevel.DEBUG, message);
    }
    
    /**
     * @inheritdoc
     */
    public warn(message: string): void {
        this.log(AsteriaLogLevel.WARN, message);
    }
    
    /**
     * @inheritdoc
     */
    public error(message: string): void {
        this.log(AsteriaLogLevel.ERROR, message);
    }
    
    /**
     * @inheritdoc
     */
    public fatal(message: string): void {
        this.log(AsteriaLogLevel.FATAL, message);
    }
}
