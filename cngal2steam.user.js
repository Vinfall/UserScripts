// ==UserScript==
// @name         CnGal on Steam
// @namespace    https://github.com/Vinfall/UserScripts
// @version      0.3.4
// @author       Vinfall
// @match        https://store.steampowered.com/app/*
// @icon         https://www.cngal.org/favicon.ico
// @grant        GM_xmlhttpRequest
// @license      MIT
// @description  Show CnGal link on Steam
// @description:zh-cn 在 Steam 商店页面显示 CnGal 链接
// @connect      api.cngal.org
// @run-at       document-end
// ==/UserScript==

/*
    Doc: https://api.cngal.org/swagger/index.html
    API: /api/storeinfo/GetAllGameStoreInfo
*/

(() => {
    const appId = /app\/(\d+)\//.exec(location.href)?.pop();
    const cacheTime = 3000; // in seconds, 5 minutes by default
    const cacheKey = 'cngal_steam';

    function makeRow(rowClass, subtitle, linkText, linkUrl) {
        const row = document.createElement('div');
        row.className = `dev_row ${rowClass}`;

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

    function fetchData() {
        GM_xmlhttpRequest({
            method: 'GET',
            url: 'https://api.cngal.org/api/storeinfo/GetAllGameStoreInfo',
            headers: {
                accept: 'application/json',
            },
            // platformType only has "Steam", and API response only contains entries with a platform
            // jq -r '.[].id' GetAllGameStoreInfo.json | wc -l
            // jq -r '.[].platformType' GetAllGameStoreInfo.json | wc -l
            onload: (response) => {
                const result = JSON.parse(response.responseText);
                const cacheData = {
                    data: result,
                    timestamp: Date.now(),
                };
                localStorage.setItem(cacheKey, JSON.stringify(cacheData));
                processData(result);
            },
            onerror: (error) => {
                console.error('Error fetching data from CnGal API:', error);
            },
        });
    }

    function processData(data) {
        const item = data.find((game) => game.platformType === 'Steam' && game.link === appId);
        // TODO: log appid & name, but only when it has "Visual Novel" or "Dating Sim" tag
        if (!item) {
            console.log('Game not listed on CnGal.');
            return;
        }

        const cngalIdRow = makeRow('cngal_id', 'CnGal', item.id, `https://www.cngal.org/entries/index/${item.id}`);

        const releaseDate = document.querySelector('.release_date');
        const vndbIdRow = document.querySelector('.dev_row vndb_id');
        // TODO: fix selector on cromite
        // const releaseDateMobileLabels = document.querySelectorAll('.grid_label.grid_date');
        // const releaseDateMobileContent =
        //     releaseDateMobileLabels.length > 0 ? releaseDateMobileLabels[0].nextElementSibling : null;

        if (vndbIdRow) {
            vndbIdRow.parentNode.insertBefore(cngalIdRow, vndbIdRow);
        } else if (releaseDate) {
            releaseDate.parentNode.insertBefore(cngalIdRow, releaseDate.nextSibling);
            // } else if (releaseDateMobileContent) {
            //     releaseDateMobileContent.parentNode.insertBefore(cngalIdRow, releaseDateMobileContent.nextSibling);
        } else {
            const firstDevRow = document.querySelector('.glance_ctn_responsive_left .dev_row');
            if (firstDevRow) {
                firstDevRow.parentNode.insertBefore(cngalIdRow, firstDevRow);
            }
        }
    }

    const cachedData = JSON.parse(localStorage.getItem(cacheKey));
    if (cachedData && Date.now() - cachedData.timestamp < cacheTime * 1000) {
        processData(cachedData.data);
    } else {
        fetchData();
    }
})();
