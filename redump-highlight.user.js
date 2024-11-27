// ==UserScript==
// @name              Redump Download Highlight
// @name:zh-cn        Redump 下载高亮
// @namespace         https://github.com/Vinfall/UserScripts
// @version           0.5.5
// @author            Vinfall
// @match             http://redump.org/downloads/
// @grant             none
// @run-at            document-end
// @license           CC0 1.0 Universal (Public Domain)
// @icon              data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>💡</text></svg>
// @description       Highlight platforms in redump download page
// @description:zh-cn Redump 下载界面特定平台高亮
// ==/UserScript==

(function () {
    'use strict';

    // set border line
    const style = document.createElement('style');
    style.innerHTML = `
            table {
                border-collapse: collapse;
            }
            td, th {
                border: 1px solid #000;
                padding: 8px;
            }
        `;
    document.head.appendChild(style);

    // highlight keywords
    const keywords = [
        'Fujitsu FM Towns series',
        'IBM PC compatible',
        'Microsoft Xbox',
        'Microsoft Xbox 360',
        'NEC PC Engine CD & TurboGrafx CD',
        'NEC PC-88 series',
        'NEC PC-98 series',
        'NEC PC-FX & PC-FXGA',
        'Neo Geo CD',
        'Nintendo GameCube',
        'Nintendo Wii',
        'Panasonic 3DO Interactive Multiplayer',
        'Sega Dreamcast',
        'Sega Mega CD & Sega CD',
        'Sega Saturn',
        'Sharp X68000',
        'Sony PlayStation',
        'Sony PlayStation 2',
        'Sony PlayStation 3',
        'Sony PlayStation Portable',
    ];

    const rows = document.querySelectorAll('tr');
    rows.forEach((row) => {
        const firstTd = row.querySelector('td');
        if (firstTd) {
            const tdText = firstTd.textContent.trim();
            if (keywords.includes(tdText)) {
                // set highlight color
                firstTd.style.color = '#7ce49a';
                // or set backcolor
                // firstTd.style.backgroundColor = '#7ce49a'
            }
        }
    });
})();
