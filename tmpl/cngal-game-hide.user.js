// ==UserScript==
// @name              CnGal Game Hide
// @namespace         https://github.com/Vinfall/UserScripts
// @version           1.0.35
// @author            Vinfall
// @match             https://www.cngal.org/articles/index/*
// @grant             none
// @run-at            document-idle
// @license           CC0 1.0 Universal (Public Domain)
// @icon              https://www.cngal.org/favicon.ico
// @description       「CnGal 每周速报」隐藏包含特定关键字的消息
// ==/UserScript==
(() => {
    // biome-ignore format: do not touch my keywords
    const blockedKeywords = [
        // dev
        '零创游戏', '嵇零', '绘恋企划屋',
        // rel
        '中国式相亲', '叛逆神魂',
        // promo
        '众筹', '广播剧', '二游', '周边', '表情包' // '原创音乐', '主题歌', 'OP', 'PV', 'OST'
    ];

    // <div class="aspect-ratio">&lt;/div&gt;
    function fixDivs() {
        document.querySelectorAll('div.aspect-ratio').forEach((div) => {
            const fragment = document.createDocumentFragment();

            while (div.firstChild) {
                fragment.appendChild(div.firstChild);
            }

            div.replaceWith(fragment);
        });
    }

    function createFilterButton(titleText) {
        const btn = document.createElement('button');
        btn.append('🚫 已过滤: ');
        const title = document.createElement('b');
        title.textContent = titleText;
        btn.appendChild(title);
        btn.style.cssText = `
                display:block;
                width:100%;
                margin:10px 0;
                padding:8px;
                border:1px dashed;
                border-radius:4px;
                background:none;
                color:inherit;
                text-align:left;
                font-size:inherit;
            `;
        return btn;
    }

    function doFilter() {
        fixDivs();

        const allH3 = document.querySelectorAll('h3');
        allH3.forEach((h3) => {
            if (h3.dataset.filtered === 'true') return;
            const titleText = h3.textContent.trim();
            const shouldHide = blockedKeywords.some((word) => titleText.includes(word));
            if (!shouldHide) return;
            h3.dataset.filtered = 'true';
            const contentToHide = [];
            let follower = h3;
            while (follower) {
                contentToHide.push(follower);
                const next = follower.nextElementSibling;
                if (!next || next.matches('h2, h3')) {
                    break;
                }
                follower = next;
            }
            const btn = createFilterButton(titleText);
            contentToHide.forEach((el) => {
                el.style.display = 'none';
            });
            btn.addEventListener('click', () => {
                const isHidden = contentToHide[0].style.display === 'none';
                contentToHide.forEach((el) => {
                    el.style.display = isHidden ? '' : 'none';
                });
            });
            if (h3.parentNode) {
                h3.parentNode.insertBefore(btn, h3);
            }
        });
    }

    function startObserver() {
        if (!document.body) {
            setTimeout(startObserver, 100);
            return;
        }
        const observer = new MutationObserver((_mutations) => {
            doFilter();
        });
        observer.observe(document.body, {
            childList: true,
            subtree: true,
        });
        doFilter();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', startObserver);
    } else {
        startObserver();
    }
})();
