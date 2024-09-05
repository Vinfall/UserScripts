// ==UserScript==
// @name               Discuz Short URL
// @name:zh-cn         Discuz 短链 URL
// @namespace          https://github.com/Vinfall/UserScripts
// @version            0.10.3
// @author             Vinfall
// @match              *://*/?mod=forumdisplay*
// @match              *://*/?mod=viewthread*
// @match              *://*/forum.php?mod=forumdisplay*
// @match              *://*/forum.php?mod=viewthread*
// @exclude-match      *://*/?*extra*
// @exclude-match      *://*/?*goto*
// @exclude-match      *://*/?mod=redirect*
// @exclude-match      *://*/forum.php?*goto*
// @exclude-match      *://*/forum.php?*pid*
// @exclude-match      *://*/forum.php?mod=redirect*
// @grant              none
// @run-at             document-start
// @license            Apache-2.0
// @description        Show short URL on Discuz forums
// @description:zh-cn  在 Discuz 论坛自动转换短链 URL
// ==/UserScript==

// Other match URL not added
// *://*/forum-*-*
// *://*/forum-*-*.html
// *://*/forum/search.php?*
// *://*/forum/viewforum.php?f=*
// *://*/showforum-*.html

// TODO:
// - Support more fields (only thread is supported) like forum, space uid (suid)
// - Enumerate & Test all mod methods
// - Support page info in extra param


(function () {
    'use strict';

    // 检测 Discuz 版本
    // const detectDiscuzVersion = () => {
    //     const metas = document.getElementsByTagName('meta');
    //     for (let i = 0; i < metas.length; i++) {
    //         const meta = metas[i];
    //         if (meta.name.toLowerCase() === 'generator') {
    //             const content = meta.content.toLowerCase();
    //             if (content.includes('discuz! x3.4')) {
    //                 return 'x3.4';
    //             } else if (content.includes('discuz! x')) {
    //                 return 'x';
    //             }
    //         }
    //     }
    //     return null;
    // };

    // const discuzVersion = detectDiscuzVersion();
    // if (discuzVersion !== 'x3.4') {
    //     console.log('Discuz version is not x3.4, no conversion will be performed.');
    //     return;
    // }

    // 定义字典
    const domainStyles = [{
            style: (protocol, domain, tid, page) => `${protocol}//${domain}/t${tid}-${page}-1`,
            domains: ['keylol.com']
        },
        {
            style: (protocol, domain, tid, page) => `${protocol}//${domain}/thread-${tid}-${page}-1.html`,
            domains: ['bbs.a9vg.com', 'bbs.3dmgame.com', 'game.ali213.net']
        }
    ];

    const currentUrl = window.location.href;

    // 解析 URL
    const urlObj = new URL(currentUrl);
    const params = new URLSearchParams(urlObj.search);

    // 检查 extra 参数，如包含 #pid 字符串则不转换
    // e.g. forum.php?mod=viewthread&tid=123456&page=3&extra=#pid19912345
    const extra = params.get('extra') || '';
    if (extra.includes('#pid')) {
        console.log('URL contains pid, conversion skipped.');
        return;
    }

    // 检查 tid 参数是否存在
    if (params.get('tid')) {
        const protocol = urlObj.protocol;
        const domain = urlObj.hostname;
        const tid = params.get('tid');
        // 如果没有 page 参数，则默认为 1
        // TODO: 部分 Discuz 论坛会把页数信息放在 extra 里
        const page = params.get('page') || 1;

        let newUrl;

        // 根据域名匹配字典中的 URL 样式
        let matched = false;
        for (const entry of domainStyles) {
            if (entry.domains.some(d => domain.includes(d))) {
                newUrl = entry.style(protocol, domain, tid, page);
                matched = true;
                break;
            }
        }

        // 如果没有匹配到，默认使用 thread-123456-1-1 格式
        // if (!matched) {
        //     newUrl = `${protocol}//${domain}/thread-${tid}-${page}-1.html`;
        // }

        if (newUrl) {
            window.location.replace(newUrl);
        }
    }
})();