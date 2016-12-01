// Ambient declaration for http-proxy, created here for convenience
// should submit PR to DefinitelyTyped at somepoint to get into @types

declare module "http-proxy" {
    interface ProxyServerOptions {
        target?: string;
        forward?: string;
        agenet?: Object;
        ssl?: Object;
        ws?: boolean;
        xfwd?: boolean;
        secure?: boolean;
        toProxy?: boolean;
        prependPath?: boolean;
        ignorePath?: boolean;
        localAddress?: string;
        changeOrigin?: boolean;
        auth?: string;
        autoRewrite?: boolean;
        headers?: Object;
        proxyTimeout?: number;
    }

    interface Proxy {
        web: (req: any, res: any, options?: ProxyServerOptions) => void
        ws: (req: any, socket, head, options?: ProxyServerOptions) => void
        listen: (port: number) => void
    }
    function createProxyServer(options: ProxyServerOptions): Proxy
}