// ==UserScript==
// @name         Skip Redirect Inplace
// @namespace    https://github.com/Vinfall/UserScripts
// @version      0.4.0
// @author       Vinfall
// @match        https://m.weibo.cn/detail/*
// @match        https://m.weibo.cn/status/*
// @match        https://sspai.com/*
// @run-at       document-end
// @grant        none
// @description  Skip stupid URL redirect before you ever click on it
// @description:zh-cn 文内替换外链跳转 URL
// ==/UserScript==

(function () {
    'use strict';

    // Function to decode and replace links based on rules
    function replaceLinks(rules = []) {
        // Check if the current URL matches any of the rules' href
        const currentUrl = window.location.href;

        rules.forEach(rule => {
            if (currentUrl.includes(rule.href)) {
                // Retrieve all <a> elements based on the selector rule
                const links = document.querySelectorAll(rule.selector);

                // Process each link
                links.forEach(link => {
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
            }
        });
    }

    // Define the rules as an array of objects
    const rules = [{
            href: 'https://sspai.com',
            selector: 'a[href*="https://sspai.com/link?target="]',
            regex: /https:\/\/sspai.com\/link\?target=([^&]+)/,
            observer: true
        },
        {
            href: 'https://m.weibo.cn',
            selector: 'a[href*="https://weibo.cn/sinaurl?u="]',
            regex: /https:\/\/weibo.cn\/sinaurl\?u=([^&]+)/,
            observer: true
        }
    ];

    // Run the function initially with the defined rules
    replaceLinks(rules);

    // Optionally, set up a mutation observer to handle dynamically added links based on the observer flag
    rules.forEach(rule => {
        if (rule.observer) {
            const observer = new MutationObserver(() => {
                replaceLinks([rule]); // Pass the individual rule to only re-run for this rule
            });
            observer.observe(document.body, {
                childList: true,
                subtree: true
            });
        }
    });
})();