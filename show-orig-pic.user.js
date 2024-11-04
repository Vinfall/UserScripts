// ==UserScript==
// @name              Show Original Picture
// @name:zh-cn        自动跳转原图
// @namespace         https://github.com/Vinfall/UserScripts
// @version           0.11.0
// @author            Vinfall
// @match             https://*.hdslb.com/bfs/*/*.avif
// @match             https://*.hdslb.com/bfs/*/*.webp
// @match             https://*.moimg.net/*?x-oss-process=*
// @match             https://*.xdaimages.com/wordpress/wp-content/uploads/*/*.*?q=*
// @match             https://*/wp-content/uploads/*/*/*.*?w=*&h=*
// @match             https://cdnfile.sspai.com/*/*/*/*.*?imageView2/2/*/interlace/*
// @match             https://image.gcores.com/*?x-oss-process=*
// @match             https://img.chuapp.com//wp-content/Picture/*/*?imageView*
// @match             https://img.chuapp.com/wp-content/Picture/*/*?imageView*
// @match             https://ipfs.crossbell.io/ipfs/*?*
// @match             https://www.gravatar.com/avatar/*?s=*
// @exclude-match     https://cdnfile.sspai.com/*/*/*/*.*?imageView2/2/format/webp
// @grant             none
// @run-at            document-start
// @license           CC0 1.0 Universal (Public Domain)
// @icon              data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>🔍</text></svg>
// @description       Auto redirect to original picture, only a few sites are supported currently
// @description:zh-cn 打开图片时自动跳转原图，支持 BiliBili、WordPress、XDA、机核、触乐、少数派文章等
// ==/UserScript==

(function () {
    'use strict';

    const currentUrl = window.location.href;
    let newUrl = currentUrl;

    // Define rules
    const urlNihil = [
        'gravatar.com',
        'image.gcores.com',
        'img.chuapp.com',
        'ipfs.crossbell.io',
        'moimg.net',
        'wp-content/uploads',
    ];

    const urlReplacements = {
        // e.g. https://i0.hdslb.com/bfs/archive/bfa1134b7d3ab7fcbc363fd7f91be783fa64696c.jpg@320w_200h_1c_!web-space-index-myseries.avif
        'hdslb.com': (url) => url.replace(/(\.(jpg|jpeg|png|webp)).*?\.(avif|webp)$/, '$1'),
        'cdnfile.sspai.com': (url) =>
            url.replace(/(\.(png|jpg))\?imageView2\/\d+\/[^ ]*/, '$1?imageView2/2/format/webp'),
    };

    // Add default rule for urlNihil
    urlNihil.forEach((uri) => {
        urlReplacements[uri] = (url) => url.split('?')[0];
    });

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
