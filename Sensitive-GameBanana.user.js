// ==UserScript==
// @name         Sensitive-GameBanana
// @description  Automatically click the "Proceed" button if it exists on the page
// @author       Vinfall
// @namespace    https://github.com/Vinfall/UserScripts
// @license      WTFPL
// @match        https://gamebanana.com/*
// @grant        none
// @run-at       document-end
// @version      1.0
// @description  Skip GameBanana NSFW warning redirect when not logged in
// ==/UserScript==

(function () {
    'use strict';

    // Exec after page load
    window.addEventListener('load', function () {
        // Find .ShowNsfwContentButton
        var showNsfwButton = document.querySelector('.ShowNsfwContentButton');
        // Auto click if found
        if (showNsfwButton) {
            showNsfwButton.click();
        }
    });
})();
