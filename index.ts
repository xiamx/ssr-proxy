import * as phantom from "phantom";
import * as httpProxy from "http-proxy";
import * as http from "http";
import * as url from "url";
import { Url } from "url";
import {chain, values, debounce, keyBy, mapValues, filter, omit, isEmpty} from "lodash";

const config = require("./config.json");
const proxy = httpProxy.createProxyServer(config.nodeHttpProxy);

const rewriteHeader = phantomRequestDataHeaders => {
    return chain(phantomRequestDataHeaders)
        .keyBy("name")
        .mapValues("value")
        .omit(["Content-Encoding"])
        .values();
};

const shouldDirectProxy = (srvUrl: Url): boolean => {
    return !isEmpty(srvUrl.pathname.match(/.png$|.jpg$/))
}

const ssrProxy = async (req,  res) =>  {
        const instance = await phantom.create();
        console.info("[SSR-Proxy] Request", req.url);
        const debouncedWrite = debounce(() => {
            page.property("content").then(content =>
                res.end(content)
            ).then(() => instance.exit());
        }, config.idleMax);

        const srvUrl = url.parse(`http://${req.url}`);

        if (shouldDirectProxy(srvUrl)) {
            console.info("[SSR-Proxy] Direct proxy", srvUrl.path);
            return await proxy.web(req,  res,  { target: config.upstream });
        }

        const page = await instance.createPage();
        await page.on("onResourceRequested", (requestData) => {
            console.info("[Phantom] Resource Requesting", requestData.id, requestData.url);
            debouncedWrite();
        });

        await page.on("onResourceReceived", (requestData) => {
            console.info("[Phantom] Resource Received", requestData.url);
            if (requestData.id === 1) {
                // this is the main document
                let newheader = rewriteHeader(requestData.headers);
                res.writeHead(requestData.status, newheader);
            }
            debouncedWrite();
        });

        await page.on("onResourceError", (requestData) => {
            console.error("[Phantom] Resource Error", requestData.url, requestData.errorString);
            debouncedWrite();
        });

        const status = await page.open(url.resolve(config.upstream, srvUrl.path));
        console.info("[Phantom] page open", status);

    };

(async function() {
    const server  =  http.createServer(ssrProxy);

    console.info(`[SSR-Proxy] listening on port ${config.port}`);
    server.listen(config.port);
})();