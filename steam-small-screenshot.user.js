// ==UserScript==
// @name         Steam Small Screenshot
// @namespace    https://github.com/Vinfall/UserScripts
// @version      0.1.0
// @author       Vinfall
// @match        https://store.steampowered.com/app/*
// @icon         https://store.steampowered.com/favicon.ico
// @grant        none
// @run-at       document-start
// @license      CC0 1.0 Universal (Public Domain)
// @description  Show smaller screenshot on Steam store, just like before
// @description:zh-cn Steam 商店页面显示小尺寸截图
// ==/UserScript==

(() => {
    const originalCreateElement = document.createElement;
    document.createElement = function (tagName) {
        const element = originalCreateElement.call(this, tagName);

        // block img src
        if (tagName.toLowerCase() === 'img') {
            let originalSrc = '';
            Object.defineProperty(element, 'src', {
                get: () => originalSrc,
                set: (value) => {
                    originalSrc = replaceLargeImageUrl(value);
                    if (element.setAttribute) {
                        element.setAttribute('src', originalSrc);
                    }
                },
            });
        }

        return element;
    };

    const originalSetAttribute = Element.prototype.setAttribute;
    Element.prototype.setAttribute = function (name, value) {
        if (name === 'style' && typeof value === 'string' && value.includes('background-image')) {
            value = value.replace(/url\(["']?(.*?)["']?\)/g, (_match, url) => `url("${replaceLargeImageUrl(url)}")`);
        }
        return originalSetAttribute.call(this, name, value);
    };

    function replaceLargeImageUrl(url) {
        if (!url || typeof url !== 'string') return url;

        // https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/*/*/ss_*.1920x1080.*
        const steamImageRegex =
            /(https:\/\/[^/]+\/store_item_assets\/steam\/apps\/\d+\/ss_[a-f0-9]+\.)(\d+x\d+)(\.jpg)(\?.*)?/;

        const match = url.match(steamImageRegex);
        if (match) {
            const dimensions = match[2];
            if (dimensions === '1920x1080') {
                const newUrl = `${match[1]}600x338${match[3]}`;
                return newUrl;
            }
        }

        return url;
    }

    // watch dynamic content
    window.addEventListener('load', () => {
        document.querySelectorAll('img').forEach((img) => {
            if (img.src) {
                const newSrc = replaceLargeImageUrl(img.src);
                if (newSrc !== img.src) {
                    img.src = newSrc;
                }
            }
        });

        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                mutation.addedNodes.forEach((node) => {
                    if (node.nodeType === 1) {
                        // Element node
                        if (node.tagName === 'IMG' && node.src) {
                            const newSrc = replaceLargeImageUrl(node.src);
                            if (newSrc !== node.src) {
                                node.src = newSrc;
                            }
                        }
                        node.querySelectorAll?.('img').forEach((img) => {
                            if (img.src) {
                                const newSrc = replaceLargeImageUrl(img.src);
                                if (newSrc !== img.src) {
                                    img.src = newSrc;
                                }
                            }
                        });
                    }
                });
            });
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true,
        });
    });
})();
