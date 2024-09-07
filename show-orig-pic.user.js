// ==UserScript==
// @name              Show Original Picture
// @name:zh-cn        自动跳转原图
// @namespace         https://github.com/Vinfall/UserScripts
// @version           0.1.5
// @author            Vinfall
// @match             https://i*.hdslb.com/bfs/*/*.avif
// @match             https://i*.hdslb.com/bfs/*/*.webp
// @grant             none
// @run-at            document-start
// @license           CC0 1.0 Universal (Public Domain)
// @description       Auto redirect to original picture, only BiliBili is supported currently
// @description:zh-cn 打开图片时自动跳转原图，仅支持 BiliBili
// ==/UserScript==

(function () {
    'use strict';

    const currentUrl = window.location.href;

    // e.g. https://i0.hdslb.com/bfs/archive/bfa1134b7d3ab7fcbc363fd7f91be783fa64696c.jpg@320w_200h_1c_!web-space-index-myseries.avif
    const newUrl = currentUrl.replace(/(\.(jpg|jpeg|png|webp)).*?\.(avif|webp)$/, '$1');

    if (newUrl !== currentUrl) {
        window.location.replace(newUrl);
        return;
    }
})();