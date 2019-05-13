import { Registry } from '../Registry';

/**
 * The abstract class for all <code>Registry</code> implementations.
 */
export abstract class AbstractRegistry<T> implements Registry<T> {

    /**
     * The map used to store all items.
     */
    protected readonly MAP: Map<string, T> = null;

    /**
     * Create a new <code>AbstractRegistry</code> instance.
     */
    protected constructor() {
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
}