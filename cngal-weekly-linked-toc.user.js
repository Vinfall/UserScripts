// ==UserScript==
// @name              CnGal 每周速报 ToC 链接
// @namespace         https://github.com/Vinfall/UserScripts
// @version           0.2.0
// @author            Vinfall
// @match             https://www.cngal.org/articles/index/*
// @grant             none
// @run-at            document-idle
// @license           CC0 1.0 Universal (Public Domain)
// @icon              https://www.cngal.org/favicon.ico
// @description       「CnGal 每周速报」添加 ToC 链接，方便跳转
// ==/UserScript==

(() => {
    function addTocLinks() {
        const overviewHeader = document.querySelector('#section');
        if (!overviewHeader) return;
        const ul = overviewHeader.nextElementSibling;
        if (!ul || ul.tagName !== 'UL') return;
        const contentHeader = document.querySelector('#section-1');
        if (!contentHeader) return;
        // 收集所有正文 <h3>
        const h3s = [];
        let next = contentHeader.nextElementSibling;
        while (next) {
            if (next.tagName === 'H3') {
                h3s.push(next);
            } else if (next.tagName === 'H2') {
                break;
            }
            next = next.nextElementSibling;
        }
        if (h3s.length === 0) return;
        const items = ul.querySelectorAll('li');
        items.forEach((li, idx) => {
            const p = li.querySelector('p');
            if (!p) return;
            const rawText = p.textContent.trim();
            // 严格匹配正文标题
            let matchedH3 = null;
            for (const h3 of h3s) {
                if (h3.textContent.trim() === rawText) {
                    matchedH3 = h3;
                    break;
                }
            }
            if (!matchedH3) return;
            // 避免重复包裹链接
            if (p.querySelector('a[data-toc-link]')) return;
            const anchorId = `p-${idx + 1}`;
            // 创建包裹元素，保留原内容
            const link = document.createElement('a');
            link.setAttribute('data-toc-link', '');
            link.href = `#${anchorId}`;
            link.style.textDecoration = 'none';
            link.style.color = 'inherit';
            link.innerHTML = p.innerHTML;
            p.innerHTML = '';
            p.appendChild(link);
            // 点击事件：用 scrollIntoView 定位并更新 hash
            link.addEventListener('click', (e) => {
                e.preventDefault();
                // 平滑滚动到目标标题
                matchedH3.scrollIntoView({ behavior: 'smooth', block: 'start' });
                // 更新地址栏 hash（不会触发页面跳转）
                window.location.hash = anchorId;
            });
        });
    }
    // 初始化执行
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', addTocLinks);
    } else {
        addTocLinks();
    }
    // 监听后续动态加载
    const observer = new MutationObserver(() => {
        const overview = document.querySelector('#section');
        if (overview && !document.querySelector('#section + ul a[data-toc-link]')) {
            addTocLinks();
        }
    });
    observer.observe(document.body, { childList: true, subtree: true });
})();
