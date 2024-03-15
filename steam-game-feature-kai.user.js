// ==UserScript==
// @name         Steam Game Feature Kai
// @namespace    https://github.com/Vinfall/UserScripts
// @version      3.0.0
// @author       Vinfall
// @match        https://store.steampowered.com/app/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=steamcommunity.com
// @grant        none
// @license      CC0 1.0 Universal (Public Domain)
// @description  Alternative game feature outlinks on Steam store webpage
// @description:zh-cn Steam 商店页面游戏特性外链替换
// ==/UserScript==

(function () {
    const appId = /app\/(\d+)\//.exec(location.href)?.pop();
    if (appId) {
        console.log(appId);

        const warningColor = 'red';
        var conditions = [
            // Outlink replacement
            {
                srcIncludes: 'ico_achievements',
                text: 'AStats',
                href: 'https://astats.astats.nl/astats/Steam_Game_Info.php?AppID=' + appId
            },
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
            {
                srcIncludes: 'ico_workshop',
                text: 'Workshop',
                href: 'https://steamcommunity.com/workshop/browse/?appid=' + appId + '&browsesort=toprated&section=readytouseitems'
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
    } else {
        console.error('Unsupported URL');
    }
})();
