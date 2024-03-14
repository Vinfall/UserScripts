// ==UserScript==
// @name         Steam Game Feature Kai
// @namespace    https://github.com/Vinfall/UserScripts
// @version      2.4.1
// @author       WK, Vinfall
// @match        https://store.steampowered.com/app/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=steamcommunity.com
// @grant        none
// @license      MIT
// @description  Alternative game feature outlinks on Steam store webpage
// @description:zh-cn Steam 商店页面游戏特性外链替换
// ==/UserScript==

(function () {
    var url = location.href;
    var match = url.match(/app\/(\d+)\//);

    if (match) {
        var appId = match[1];
        console.log(appId);

        const warningColor = 'red';
        var conditions = [
            // Outlink replacement
            {
                srcIncludes: 'ico_cloud',
                text: 'Cloudsave',
                href: 'https://store.steampowered.com/account/remotestorageapp?appid=' + appId + '&index=0'
            },
            {
                srcIncludes: 'ico_cards',
                text: 'Steam Card Exchange',
                href: 'https://www.steamcardexchange.net/index.php?gamepage-appid-' + appId + '/'
            },
            // Warning on unexpected feature
            {
                // 'ico_cart' is IAP
                srcIncludes: ['ico_coop', 'ico_multiPlayer', 'ico_cart', 'ico_vac'],
                color: warningColor
            }
        ];

        // TODO: expand to div.page_content > .game_meta_data.rightcol for better matching
        var elements = document.querySelectorAll('a.game_area_details_specs_ctn');
        elements.forEach(function (element) {
            conditions.forEach(function (condition) {
                if (Array.isArray(condition.srcIncludes)) {
                    if (condition.srcIncludes.some(src => element.querySelector('.icon img.category_icon').src.includes(src))) {
                        // Set color on unwanted feature
                        if (condition.color) {
                            element.querySelector('.label').style.color = condition.color;
                            element.querySelector('.label').style.fontWeight = 'bold';
                        }
                    }
                } else {
                    // Replace outlink otherwise
                    if (element.querySelector('.icon img.category_icon').src.includes(condition.srcIncludes)) {
                        element.href = condition.href;
                        element.querySelector('.label').innerText = condition.text;
                    }
                }
            });
        });
    }
})();