// ==UserScript==
// @name          Skip Redirect Inplace
// @namespace     https://github.com/Vinfall/UserScripts
// @version       0.9.1
// @author        Vinfall
// @match         https://acg.gamer.com.tw/*
// @match         https://forum.gamer.com.tw/*
// @match         https://gnn.gamer.com.tw/*
// @match         https://m.gamer.com.tw/forum/*
// @match         https://m.weibo.cn/detail/*
// @match         https://m.weibo.cn/status/*
// @match         https://m.weibo.cn/u/*
// @match         https://sspai.com/*
// @match         https://www.cnblogs.com/*
// @match         https://www.gcores.com/*
// @match         https://www.tiangal.com/*
// @exclude-match https://www.tiangal.com/wp-login.php*
// @run-at        document-end
// @grant         none
// @icon          data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>⏭️</text></svg>
// @description   Skip stupid URL redirect before you ever click on it
// @description:zh-cn 文内替换外链跳转 URL
// ==/UserScript==

(function () {
    'use strict';

    // Function to decode and replace links based on rules
    function replaceLinks(rules = []) {
        rules.forEach((rule) => {
            // Retrieve all <a> elements based on the selector rule
            const links = document.querySelectorAll(rule.selector);

            // Process each link
            links.forEach((link) => {
                // Get the current href value
                const currentHref = link.href;

                // Extract the real URL using the provided regex
                const urlMatch = currentHref.match(rule.regex);
                if (urlMatch && urlMatch[1]) {
                    // Decode the URL component
                    const realUrl = decodeURIComponent(urlMatch[1]);
                    // Replace the href attribute with the real URL
                    link.href = realUrl;
                }
            });
        });
    }

    const rules = [
        // Define the rules as an array of objects
        {
            selector: 'a[href*="https://sspai.com/link?target="]',
            regex: /https:\/\/sspai.com\/link\?target=([^&]+)/,
            observer: true,
        },
        {
            selector: 'a[href*="https://weibo.cn/sinaurl?u="]',
            regex: /https:\/\/weibo.cn\/sinaurl\?u=([^&]+)/,
            observer: true,
        },
        {
            selector: 'a[href*="https://hellogithub.com/periodical/statistics/click?target="]',
            regex: /https:\/\/hellogithub.com\/periodical\/statistics\/click\?target=([^&]+)/,
            observer: false,
        },
        {
            selector: 'a[href*="https://www.gcores.com/link?target="]',
            regex: /https:\/\/www\.gcores\.com\/link\?target=([^&]+)/,
            observer: false,
        },
        {
            selector: 'a[href*="//ref.gamer.com.tw/redir.php?url="]',
            regex: /https:\/\/ref\.gamer\.com\.tw\/redir\.php\?url=([^&]+)/,
            observer: false,
        },
        {
            selector: 'a[href^="https://www.tiangal.com/go.html"]',
            regex: /https:\/\/www.tiangal.com\/go.html\?url=([^&]+)/,
            observer: false,
        },
    ];

    // Run the function initially with the defined rules
    replaceLinks(rules);

    // Optionally, set up a mutation observer to handle dynamically added links based on the observer flag
    rules.forEach((rule) => {
        if (rule.observer) {
            const observer = new MutationObserver(() => {
                replaceLinks([rule]); // Pass the individual rule to only re-run for this rule
            });
            observer.observe(document.body, {
                childList: true,
                subtree: true,
            });
        }
    });
})();
