// ==UserScript==
// @name        A9VG Redirect Skip
// @namespace   https://github.com/Vinfall/UserScripts
// @match       https://bbs.a9vg.com/thread-*.html
// @match       https://bbs.a9vg.com/forum.php?mod=viewthread&tid=*
// @grant       none
// @version     1.4.0
// @author      Vinfall
// @description Skip that silly outlink warning
// @description:zh-cn 取消 A9VG 外链跳转确认
// ==/UserScript==

// Remove showDialog click event
document.querySelectorAll('a[onclick^="showDialog"]').forEach(element => {
    const link = element.textContent;
    element.removeAttribute('onclick');
    // Replace the href="javascript:;" with target hyperlink
    element.href = link;
    // Open in new tab
    element.target = '_blank';
    // Keep hyperlink style
    element.style.cssText = 'text-decoration: underline; color: #999; font-size: 12px;';
});