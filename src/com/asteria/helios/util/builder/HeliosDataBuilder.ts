import { HeliosData } from 'asteria-eos';

/**
 * A static builder that provides methods for creating new <code>HeliosData</code> objects.
 */
export class HeliosDataBuilder {

    /**
     * Return a new <code>HeliosData</code> object built from the specified parameters.
     * 
     * @param {string} serverId the ID of the current Helios server instance.
     * @param {T} data the data associated with the new <code>HeliosData</code> object.
     * 
     * @returns {HeliosData<T>} a new <code>HeliosData</code> object.
     */
    public static build<T>(serverId: string, data: T): HeliosData<T> {
        const result: HeliosData<T> = {
            serverId: serverId,
            data: data,
            birthtime: Date.now()
        };
        return result;
    }
}