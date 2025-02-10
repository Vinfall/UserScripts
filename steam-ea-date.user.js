// ==UserScript==
// @name         Steam EA Date
// @namespace    https://github.com/Vinfall/UserScripts
// @version      0.2.1
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

    function makeRow(_rowClass, subtitle, text) {
        const row = document.createElement('div');
        row.className = 'release_date';

        const subtitleEl = document.createElement('div');
        subtitleEl.className = 'subtitle column';
        subtitleEl.textContent = subtitle;

        const dateEl = document.createElement('div');
        dateEl.className = 'date';
        dateEl.textContent = text;

        row.appendChild(subtitleEl);
        row.appendChild(dateEl);

        return row;
    }

    function addRow() {
        const EA_TEXTS = [
            { text: 'Early Access Release Date:', label: 'EA Release:' },
            { text: '抢先体验发行日期:', label: '抢先体验:' },
        ];
        const eaDateElement = Array.from(document.querySelectorAll('.details_block b')).find((el) =>
            EA_TEXTS.some((item) => el.textContent.includes(item.text)),
        );
        if (!eaDateElement) return; // exit if it's not an ea release

        const matchedText = EA_TEXTS.find((item) => eaDateElement.textContent.includes(item.text));
        const eaDate = eaDateElement.nextSibling.textContent.trim();
        const eaDateRow = makeRow('ea_date', matchedText.label, eaDate);

        const releaseDate = document.querySelector('.release_date');

        if (releaseDate) {
            releaseDate.parentNode.insertBefore(eaDateRow, releaseDate.nextSibling);
        } else {
            const firstDevRow = document.querySelector('.glance_ctn_responsive_left .dev_row');
            if (firstDevRow) {
                firstDevRow.parentNode.insertBefore(eaDateRow, firstDevRow);
            }
        }
    }

    addRow();
})();
