// ==UserScript==
// @name         Censored DLsite Genre List
// @namespace    https://github.com/Vinfall/UserScripts
// @version      1.0.0
// @author       Vinfall
// @match        https://www.dlsite.com/*
// @grant        none
// @description  Censored DLsite Genre List
// @description:zh-cn DLsite 屏蔽词和文本替换实现
// @description:ja DLsite 特定語句に関しての新規表現への置き換えは
// ==/UserScript==

(function () {
    'use strict';

    const keywordDictionary = {
        "メスガキ": "ざぁ～こ♥",
        "レイプ": "合意なし",
        "ロリ": "ひよこ",
        "ロリババア": "ひよこババア",
        "監禁": "閉じ込め",
        "鬼畜": "超ひどい",
        "逆レイプ": "逆し",
        "強制/無理矢理": "命令/無理矢理",
        "近親相姦": "近親もの",
        "拷問": "責め苦",
        "催眠": "トランス/暗示",
        "獣姦": "動物なかよし",
        "洗脳": "精神支配",
        "痴漢": "秘密さわさわ",
        "調教": "しつけ",
        "奴隷": "下僕",
        "陵辱": "屈辱",
        "輪姦": "回し",
        "蟲姦": "虫えつち",
        "モブ姦": "モブおじさん",
        "異種姦": "異種えつち",
        "機械姦": "機械責め",
        "睡眠姦": "すやすやえつち",
        "催眠音声": "トランス/暗示ボイス"
    };

    for (let key in keywordDictionary) {
        let regex = new RegExp(key, 'g');
        document.body.innerHTML = document.body.innerHTML.replace(regex, keywordDictionary[key]);
    }
})();