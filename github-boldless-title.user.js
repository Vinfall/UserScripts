// ==UserScript==
// @name              GitHub Boldless Title
// @namespace         https://github.com/Vinfall/UserScripts
// @version           1.0.0
// @author            Vinfall
// @match             https://github.com/*
// @exclude-match     https://github.com/signin
// @grant             none
// @run-at            document-start
// @license           CC0 1.0 Universal (Public Domain)
// @icon
// @description       Remove strong style in GitHub repo title
// @description:zh-cn GitHub 仓库名取消加粗
// ==/UserScript==

// Mostly used to avoid unwanted bold marker in Obsidian...

(function () {
    'use strict';

    function replaceStrongWithAnchor() {
        const strongElements = document.querySelectorAll('strong.mr-2.flex-self-stretch');
        strongElements.forEach((strong) => {
            const anchor = strong.querySelector('a'); // Select the <a> tag inside <strong>
            if (anchor) {
                // Create a new <a> element
                const newAnchor = document.createElement('a');
                newAnchor.href = anchor.href; // Preserve the href
                newAnchor.textContent = anchor.textContent; // Preserve the text content

                // Replace the <strong> element with the new <a> element in the DOM
                strong.parentNode.replaceChild(newAnchor, strong);
            }
        });
    }

    // Run immediately on page load
    replaceStrongWithAnchor();

    // Optionally, observe changes in the page (e.g., for dynamic content)
    const observer = new MutationObserver(replaceStrongWithAnchor);
    observer.observe(document.body, { childList: true, subtree: true });
})();
