#!/usr/bin/env node

import * as yargs from "yargs";
import SSRProxy from "../src/index";

interface CommandLineArgs {
    upstream: string;
    config: string;
    idleMax: number;
    port: number;
    nodeHttpProxy: Object;
    phantomjs: Object;
}

const argv: CommandLineArgs = yargs
    .usage("Usage: ssr-proxy -u http://upstream.url or ssr-proxy --config [config.json]")
    .config()
    .alias("u", "upstream")
    .nargs("u", 1)
    .describe("u", "upstream single pape app server to be proxied")
    .alias("p", "port")
    .default("p", 5050)
    .nargs("p", 1)
    .describe("p", "port listening to")
    .alias("m", "idleMax")
    .default("m", 500)
    .nargs("m", 1)
    .describe("m", "consider a page rendered if no network activity for more than m millisecond")
    .help("h")
    .alias("h", "help")
    .argv;

if (!argv.config && !argv.upstream) {
    console.error("You need to provide either an upstream or a config file");
    yargs.showHelp();
    process.exit(1);
}

(async function() {
    const ssrp = new SSRProxy(argv.upstream, argv.idleMax, argv.nodeHttpProxy, argv.phantomjs);
    ssrp.listen(argv.port);
    console.info(`[SSR-Proxy] listening on port ${argv.port}`);
})();