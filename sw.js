if(!self.define){let e,i={};const n=(n,a)=>(n=new URL(n+".js",a).href,i[n]||new Promise((i=>{if("document"in self){const e=document.createElement("script");e.src=n,e.onload=i,document.head.appendChild(e)}else e=n,importScripts(n),i()})).then((()=>{let e=i[n];if(!e)throw new Error(`Module ${n} didn’t register its module`);return e})));self.define=(a,s)=>{const c=e||("document"in self?document.currentScript.src:"")||location.href;if(i[c])return;let r={};const f=e=>n(e,c),o={module:{uri:c},exports:r,require:f};i[c]=Promise.all(a.map((e=>o[e]||f(e)))).then((e=>(s(...e),r)))}}define(["./workbox-3a6eb24f"],(function(e){"use strict";self.skipWaiting(),e.clientsClaim(),e.precacheAndRoute([{url:"apple-touch-icon.png",revision:"f999cc03debeec98391c0180717b8ef7"},{url:"apple-touch-icon.svg",revision:"64aede796ef2fa0df4596c97e52d41b1"},{url:"assets/index-_q9K0gJ4.js",revision:null},{url:"assets/index-CDWPzfYp.css",revision:null},{url:"assets/workbox-window.prod.es5-DL_hIMXg.js",revision:null},{url:"favicon.png",revision:"7e00fb71ffd88247af979ffa0bf8a5af"},{url:"favicon.svg",revision:"49fe1486c785fc33b484109e1ae381a0"},{url:"index.html",revision:"c51d9304677b5be1d0af56c7fbb8c5f3"},{url:"mask-icon.png",revision:"74da054d12b7896ade6a3b36d3878e5b"},{url:"mask-icon.svg",revision:"b8b42df09300e496a157882b5cedfb69"},{url:"pwa-1024x1024.png",revision:"22e7027f1d9ae12acb8137d8d037a6a8"},{url:"pwa-1024x1024.svg",revision:"23a6b61707a24c212e19ab4db52cb34f"},{url:"pwa-192x192.png",revision:"e0d025069de044c094e52c51425f521e"},{url:"pwa-192x192.svg",revision:"5a8abf728c0f8ec8e92665b9b3c39c12"},{url:"pwa-512x512.png",revision:"0b69e75499409457263ff8779bdf6aaf"},{url:"pwa-512x512.svg",revision:"422f48e7fc4e939c498dbb3664670efe"},{url:"pwa-64x64.png",revision:"1160960eeae74b1f2c3ed4d921513a9a"},{url:"pwa-64x64.svg",revision:"492577874e243f7b4c2e0cf2e898b023"},{url:"apple-touch-icon.png",revision:"f999cc03debeec98391c0180717b8ef7"},{url:"favicon.png",revision:"7e00fb71ffd88247af979ffa0bf8a5af"},{url:"mask-icon.png",revision:"74da054d12b7896ade6a3b36d3878e5b"},{url:"pwa-1024x1024.png",revision:"22e7027f1d9ae12acb8137d8d037a6a8"},{url:"pwa-192x192.png",revision:"e0d025069de044c094e52c51425f521e"},{url:"pwa-512x512.png",revision:"0b69e75499409457263ff8779bdf6aaf"},{url:"pwa-64x64.png",revision:"1160960eeae74b1f2c3ed4d921513a9a"},{url:"robots.txt",revision:"cd9cd94aaa699e0a16e692b6bb16f672"},{url:"manifest.webmanifest",revision:"4ee936f6780100e4adf30fc29f6fca17"}],{}),e.cleanupOutdatedCaches(),e.registerRoute(new e.NavigationRoute(e.createHandlerBoundToURL("/m-trade/index.html"))),e.registerRoute(/^https:\/\/my-api-domain\.com\/.*$/,new e.NetworkFirst({cacheName:"api-cache",plugins:[new e.ExpirationPlugin({maxEntries:50,maxAgeSeconds:86400}),new e.CacheableResponsePlugin({statuses:[0,200]})]}),"GET"),e.registerRoute(/\.(?:html|js|css|png|jpg|jpeg|svg|gif|ico|json)$/,new e.StaleWhileRevalidate({cacheName:"app-assets-cache",plugins:[new e.ExpirationPlugin({maxEntries:1e3,maxAgeSeconds:2592e3})]}),"GET"),e.registerRoute(/\/.*/,new e.NetworkFirst({cacheName:"navigation-cache",plugins:[new e.ExpirationPlugin({maxEntries:50,maxAgeSeconds:604800})]}),"GET")}));
//# sourceMappingURL=sw.js.map
