// ==UserScript==
// @name         The Verge Underline
// @namespace    https://github.com/Vinfall/UserScripts
// @version      1.0.2
// @author       Vinfall
// @match        https://www.theverge.com/*
// @grant        none
// @description  Respect accessibility by adding back underline in hyperlinks
// ==/UserScript==

(() => {
    const links = document.querySelectorAll('a[href]');
    for (const link of links) {
        link.style.textDecoration = 'underline';
    }
})();
