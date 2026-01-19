// ==UserScript==
// @name         The Verge Underline
// @namespace    https://github.com/Vinfall/UserScripts
// @version      1.0.3
// @author       Vinfall
// @match        https://on.theverge.com/*
// @match        https://www.theverge.com/*
// @grant        none
// @run-at       document-end
// @description  Respect accessibility by adding back underline in hyperlinks
// ==/UserScript==

(() => {
    const links = document.querySelectorAll('a[href]');
    for (const link of links) {
        link.style.textDecoration = 'underline';
    }
})();
