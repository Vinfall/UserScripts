// ==UserScript==
// @name              Show Original Picture
// @name:zh-cn        自动跳转原图
// @namespace         https://github.com/Vinfall/UserScripts
// @version           0.2.0
// @author            Vinfall
// @match             https://i*.hdslb.com/bfs/*/*.avif
// @match             https://i*.hdslb.com/bfs/*/*.webp
// @match             https://image.gcores.com/*?x-oss-process=*
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

    // Regex pattern for BiliBili images
    // e.g. https://i0.hdslb.com/bfs/archive/bfa1134b7d3ab7fcbc363fd7f91be783fa64696c.jpg@320w_200h_1c_!web-space-index-myseries.avif
    const bilibiliPattern = /(\.(jpg|jpeg|png|webp)).*?\.(avif|webp)$/;

    // Regex pattern for GCORES images
    const gcoresPattern = /\?x-oss-process=.*/;

    // Process BiliBili URLs
    if (bilibiliPattern.test(currentUrl)) {
        newUrl = currentUrl.replace(bilibiliPattern, '$1');
    }
    // Process GCORES URLs
    else if (gcoresPattern.test(currentUrl)) {
        newUrl = currentUrl.replace(gcoresPattern, '');
    }

    // Redirect if matched
    if (newUrl !== currentUrl) {
        window.location.replace(newUrl);
    }
})();