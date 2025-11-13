// ==UserScript==
// @name        indienova game hide
// @namespace   https://github.com/Vinfall/UserScripts
// @author      Vinfall
// @version     5.2.12
// @match       https://indienova.com/indie-game-news/guide*
// @match       https://indienova.com/indie-game-news/itch-new-games-*
// @match       https://indienova.com/indie-game-news/wholesome-direct-*
// @grant       GM_getValue
// @grant       GM_setValue
// @icon        data:image/png;base64,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
// @description indienova「本周 Steam 值得关注的游戏」和「itch 一周游戏汇」隐藏包含特定关键字的游戏
// ==/UserScript==

/*
TODO:
- 支持 `/news-of-overseas-indie-games-and-industry` 页面的 demo 列表 (`p` element instead of `H4`, [example](https://indienova.com/indie-game-news/news-of-overseas-indie-games-and-industry-vol-15/#iah-2))
- 支持 `/indie-game-news/steam-next-fest-*` 页面的 demo 列表
*/

(() => {
    // 初始化常量
    // biome-ignore format: do not touch my keywords
    const defaultKeywords = [
        "多人在线", "恐怖", "惊悚", "僵尸", "黑暗奇幻", "自走棋", "调酒", "SCP", "种植", "农场模拟",
        "乙女", "全动态影像", "城市营造", "社交聚会", "洛夫克拉夫特式", "打字", "自动化", "团队导向", "摔角",
        "中世纪", "刷宝", "类魂系列", "农场管理", "农业", "步行模拟", "基地建设", "AI 生成内容",
        "开放世界生存", "迷幻", "大逃杀", "4X", "玩家对战", "战锤 40K", "邪典", "益智问答", "社交推理",
        "动作类 Rogue", "电脑角色扮演", "蓄意操控困难", "程序生成", "赌博", "集换式卡牌"
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
    const keywords = override ? customKeywords : Array.from(new Set(defaultKeywords.concat(customKeywords)));

    // 等待页面完全加载后再运行脚本
    // window.addEventListener('load', function () {
    // 获取游戏列表的父元素
    const gameList = document.querySelector('.single-post.indienova-single-post.fr-view');

    // 获取所有h4元素
    const sections = gameList.querySelectorAll('h4');

    // 定义一个函数来切换显示状态
    function toggleDisplay(element) {
        const display = element.style.display;
        element.style.display = display === 'none' ? 'block' : 'none';
    }

    // 遍历游戏列表的各个部分
    for (let i = 0; i < sections.length; i++) {
        const section = sections[i];
        let nextElement = section.nextElementSibling;

        // 获取包含关键词的文本
        const text = nextElement.textContent;

        // 检查文本是否包含关键词
        const shouldHide = keywords.some((keyword) => text.includes(keyword));

        // 如果文本包含特定关键词，则隐藏当前部分及下一个h4之间的内容
        if (shouldHide) {
            // 创建按钮
            const button = document.createElement('button');
            button.innerHTML = '显示/隐藏';
            button.style.display = 'block';

            // 创建一个数组来存储将要隐藏的内容
            const contentToHide = [];

            // 隐藏当前部分及下一个h4之间的内容
            while (nextElement && nextElement.tagName !== 'H4') {
                contentToHide.push(nextElement);
                nextElement.style.display = 'none';
                nextElement = nextElement.nextElementSibling;
            }

            // 使用立即执行函数(IIFE)为每个按钮创建一个独立的作用域
            ((contentToHide) => {
                button.addEventListener('click', () => {
                    contentToHide.forEach(toggleDisplay);
                });
            })(contentToHide.slice()); // 使用 slice() 来复制数组，确保每个按钮都有自己的数组副本

            // 插入按钮到页面中
            section.parentNode.insertBefore(button, section.nextSibling);
        }
    }
    // });
})();
