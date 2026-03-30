// ==UserScript==
// @name              CnGal Game Hide
// @namespace         https://github.com/Vinfall/UserScripts
// @version           1.0.16
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
        '众筹'
    ];

    function doFilter() {
        const allH3 = document.querySelectorAll('h3');
        allH3.forEach((h3) => {
            if (h3.dataset.filtered === 'true') return;
            const titleText = h3.textContent.trim();
            const shouldHide = blockedKeywords.some((word) => titleText.includes(word));
            if (shouldHide) {
                h3.dataset.filtered = 'true';
                const contentToHide = [];
                let follower = h3;
                while (follower) {
                    contentToHide.push(follower);
                    const next = follower.nextElementSibling;
                    if (!next || next.tagName === 'H3' || next.tagName === 'H2') break;
                    follower = next;
                }
                const btn = document.createElement('button');
                btn.innerHTML = `🚫 已过滤: <b>${titleText}</b>`;
                btn.style.cssText =
                    'display:block; width:100%; margin:10px 0; padding:8px; background:#201a1b; border:1px dashed #474747ff; color:#d1c6c6; cursor:pointer; text-align:left; border-radius:4px;';
                contentToHide.forEach((el) => {
                    el.style.display = 'none';
                });
                btn.onclick = () => {
                    const isHidden = contentToHide[0].style.display === 'none';
                    contentToHide.forEach((el) => {
                        if (isHidden) {
                            el.style.display = '';
                        } else {
                            el.style.display = 'none';
                        }
                    });
                };
                if (h3.parentNode) {
                    h3.parentNode.insertBefore(btn, h3);
                }
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
