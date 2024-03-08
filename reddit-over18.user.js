// ==UserScript==
// @name        r/over18
// @namespace   https://github.com/Vinfall/UserScripts
// @match       https://*.reddit.com/over18*
// @grant       none
// @version     1.0.0
// @author      Vinfall
// @description I must be 18+ to view red Snoo
// ==/UserScript==
(function () {
    'use strict';

    window.addEventListener('load', function () {
        var confirmAdultButton = document.querySelector('button.c-btn-primary.c-btn:nth-of-type(2)');
        if (confirmAdultButton) {
            confirmAdultButton.click();
        }
    });

    var hiddenElement = document.querySelector('#hidedown');
    if (hiddenElement) {
        hiddenElement.style.display = 'block';
    }
})();