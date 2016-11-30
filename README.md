**SSR-Proxy -- Server-Side Rendering Proxy.**

Prerender your single page app for better SEO and support on legacy browsers

## Motivation

Quite a number of web apps built today are Single Page Apps (SPA.) With React, Vuejs and other tools, building complex SPA is easier than ever before. 

One of the biggest challenge faced by SPAs is the diffculty in SEO (Search Engine Optimization.) Granted, most SPAs don't need to be indexed by search engines, But such demands have pushed the development of Universal Rendering, or Server-Side Rendering of frontend components. Universal Rendering does not come for free, developer now need to manage additional complexity of components lifecycles on both client-side and server-side. A more detailed discussion on the cost of Universal Rendering can be found on Meng Xuan Xia's article.

## SSR-Proxy's solution to Universal Rendering

With SSR-Proxy, we take a different approach in Server-Side Rendering. 