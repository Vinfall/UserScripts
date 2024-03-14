// ==UserScript==
// @name         Steam Game Feature Kai
// @namespace    https://github.com/Vinfall/UserScripts
// @version      2.0.0
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

        var elements = document.querySelectorAll('a.game_area_details_specs_ctn');
        elements.forEach(function (element) {
            if (element.querySelector('.icon img.category_icon').src.includes('ico_cloud')) {
                element.href = 'https://store.steampowered.com/account/remotestorageapp?appid=' + appId + '&index=0';
                element.querySelector('.label').innerText = "Cloudsave";
            } else if (element.querySelector('.icon img.category_icon').src.includes('ico_cards')) {
                element.href = 'https://www.steamcardexchange.net/index.php?gamepage-appid-' + appId + '/';
                element.querySelector('.label').innerText = "Steam Card Exchange";
            }
        });
    }
})();