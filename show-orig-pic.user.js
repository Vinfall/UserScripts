// ==UserScript==
// @name              Show Original Picture
// @name:zh-cn        自动跳转原图
// @namespace         https://github.com/Vinfall/UserScripts
// @version           0.5.0
// @author            Vinfall
// @match             https://*.hdslb.com/bfs/*/*.avif
// @match             https://*.hdslb.com/bfs/*/*.webp
// @match             https://*/wp-content/uploads/*/*/*.*?w=*&h=*
// @match             https://image.gcores.com/*?x-oss-process=*
// @match             https://img.chuapp.com//wp-content/Picture/*/*?imageView*
// @match             https://img.chuapp.com/wp-content/Picture/*/*?imageView*
// @grant             none
// @run-at            document-start
// @license           CC0 1.0 Universal (Public Domain)
// @description       Auto redirect to original picture, only BiliBili/GCores is supported currently
// @description:zh-cn 打开图片时自动跳转原图，仅支持 BiliBili、机核
// ==/UserScript==

(function () {
    'use strict';

    const currentUrl = window.location.href;
    let newUrl = currentUrl;

    // Define rules
    const urlReplacements = {
        // e.g. https://i0.hdslb.com/bfs/archive/bfa1134b7d3ab7fcbc363fd7f91be783fa64696c.jpg@320w_200h_1c_!web-space-index-myseries.avif
        'hdslb.com': (url) => url.replace(/(\.(jpg|jpeg|png|webp)).*?\.(avif|webp)$/, '$1'),
        'image.gcores.com': (url) => url.split('?')[0],
        'img.chuapp.com': (url) => url.split('?')[0],
        'wp-content/uploads': (url) => url.split('?')[0],
    };

    // Match pattern
    const processUrl = (url) => {
        for (const domain in urlReplacements) {
            if (url.includes(domain)) {
                const replacementFunction = urlReplacements[domain];
                return replacementFunction(url);
            }
        }
        return url;
    };

    newUrl = processUrl(currentUrl);

    // Redirect on match
    if (newUrl !== currentUrl) {
        window.location.replace(newUrl);
    }
})();