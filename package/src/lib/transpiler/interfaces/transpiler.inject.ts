import type { WatchEventType, WatchOptions } from 'fs';

export interface TranspilerInject {
    logger?: {
        info(...args: any[]): void;
    };

    process?: {
        once(
            name: 'SIGINT',
            callback: () => void
        ): void;
    }

    watch?(
        filename: string,
        options: WatchOptions,
        callback: (e: WatchEventType) => void | Promise<void>
    ): {
        
        once(name: 'close',  callback: () => void): void;
        once(name: 'error',  callback: (e: Error) => void): void;

        on(
            name: 'change',
            callback: (
                e: WatchEventType,
                filename: string
            ) => void | Promise<void>
        ): void;

        close(): void;
    }
}