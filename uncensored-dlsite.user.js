// ==UserScript==
// @name         Uncensored DLsite Genre List
// @namespace    https://github.com/Vinfall/UserScripts
// @version      1.0.0
// @author       Vinfall
// @match        https://www.dlsite.com/*
// @grant        none
// @description  Uncensored DLsite Genre List
// @description:zh-cn DLsite 屏蔽词还原
// @description:ja DLsite 特定語句に関しての旧規表現への置き換えは
// ==/UserScript==

(function () {
    'use strict';

    const keywordDictionary = {
        "ざぁ～こ♥": "メスガキ",
        "合意なし": "レイプ",
        "ひよこ": "ロリ",
        "ひよこババア": "ロリババア",
        "閉じ込め": "監禁",
        "超ひどい": "鬼畜",
        "逆し": "逆レイプ",
        "命令/無理矢理": "強制/無理矢理",
        "近親もの": "近親相姦",
        "責め苦": "拷問",
        "トランス/暗示": "催眠",
        "動物なかよし": "獣姦",
        "精神支配": "洗脳",
        "秘密さわさわ": "痴漢",
        "しつけ": "調教",
        "下僕": "奴隷",
        "屈辱": "陵辱",
        "回し": "輪姦",
        "虫えつち": "蟲姦",
        "モブおじさん": "モブ姦",
        "異種えつち": "異種姦",
        "機械責め": "機械姦",
        "すやすやえつち": "睡眠姦",
        "トランス/暗示ボイス": "催眠音声"
    };

    for (let key in keywordDictionary) {
        let regex = new RegExp(key, 'g');
        document.body.innerHTML = document.body.innerHTML.replace(regex, keywordDictionary[key]);
    }
})();