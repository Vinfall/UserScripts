// ==UserScript==
// @name         The Verge Underline
// @namespace    https://github.com/Vinfall/UserScripts
// @version      1.0.0
// @author       Vinfall
// @match        https://www.theverge.com/*
// @grant        none
// @description  Respect accessibility by adding back underline in hyperlinks
// ==/UserScript==
(function () {
    'use strict';
    const links = document.querySelectorAll('.clearfix a[href]');
    links.forEach(link => {
        link.style.textDecoration = 'underline';
    });
})();