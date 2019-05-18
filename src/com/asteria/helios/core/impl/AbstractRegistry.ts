import { Registry } from '../Registry';
import { AbstractAsteriaObject } from 'asteria-gaia';

/**
 * The abstract class for all <code>Registry</code> implementations.
 */
export abstract class AbstractRegistry<T> extends AbstractAsteriaObject implements Registry<T> {

    /**
     * The map used to store all items.
     */
    protected readonly MAP: Map<string, T> = null;

    /**
     * Create a new <code>AbstractRegistry</code> instance.
     * 
     * @param {string} classRef the reference to the parent class name.
     */
    protected constructor(classRef: string) {
        super(classRef)
        this.MAP = new Map<string, T>();
    }

    /**
     * @inheritdoc
     */
    public abstract add(item: T): void;
    
    /**
     * @inheritdoc
     */
    public abstract remove(item: T): void;

    /**
     * @inheritdoc
     */
    public abstract get(id: string): T;

    /**
     * @inheritdoc
     */
    public getAll(): Array<T> {
        return Array.from(this.MAP.values());
    }

    /**
     * @inheritdoc
     */
    public getIds(): Array<string> {
        return Array.from(this.MAP.keys());
    }
}