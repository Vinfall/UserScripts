// ==UserScript==
// @name          Skip Redirect Inplace
// @namespace     https://github.com/Vinfall/UserScripts
// @version       1.1.1
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
// @match         https://www.touchgal.io/*
// @exclude-match https://www.tiangal.com/question*
// @exclude-match https://www.tiangal.com/sign*
// @exclude-match https://www.tiangal.com/tougao*
// @exclude-match https://www.tiangal.com/wp-login.php*
// @exclude-match https://www.touchgal.io/auth*
// @exclude-match https://www.touchgal.io/doc*
// @exclude-match https://www.touchgal.io/login
// @exclude-match https://www.touchgal.io/register
// @run-at        document-end
// @grant         none
// @icon          data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>⏭️</text></svg>
// @description   Skip stupid URL redirect before you ever click on it
// @description:zh-cn 文内替换外链跳转 URL
// ==/UserScript==

(function () {
    'use strict';

    const attributeShape = [
        { name: 'selector', type: 'string' },
        { name: 'regex', type: 'regexp' },
        { name: 'observer', type: 'boolean' },
    ];

    // prettier-ignore
    const simplifiedRules = [
        ['a[href*="https://sspai.com/link?target="]', /https:\/\/sspai.com\/link\?target=([^&]+)/, true],
        ['a[href*="https://weibo.cn/sinaurl?u="]', /https:\/\/weibo.cn\/sinaurl\?u=([^&]+)/, true],
        ['a[href*="https://hellogithub.com/periodical/statistics/click?target="]', /https:\/\/hellogithub.com\/periodical\/statistics\/click\?target=([^&]+)/, false],
        ['a[href*="https://www.gcores.com/link?target="]', /https:\/\/www\.gcores\.com\/link\?target=([^&]+)/, false],
        ['a[href*="//ref.gamer.com.tw/redir.php?url="]', /https:\/\/ref\.gamer\.com\.tw\/redir\.php\?url=([^&]+)/, false],
        ['a[href^="https://www.tiangal.com/go.html"]', /https:\/\/www.tiangal.com\/go.html\?url=([^&]+)/, false],
        ['a[href*="/redirect?url="]', /\/redirect\?url=([^&]+)/, true],
    ];

    function convertToStructuredRules(simplifiedRules, attributeShape) {
        return simplifiedRules.map((rule) => {
            let structuredRule = {};
            attributeShape.forEach((attr, index) => {
                if (typeof rule[index] !== attr.type && !(attr.type === 'regexp' && rule[index] instanceof RegExp)) {
                    throw new Error(`Expected ${attr.type} at position ${index}, but got ${typeof rule[index]}`);
                }
                structuredRule[attr.name] = rule[index];
            });
            return structuredRule;
        });
    }

    const rules = convertToStructuredRules(simplifiedRules, attributeShape);

    function decodeAndReplaceLink(link, regex) {
        const currentHref = link.href;

        // Extract real URL as per regex
        const urlMatch = currentHref.match(regex);
        if (urlMatch && urlMatch[1]) {
            // URL decode
            const realUrl = decodeURIComponent(urlMatch[1]);
            // Replace href attr
            link.href = realUrl;
        }
    }

    function processLinks(rules) {
        rules.forEach((rule) => {
            // Retrieve all elements as per selector rule
            const links = document.querySelectorAll(rule.selector);
            // Process each link
            links.forEach((link) => decodeAndReplaceLink(link, rule.regex));
        });
    }

    function setupMutationObserver(rules) {
        rules.forEach((rule) => {
            if (rule.observer) {
                const observer = new MutationObserver(() => {
                    // Pass the individual rule to only re-run for this rule
                    processLinks([rule]);
                });
                observer.observe(document.body, {
                    childList: true,
                    subtree: true,
                });
            }
        });
    }

    // Initial run
    processLinks(rules);

    // Optionally, set up mutation observer to fix dynamic link
    setupMutationObserver(rules);
})();
