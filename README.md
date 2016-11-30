# SSR-Proxy — Server-Side Rendering Proxy

Prerender your single page app for better SEO and support on legacy browsers

## Get started

Install Node.js with version 6.4.0 and higher. Then follow the steps below.
```bash
git clone git@github.com:xiamx/ssr-proxy.git
cd srr-proxy
npm install
# make the configuration needed in config.json
# change upstream to the server of your Single Page App
npm start
```

## Motivation

Quite a number of web apps built today are Single Page Apps (SPA.) [[1]] With React, Vuejs and other tools, building complex SPA is easier than ever before. 

One of the biggest challenge faced by SPAs is the diffculty in SEO (Search Engine Optimization.) When a webpage is asynchronously rendered via javascript (e.g. use ajax to fetch some documents and then display it inside a div), search engines cannot index them properly [[2]].

 Granted, most SPAs don't need to be indexed by search engines, But such demands have pushed the development of Universal Rendering, or Server-Side Rendering of frontend components. Universal Rendering does not come for free, developer now need to manage additional complexity of components lifecycles on both client-side and server-side. [[3]]

## SSR-Proxy

SSR-Proxy is a HTTP proxy which you can put in front of your existing SPA server. With SSR-Proxy, we take a different approach in Server-Side Rendering. Instead of rendering frontend components in Nodejs, we use an actual headless browser — PhantomJS to render SPA and proxy the rendered HTML to the client.

With this approach, we can focus on developing a SPA that is designed to render in a browser, greatly reducing the complexity.

## Configuration

SSR-Proxy ships with a default configuration in `config.json` which should be usable in most scenarios. But you might need to modify it to get the desired behavoir.

- `upstream`: The root url of your single page app. SSR-Proxy will proxy all requests to this url.
- `idleMax`: SSR-Proxy consider a page rendered and send it back to the client if there are no network activity for more than `idleMax` milliseconds. A default value of `500` is set. If your SPA server is slower than that or your page renders with partial content, you may consider increasing this number. Decreasing this number shortens the page loading time, at the cost of possible missing content.
- `nodeHttpProxy`: A set of [options](https://github.com/nodejitsu/node-http-proxy#options) passed to when creating node-http-proxy server.
- `phantomjs.argv`: Commandline arguments when starting phantomjs.
- `port`: Port that this proxy server listens to.

[1]: https://github.com/search?o=desc&q=require%28%27react-router%27%29&ref=searchresults&s=indexed&type=Code&utf8=%E2%9C%93

[2]: http://webcache.googleusercontent.com/search?q=cache:ypDo69X-oj0J:react.semantic-ui.com/&num=1&hl=en&gl=ca&strip=1&vwsrc=0