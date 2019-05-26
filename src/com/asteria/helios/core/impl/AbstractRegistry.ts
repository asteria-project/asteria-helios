import { Registry } from '../Registry';
import { AbstractAsteriaObject, AsteriaException } from 'asteria-gaia';

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
    public abstract add(item: T, callback: (err: AsteriaException)=> void): void;
    
    /**
     * @inheritdoc
     */
    public abstract remove(item: T, callback: (err: AsteriaException)=> void): void;

    /**
     * @inheritdoc
     */
    public abstract get(id: string, callback: (err: AsteriaException, item: T)=> void): void;

    /**
     * @inheritdoc
     */
    public getAll(callback: (err: AsteriaException, items: Array<T>)=> void): void {
        callback(null, Array.from(this.MAP.values()));
    }

    /**
     * @inheritdoc
     */
    public getIds(callback: (err: AsteriaException, items: Array<string>)=> void): void {
        callback(null, Array.from(this.MAP.keys()));
    }
}