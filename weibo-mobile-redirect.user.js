// ==UserScript==
// @name              Weibo Mobile Redirect
// @name:zh-cn        新浪微博移动版跳转
// @namespace         https://github.com/Vinfall/UserScripts
// @version           1.1.0
// @author            Vinfall
// @match             https://video.weibo.com/show?fid=*
// @match             https://weibo.com/*/*
// @match             https://weibo.com/ttarticle/p/show?id=*
// @match             https://www.weibo.com/detail/*
// @exclude-match     https://card.weibo.com/article/*
// @exclude-match     https://m.weibo.cn/detail/*
// @exclude-match     https://m.weibo.cn/status/*
// @exclude-match     https://passport.weibo.com/*
// @exclude-match     https://weibo.com/signup/*
// @exclude-match     https://weibo.com/tv/show/*
// @exclude-match     https://weibo.com/u/*
// @grant             none
// @run-at            document-start
// @license           CC0 1.0 Universal (Public Domain)
// @icon              https://m.weibo.cn/favicon.ico
// @description       Auto redirect Weibo to mobile version
// @description:zh-cn 新浪微博自动跳转移动版，支持微博、文章、视频
// ==/UserScript==

(function () {
    'use strict';

    const currentUrl = window.location.href;

    // Defend in depth
    if (currentUrl.includes('card.weibo.com') || currentUrl.includes('m.weibo.cn')) {
        return;
    }

    // TODO: fix redirect to passport.weibo.com when nojs is OFF
    // function delayedRedirect(url, delay = 500) {
    //     setTimeout(() => {
    //         window.location.replace(url);
    //     }, delay);
    // }

    const cases = [
        // weibo.com/ttarticle/p/show?id=*
        {
            pattern: /^https:\/\/weibo\.com\/ttarticle\/p\/show\?id=(\d+)/,
            handle: (match) => {
                const articleId = match[1];
                const articleMobileUrl = `https://card.weibo.com/article/h5/s#cid=${articleId}`;
                window.location.replace(articleMobileUrl);
            },
        },
        // weibo.com/1234567890/abcdEFG89
        {
            pattern: /^https:\/\/weibo\.com\/\d{10}\/(\w{9})/,
            handle: (match) => {
                const statusId = match[1];
                const statusMobileUrl = `https://m.weibo.cn/status/${statusId}`;
                window.location.replace(statusMobileUrl);
                // delayedRedirect(statusMobileUrl);
            },
        },
        // video.weibo.com/show?fid=1234:1234567890123456
        // always auto redirect, added just in case
        {
            pattern: /^https:\/\/video\.weibo\.com\/show\?fid=(\d{4}:\d+)/,
            handle: (match) => {
                const fid = match[1];
                const videoUrl = `https://weibo.com/tv/show/${fid}`;
                window.location.replace(statusMobileUrl);
            },
        },
        // weibo.com/detail/*
        // no longer exists nowadays
    ];

    for (const caseItem of cases) {
        const match = currentUrl.match(caseItem.pattern);
        if (match) {
            caseItem.handle(match);
            return;
        }
    }
})();