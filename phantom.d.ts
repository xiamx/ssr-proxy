// Modified with added Webpage.on declaration. Copied here for ambient use for convenience
// should submit PR to DefinitelyTyped at somepoint

// Type definitions for PhantomJS bridge for NodeJS
// Project: https://github.com/sgentle/phantomjs-node
// Definitions by: horiuchi <https://github.com/horiuchi/>, Random <https://github.com/llRandom/>
// Definitions: https://github.com/DefinitelyTyped/DefinitelyTyped

declare module "phantom" {

    export function create(args?: string[]): Promise<PhantomJS>;

    export interface PhantomJS {
        createPage(): Promise<WebPage>;
        exit(returnValue?: number): void;
    }

    export interface WebPage {
        open(url: string): Promise<string>;
        close(): Promise<void>;

        on(event: string, callback: Function)
        on(event: string, runOnPhantom: boolean, callback: Function)

        evaluate<R>(callback: () => R): Promise<R>;
        evaluate<T, R>(callback: (arg: T) => R, arg: T): Promise<R>;
        evaluate<T1, T2, R>(callback: (arg1: T1, arg2: T2) => R, arg1: T1, arg2: T2): Promise<R>;
        evaluate<T1, T2, T3, R>(callback: (arg1: T1, arg2: T2, arg3: T3) => R, arg1: T1, arg2: T2, arg3: T3): Promise<R>;
        evaluate<R>(callback: (...args: any[]) => R, ...args: any[]): Promise<R>;
        includeJs(url: string): Promise<void>;
        injectJs(filename: string): Promise<boolean>;
        sendEvent(mouseEventType: string, mouseX?: number, mouseY?: number, button?: string): Promise<void>;
        sendEvent(keyboardEventType: string, key: string, null1?: void, null2?: void, modifier?: number): Promise<void>;

        render(filename: string): Promise<void>;
        render(filename: string, options?: { format?: string; quality?: string; }): Promise<void>;
        renderBase64(type: string): Promise<string>;

        setContent(html: string, url: string): Promise<string>;

        property<T>(key: string): Promise<T>;
        property<T>(key: string, value: T): Promise<void>;

        setting<T>(key: string): Promise<T>;

        addCookie(cookie: ICookie): Promise<boolean>;
        deleteCookie(cookieName: string): Promise<boolean>;
        clearCookies(): Promise<void>;
    }

    export interface ICookie {
        name: string,
        value: string,
        domain?: string,
        path: string,
        httponly?: boolean,
        secure?: boolean,
        expires?: Date
    }

    export interface IPaperSizeOptions {
        width?: string;
        height?: string;
        format?: string;
        orientation?: string;
        margin?: any; // string | { top?: string; left?: string; bottom?: string; right?: string;  }
    }
}
