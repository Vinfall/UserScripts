// ==UserScript==
// @name         CnGal Steam Enhancer
// @namespace    https://github.com/Vinfall/UserScripts
// @version      0.2.1
// @author       Vinfall
// @match        https://store.steampowered.com/app/*
// @icon         https://www.cngal.org/favicon.ico
// @grant        GM_xmlhttpRequest
// @license      CC0 1.0 Universal (Public Domain)
// @description  Show CnGal link on Steam
// @description:zh-cn 在 Steam 商店页面显示 CnGal 链接
// @connect      api.cngal.org
// @run-at       document-end
// ==/UserScript==

/*
    Doc: https://api.cngal.org/swagger/index.html
    API: /api/storeinfo/GetAllGameStoreInfo
    TODO: cache?
*/

(function () {
    'use strict';

    const appId = /app\/(\d+)\//.exec(location.href)?.pop();

    function makeRow(rowClass, subtitle, linkText, linkUrl) {
        const row = document.createElement('div');
        row.className = 'dev_row ' + rowClass;

        const subtitleEl = document.createElement('div');
        subtitleEl.className = 'subtitle column';
        subtitleEl.textContent = subtitle;

        let linkEl;
        if (linkUrl) {
            linkEl = document.createElement('a');
            linkEl.className = 'date';
            linkEl.textContent = linkText;
            linkEl.href = linkUrl;
        } else {
            linkEl = document.createElement('div');
            linkEl.className = 'date';
            linkEl.textContent = linkText;
        }

        row.appendChild(subtitleEl);
        row.appendChild(linkEl);

        return row;
    }

    GM_xmlhttpRequest({
        method: 'GET',
        url: 'https://api.cngal.org/api/storeinfo/GetAllGameStoreInfo',
        headers: {
            accept: 'application/json',
        },
        onload: function (response) {
            let result = JSON.parse(response.responseText);
            let item = result.find((game) => game.platformType === 'Steam' && game.link == appId);
            if (!item) {
                console.log('Appid does not exist on CnGal');
                return;
            }

            const cngalIdRow = makeRow('cngal_id', 'CNGAL', item.id, `https://www.cngal.org/entries/index/${item.id}`);

            const releaseDate = document.querySelector('.release_date');

            if (releaseDate) {
                releaseDate.parentNode.insertBefore(cngalIdRow, releaseDate.nextSibling);
            } else {
                const firstDevRow = document.querySelector('.glance_ctn_responsive_left .dev_row');
                if (firstDevRow) {
                    firstDevRow.parentNode.insertBefore(cngalIdRow, firstDevRow);
                }
            }
        },
        onerror: function (error) {
            console.error('Error fetching data from CnGal API:', error);
        },
    });
})();
