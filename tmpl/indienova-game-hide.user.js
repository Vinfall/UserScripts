// ==UserScript==
// @name        indienova game hide
// @namespace   https://github.com/Vinfall/UserScripts
// @version     5.8.1
// @author      Vinfall
// @match       https://indienova.com/indie-game-news/guide*
// @match       https://indienova.com/indie-game-news/itch-new-games-*
// @match       https://indienova.com/indie-game-news/steam-next-fest-*
// @match       https://indienova.com/indie-game-news/wholesome-direct-*
// @grant       none
// @run-at      document-end
// @license     CC0 1.0 Universal (Public Domain)
// @icon        data:image/png;base64,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
// @description indienova 隐藏包含特定关键字的游戏，支持「本周 Steam 值得关注的游戏」、「itch 一周游戏汇」和部分特刊
// ==/UserScript==

(() => {
    // 初始化常量
    // biome-ignore format: do not touch my keywords
    const keywords = [
        "多人在线", "恐怖", "惊悚", "僵尸", "黑暗奇幻", "自走棋"
        // "类银河战士恶魔城", "自动化"
    ];

    // 等待页面完全加载后再运行脚本
    // window.addEventListener('load', function () {
    // 获取游戏列表的父元素
    const gameList = document.querySelector('.single-post.indienova-single-post.fr-view');
    if (!gameList) return;

    const currentUrl = window.location.href;

    function addFilterButton(heading, tags) {
        if (!keywords.some((keyword) => tags.includes(keyword))) return;

        const button = document.createElement('button');
        button.textContent = `🚫 已过滤: ${tags}`;
        button.style.display = 'block';

        const contentToHide = [];

        // 隐藏当前 heading 之后、下一个同类项 heading 之前的内容
        let nextElement = heading.nextElementSibling;
        while (nextElement && nextElement.tagName !== heading.tagName) {
            contentToHide.push(nextElement);
            nextElement = nextElement.nextElementSibling;
        }

        const originalDisplays = contentToHide.map((element) => element.style.display);
        contentToHide.forEach((element) => {
            element.style.display = 'none';
        });

        let isHidden = true;
        button.addEventListener('click', () => {
            contentToHide.forEach((element, index) => {
                element.style.display = isHidden ? originalDisplays[index] : 'none';
            });
            isHidden = !isHidden;
        });

        // 按钮放在标题之后，标题本身始终保留
        heading.parentNode.insertBefore(button, heading.nextSibling);
    }

    // steam-next-fest-*
    // <div class="single-post indienova-single-post fr-view">
    // <h4 id="iah-0">Steam 新品节</h4>
    // <h4 id="iah-1">xxx</h4>
    // </div>
    if (currentUrl.includes('steam-next-fest-')) {
        const startHeading = gameList.querySelector('h4#iah-1');
        if (!startHeading) return;
        const games = [...gameList.querySelectorAll('h5')].filter(
            (game) => startHeading.compareDocumentPosition(game) & Node.DOCUMENT_POSITION_FOLLOWING,
        );
        for (const game of games) {
            // 当前 h5 后、下一个 h5 前带有“关键字：”的 <p>
            let keywordParagraph = game.nextElementSibling;
            while (keywordParagraph && keywordParagraph.tagName !== 'H5') {
                if (keywordParagraph.tagName === 'P' && /^\s*关键字\s*[:：]/.test(keywordParagraph.textContent)) {
                    break;
                }
                keywordParagraph = keywordParagraph.nextElementSibling;
            }
            if (!keywordParagraph || keywordParagraph.tagName === 'H5') continue;

            // 关键字：动作冒险、3D 格斗；blahblah -> 动作冒险、3D 格斗
            const match = keywordParagraph.textContent.trim().match(/^关键字\s*[:：]\s*([^；;]*)/);
            const tags = match?.[1]?.trim() ?? '';
            addFilterButton(game, tags);
        }
        return;
    }

    // 获取目标 h4 列表
    const allSections = [...gameList.querySelectorAll('h4')];
    let sections;
    // wholesome-direct-*
    if (currentUrl.includes('wholesome-direct-')) {
        sections = allSections;
    }
    // guide*
    // <h4 id="iah-0">xxx</h4>
    // <h4 id="iah-xxx">本周其他值得关注的作品</h4>
    else if (currentUrl.includes('guide')) {
        const startIndex = allSections.findIndex((section) => section.id === 'iah-0');
        const endIndex = allSections.findIndex(
            (section, index) => index > startIndex && section.textContent.trim() === '本周其他值得关注的作品',
        );
        // fallback to allSections if not found
        sections = allSections.slice(startIndex + 1, endIndex === -1 ? allSections.length : endIndex);
    }
    // itch-new-games-*
    // <h4 id="iah-0">xxx</h4>
    // <h4 id="iah-xxx">下半部分</h4>
    else if (currentUrl.includes('itch-new-games-')) {
        const startIndex = allSections.findIndex((section) => section.id === 'iah-0');
        const endIndex = allSections.findIndex(
            (section, index) => index > startIndex && section.textContent.trim() === '下半部分',
        );
        sections = allSections.slice(startIndex + 1, endIndex === -1 ? allSections.length : endIndex);
    }
    // noop
    else {
        sections = [];
    }

    for (const section of sections) {
        const text = section.nextElementSibling?.textContent;
        if (text === undefined) continue;
        const tags = text.replace('关键字：', '').trim();
        addFilterButton(section, tags);
    }
    // });
})();
