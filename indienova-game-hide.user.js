// ==UserScript==
// @name        indienova game hide
// @namespace   https://github.com/Vinfall/UserScripts
// @match       https://indienova.com/indie-game-news/guide*
// @match       https://indienova.com/indie-game-news/itch-new-games-*
// @grant       none
// @version     2.0.3
// @author      Vinfall
// @description indienova「本周 Steam 值得关注的游戏」和「itch 一周游戏汇」隐藏包含特定关键字的游戏
// ==/UserScript==

(function () {
    'use strict';

    // 定义关键词字典
    var keywords = [
        "多人在线", "在线合作", "恐怖", "僵尸", "黑暗奇幻", "自走棋", "玩家对战", "调酒", "SCP", "种植",
        "农场模拟", "乙女", "全动态影像"
    ];

    // 等待页面完全加载后再运行脚本
    // window.addEventListener('load', function () {
    // 获取游戏列表的父元素
    var gameList = document.querySelector('.single-post.indienova-single-post.fr-view');

    // 获取所有h4元素
    var sections = gameList.querySelectorAll('h4');

    // 遍历游戏列表的各个部分
    for (var i = 0; i < sections.length; i++) {
        var section = sections[i];
        var nextElement = section.nextElementSibling;

        // 获取包含关键词的文本
        var text = nextElement.textContent;

        // 检查文本是否包含关键词
        var shouldHide = keywords.some(function (keyword) {
            return text.includes(keyword);
        });

        // 如果文本包含特定关键词，则隐藏当前部分及下一个h4之间的内容
        if (shouldHide) {
            while (nextElement && nextElement.tagName !== 'H4') {
                nextElement.style.display = 'none';
                nextElement = nextElement.nextElementSibling;
            }
        }
    }
    // });
})();