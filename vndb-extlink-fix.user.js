// ==UserScript==
// @name              VNDB Extlink Fix
// @name:zh-cn        VNDB 外链修复
// @namespace         https://github.com/Vinfall/UserScripts
// @version           0.1.0
// @author            Vinfall
// @match             https://vndb.org/p*
// @match             https://vndb.org/r
// @match             https://vndb.org/r*
// @match             https://vndb.org/*
// @exclude-match     https://vndb.org/d*
// @exclude-match     https://vndb.org/t
// @exclude-match     https://vndb.org/t*
// @exclude-match     https://vndb.org/u/login*
// @exclude-match     https://vndb.org/u/newpass
// @exclude-match     https://vndb.org/u/register
// @grant             none
// @run-at            document-end
// @license           CC0 1.0 Universal (Public Domain)
// @icon              data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>🛠️</text></svg>
// @description       Fix broken external link on VNDB
// @description:zh-cn 修复 VNDB 外链
// ==/UserScript==

(() => {
    // only replace links in tc_links table
    const links = document.querySelectorAll('.tc_links a');
    links.forEach((a) => {
        const url = a.href;
        // 1. JAST
        if (url.includes('jastusa.com')) {
            a.href = url.replace('jastusa.com', 'jaststore.com');
        }
        // 2. Getchu
        else if (url.includes('www.getchu.com/soft.phtml?id=')) {
            const id = new URL(url).searchParams.get('id');
            if (id) {
                a.href = `https://www.getchu.com/item/${id}`;
            }
        }
    });
})();
