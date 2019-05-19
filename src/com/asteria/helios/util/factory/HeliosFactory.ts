import { Helios } from '../../core/Helios';
import { HeliosImpl } from '../../core/impl/HeliosImpl';
import { FileLoader } from '../io/FileLoader';
import * as path from 'path';
import { HeliosConfig } from '../../core/HeliosConfig';

/**
 * A static utility class for creating <code>Helios</code> objects.
 */
export class HeliosFactory {

    /**
     * A static reference to config file used when Helios is started in development mode.
     */
    private static readonly DEV_CONFIG: string = 'server-config.dev.json';

    /**
     * A static reference to config file used when Helios is started in production mode.
     */
    private static readonly PROD_CONFIG: string = 'server-config.json';

    /**
     * Create and return a new <code>Helios</code> object.
     */
    public static create(): Helios {
        const argv: any[] = process.argv.slice(2);
        const isDev: boolean = argv.indexOf('dev') !== -1;
        const loader: FileLoader = new FileLoader();
        const configFileName: string = isDev ? HeliosFactory.DEV_CONFIG : HeliosFactory.PROD_CONFIG;
        const configPath: string = path.join(process.cwd(), 'server', 'config', configFileName);
        let server: Helios = null;
        loader.loadFileSync(configPath, (file: string)=> {
            const config: HeliosConfig = JSON.parse(file);
            server = new HeliosImpl(config, isDev);
        });
        return server;
    }
}