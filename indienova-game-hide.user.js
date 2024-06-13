// ==UserScript==
// @name        indienova game hide
// @namespace   https://github.com/Vinfall/UserScripts
// @match       https://indienova.com/indie-game-news/guide*
// @match       https://indienova.com/indie-game-news/itch-new-games-*
// @match       https://indienova.com/indie-game-news/wholesome-direct-*
// @grant       GM_getValue
// @grant       GM_setValue
// @version     5.1.0
// @author      Vinfall
// @description indienova「本周 Steam 值得关注的游戏」和「itch 一周游戏汇」隐藏包含特定关键字的游戏
// ==/UserScript==

(function () {
    'use strict';

    // 初始化常量
    const defaultKeywords = [
        "多人在线", "恐怖", "僵尸", "黑暗奇幻", "自走棋", "玩家对战", "调酒", "SCP", "种植", "农场模拟",
        "乙女", "全动态影像", "城市营造", "社交聚会", "洛夫克拉夫特式", "打字", "自动化", "团队导向", "摔角",
        "中世纪", "刷宝", "类魂系列", "农场管理", "步行模拟", "基地建设", "AI 生成内容", "Rogue", "开放世界生存"
        // "在线合作", "类银河战士恶魔城"
    ];
    const overrideDefault = true;

    // 检测变量是否存在
    if (GM_getValue('keywords') === undefined && GM_getValue('ovverideDefault') === undefined) {
        // 不存在则设置默认值
        GM_setValue('keywords', defaultKeywords);
        GM_setValue('overrideDefault', overrideDefault);
    }
    // 读取变量
    const customKeywords = GM_getValue('keywords') !== undefined ? GM_getValue('keywords') : defaultKeywords;
    const override = GM_getValue('ovverideDefault') !== undefined ? GM_getValue('ovverideDefault') : true;

    // 如果overrideDefault为false并且keywords变量存在，则合并keywords列表和默认列表并去重
    var keywords = override ? customKeywords : Array.from(new Set(defaultKeywords.concat(customKeywords)));


    // 等待页面完全加载后再运行脚本
    // window.addEventListener('load', function () {
    // 获取游戏列表的父元素
    var gameList = document.querySelector('.single-post.indienova-single-post.fr-view');

    // 获取所有h4元素
    var sections = gameList.querySelectorAll('h4');

    // 定义一个函数来切换显示状态
    function toggleDisplay(element) {
        var display = element.style.display;
        element.style.display = display === 'none' ? 'block' : 'none';
    }

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
            // 创建按钮
            var button = document.createElement('button');
            button.innerHTML = '显示/隐藏';
            button.style.display = 'block';

            // 创建一个数组来存储将要隐藏的内容
            var contentToHide = [];

            // 隐藏当前部分及下一个h4之间的内容
            while (nextElement && nextElement.tagName !== 'H4') {
                contentToHide.push(nextElement);
                nextElement.style.display = 'none';
                nextElement = nextElement.nextElementSibling;
            }

            // 使用立即执行函数(IIFE)为每个按钮创建一个独立的作用域
            (function (contentToHide) {
                button.addEventListener('click', function () {
                    contentToHide.forEach(toggleDisplay);
                });
            })(contentToHide.slice()); // 使用 slice() 来复制数组，确保每个按钮都有自己的数组副本

            // 插入按钮到页面中
            section.parentNode.insertBefore(button, section.nextSibling);
        }
    }
    // });
})();