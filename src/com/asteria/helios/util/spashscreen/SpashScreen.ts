import { AbstractAsteriaObject } from 'asteria-gaia';

/**
 * The <code>SplashScreen</code> class is responsible for rendering the Helios server splash screen.
 */
export class SplashScreen extends AbstractAsteriaObject {

    /**
     * Create a new <code>SplashScreen</code> instance.
     */
    private constructor() {
        super('com.asteria.helios.util.splashscreen::SplashScreen');
        this.render();
    }

    /**
     * Create and return a new <code>SplashScreen</code> instance.
     */
    public static create(): SplashScreen {
        return new SplashScreen();
    }

    /**
     * Render the Helios server splash screen.
     */
    private render(): void {
        process.stdout.write(`\x1b[33m
_____________ ASTERIA SERVER ______________
  _    _ ______ _      _____ ____   _____ 
 | |  | |  ____| |    |_   _/ __ \\ / ____|
 | |__| | |__  | |      | || |  | | (___  
 |  __  |  __| | |      | || |  | |\\___ \\ 
 | |  | | |____| |____ _| || |__| |____) |
 |_|  |_|______|______|_____\\____/|_____/ 

              VERSION 0.0.1
___________________________________________

\x1b[0m`);
    }
}