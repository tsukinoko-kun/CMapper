interface String {
    hash: () => number;
}
declare class HashMap {
    private bucket;
    length: number;
    private hashList;
    constructor();
    private hash;
    set(key: any, value: any): void;
    delete(key: any): boolean;
    pop(key: any): any;
    get(key: any): any;
    has(key: any): boolean;
    toString(): string;
    forEach(callback: (el: any[2], map: any[][][]) => void): void;
}
declare class HashSet<T> {
    private bucket;
    length: number;
    constructor();
    add(token: T): void;
    remove(token: T): void;
    contains(token: T): boolean;
    toggle(token: T): void;
    forEach(callbackfn: (token: T, bucket: HashMap) => void): void;
}
declare class Queue<T> {
    private storage;
    length: number;
    constructor();
    enqueue(element: T): void;
    dequeue(): T | undefined;
    peek(pos?: number): T | undefined;
}
declare class SortedList<T> {
    private list;
    private hasChangedSinceLastSort;
    length: number;
    constructor(template?: Array<T>);
    [Symbol.iterator](): IterableIterator<T>;
    add(value: T, insertSorted?: boolean): number | undefined;
    remove(value: T): boolean;
    sort(): void;
    indexOf(value: T): number;
    includes(value: T): boolean;
}
declare class Stack<T> {
    private storage;
    length: number;
    constructor();
    push(item: T): void;
    pop(): T | undefined;
    peek(pos?: number): T | undefined;
}
declare class StringBuilder {
    private bucket;
    length: number;
    constructor(value?: string | undefined);
    [Symbol.iterator](): string[];
    toString(): string;
    append(value: string): void;
    appendWithLinebreak(value: string): void;
    clear(): void;
    replace(searchValue: string | RegExp, replaceValue: string): void;
    private countLength;
}
declare function tsx(html: string): HTMLElement | null;
declare const httpGetCache: HashMap;
declare function httpGet(url: string, cached?: boolean): Promise<string>;
declare function delay(ms: number): Promise<unknown>;
declare const retriggerableDelayCache: Map<string, number>;
declare function retriggerableDelay(delayId: string, ms: number, callback: Function): void;
