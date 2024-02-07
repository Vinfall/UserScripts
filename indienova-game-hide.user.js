// ==UserScript==
// @name        indienova game hide
// @namespace   https://github.com/Vinfall/UserScripts
// @match       https://indienova.com/indie-game-news/guide*
// @match       https://indienova.com/indie-game-news/itch-new-games-*
// @grant       GM_getValue
// @grant       GM_setValue
// @version     3.0.0
// @author      Vinfall
// @description indienova「本周 Steam 值得关注的游戏」和「itch 一周游戏汇」隐藏包含特定关键字的游戏
// ==/UserScript==

(function () {
    'use strict';

    const defaultKeywords = [
        "多人在线", "恐怖", "僵尸", "黑暗奇幻", "自走棋", "玩家对战", "调酒", "SCP", "种植", "农场模拟",
        "乙女", "全动态影像", "城市营造"
        // "在线合作", // Grace for Granblue Fantasy: Relink
    ];
    const overrideDefault = true;

    // 获取当前变量
    var values = GM_getValue('values', {});
    // 检测是否存在keywords和overrideDefault
    if (values.keywords === undefined && values.overrideDefault === undefined) {
        // 不存在则设置默认值
        values.keywords = defaultKeywords;
        values.overrideDefault = overrideDefault;
        GM_setValue('values', values);
    }
    // 读取变量
    const customKeywords = values.keywords !== undefined ? values.keywords : defaultKeywords;
    const override = values.overrideDefault !== undefined ? values.overrideDefault : true;

    // 如果overrideDefault为false并且keywords变量存在，则合并keywords列表和默认列表并去重
    var keywords = override ? customKeywords : Array.from(new Set(defaultKeywords.concat(customKeywords)));


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