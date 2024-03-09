// ==UserScript==
// @name         Steam Cloudsave Kai
// @namespace    https://github.com/Vinfall/UserScripts
// @version      1.2.1
// @author       WK, Vinfall
// @match        https://store.steampowered.com/app/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=steamcommunity.com
// @grant        none
// @license      MIT
// @description  Steam Cloudsave button on store webpage.
// @description:zh-cn Steam 商店页面添加访问云存档按钮
// ==/UserScript==

(function () {
    var url = location.href;
    var match = url.match(/app\/(\d+)\//);

    if (match) {
        var appId = match[1];
        console.log(appId);

        function getBrowserLanguage() {
            let language = navigator.language || navigator.userLanguage;
            if (!language) {
                language = 'en-US';
            }
            return language;
        }

        const language = getBrowserLanguage();

        var text = "Cloudsave";
        if (language == "zh-CN") {
            text = "云存档";
        } else if (language == "zh-TW") {
            text = "雲端";
        }

        var elements = document.querySelectorAll('a.game_area_details_specs_ctn');
        elements.forEach(function (element) {
            if (element.querySelector('.icon img.category_icon').src.includes('ico_cloud')) {
                element.href = 'https://store.steampowered.com/account/remotestorageapp?appid=' + appId + '&index=0';
                element.querySelector('.label').innerText = text;
            }
        });
    }
})();