/**
 * The <code>Registry</code> interface defines the API that you must implement to create registries in the Helios
 * environment.
 */
export interface Registry<T> {

    /**
     * Add the specified item to the registry.
     * 
     * @param {T} item the item to add to the registry.
     */
    add(item: T): void;

    /**
     * Remove the specified item from the registry.
     * 
     * @param {T} item the item to remove from the registry.
     */
    remove(item: T): void;

    /**
     * Return the item with the specified identifier.
     * 
     * @param {string} id the identifier of the item to get.
     * 
     * @returns {T} the item to rfind.
     */
    get(id: string): T;
    
    /**
     * Return an array of all items declared in this registry.
     * 
     * @returns {Array<T>} an array of all items declared in this registry.
     */
    getAll(): Array<T>;


    /**
     * Return an array of all identifiers declared in this registry.
     * 
     * @returns {Array<string>} an array of all identifiers declared in this registry.
     */
    getIds(): Array<string>;
}