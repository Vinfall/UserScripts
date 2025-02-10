// ==UserScript==
// @name         Steam EA Date
// @namespace    https://github.com/Vinfall/UserScripts
// @version      0.1.4
// @author       Vinfall
// @match        https://store.steampowered.com/app/*
// @icon         https://store.steampowered.com/favicon.ico
// @grant        none
// @license      MIT
// @description  Show Early Access date on Steam card
// @description:zh-cn Steam 商店页面显示抢先体验发售日
// @run-at       document-end
// ==/UserScript==

(function () {
    'use strict';

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

    function addRow() {
        // get ea release date
        const eaDateElement = Array.from(document.querySelectorAll('.details_block b')).find((el) =>
            el.textContent.includes('Early Access Release Date:'),
        );
        const eaDate = eaDateElement ? eaDateElement.nextSibling.textContent.trim() : 'N/A';

        const eaDateRow = makeRow('ea_date', 'EA Release', eaDate);

        const releaseDate = document.querySelector('.release_date');

        if (releaseDate) {
            releaseDate.parentNode.insertBefore(eaDateRow, releaseDate);
            // } else if (releaseDateMobileContent) {
            //     releaseDateMobileContent.parentNode.insertBefore(eaDateRow, releaseDateMobileContent);
        } else {
            const firstDevRow = document.querySelector('.glance_ctn_responsive_left .dev_row');
            if (firstDevRow) {
                firstDevRow.parentNode.insertBefore(eaDateRow, firstDevRow);
            }
        }
    }

    addRow();
})();
