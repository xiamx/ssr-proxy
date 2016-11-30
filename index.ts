import * as phantom from 'phantom'
import * as httpProxy from 'http-proxy'
import * as http from 'http'
import * as url from 'url'
import {debounce, keyBy, mapValues, filter, omit} from 'lodash'

const config = require('./config.json')

const proxy = httpProxy.createProxyServer(config.nodeHttpProxy);

const ssrProxy = async (req, res) => {
        const instance = await phantom.create();
        console.info('Request', req.url)
        const writeContent = debounce(() => {
            page.property('content').then(content => 
                res.end(content)
            ).then(() => instance.exit())
        }, config.idleMax);

        const srvUrl = url.parse(`http://${req.url}`);

        if (srvUrl.pathname.match(/.png$|.jpg$/)) {
            console.info('Direct proxy', srvUrl.path);
            return await proxy.web(req, res, { target: config.upstream });
        }

        const page = await instance.createPage();
        await page.on("onResourceRequested", function(requestData) {
            console.info('[Phantom] Resource Requesting', requestData.id, requestData.url)
            writeContent();
        });

        await page.on("onResourceReceived", function(requestData) {
            console.info('[Phantom] Resource Received', requestData.url)
            if (requestData.id === 1) {
                // this is the main document
                let newheader = 
                    omit(
                        mapValues(
                            keyBy(requestData.headers, 'name'),
                            'value'
                            ),
                            ['Content-Encoding']
                    )
                res.writeHead(requestData.status, newheader);
            }
            writeContent();
        });

        await page.on("onResourceError", function(requestData) {
            console.error('[Phantom] Resource Error', requestData.url, requestData.errorString)
            writeContent();
        });

        const status = await page.open(url.resolve(config.upstream, srvUrl.path));
        console.log(status);

    }

(async function() {

    const server = http.createServer(ssrProxy);
     
    console.log("listening on port 5050")
    server.listen(5050);
})();