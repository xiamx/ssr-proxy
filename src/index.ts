import * as phantom from "phantom";
import * as httpProxy from "http-proxy";
import * as http from "http";
import * as url from "url";
import { Url } from "url";
import {
    chain,
    debounce,
    keyBy,
    mapValues,
    filter,
    omit,
    isEmpty,
    partial
} from "lodash";

export default class SSRProxy {
    private server: http.Server;
    private httpProxy: httpProxy.Proxy;

    constructor(private upstream: string, private idleMax = 500, private nodeHttpProxyParams?, private phantomjsParams?) {
        this.httpProxy = httpProxy.createProxyServer(nodeHttpProxyParams);
        this.server = http.createServer(partial(this.requestHandler, this));
    }

    async requestHandler(context, req,  res) {
        const instance = await phantom.create(this.phantomjsParams);
        console.info("[SSR-Proxy] Request", req.url);
        const debouncedWrite = debounce(() => {
            page.property("content").then(content =>
                res.end(content)
            ).then(() => instance.exit());
        }, context.idleMax);

        const srvUrl = url.parse(`http://${req.url}`);

        if (SSRProxy.shouldDirectProxy(srvUrl)) {
            console.info("[SSR-Proxy] Direct proxy", srvUrl.path);
            return await context.httpProxy.web(req,  res,  { target: context.upstream });
        }

        const page = await instance.createPage();
        console.info("[Phantom] Page Created");

        await page.on("onResourceRequested", true, function(requestData, networkRequest) {
            if (SSRProxy.shouldPhantomjsIgnore(networkRequest.url)) {
                return networkRequest.abort();
            }
            console.info("[Phantom] Resource Requesting", requestData.id, requestData.url);
            debouncedWrite();
        });

        await page.on("onResourceReceived", (requestData) => {
            console.info("[Phantom] Resource Received", requestData.url);
            if (requestData.id === 1) {
                // this is the main document
                let newheader = SSRProxy.rewriteHeader(requestData.headers);
                res.writeHead(requestData.status, newheader);
            }
            debouncedWrite();
        });

        await page.on("onResourceError", true, function(requestData, networkRequest) {
            if (!SSRProxy.shouldPhantomjsIgnore(networkRequest.url)) {
                console.error("[Phantom] Resource Error", requestData.url, requestData.errorString);
                debouncedWrite();
            }
        });

        try {
            const targetUrl = url.resolve(context.upstream, srvUrl.path);
            console.info("[Phantom] will open page", targetUrl);
            const status = await page.open(targetUrl);
            console.info("[Phantom] page open", srvUrl.path, status);
        } catch (e) {
            console.error("[Phantom] Failed to open targetUrl", e);
        }

    };


    listen(port: number) {
        return this.server.listen(port);
    }

    static rewriteHeader(phantomRequestDataHeaders) {
        return chain(phantomRequestDataHeaders)
            .keyBy("name")
            .mapValues("value")
            .omit(["Content-Encoding"])
            .value();
    };

    static shouldDirectProxy(srvUrl: Url): boolean {
        return !isEmpty(srvUrl.pathname.match(/(\.png$)|(\.jpg$)|(\.ttf$)/));
    }

    static shouldPhantomjsIgnore(url: string): boolean {
        return !isEmpty(url.match(/\.ttf$/));
    }
}