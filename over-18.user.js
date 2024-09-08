// ==UserScript==
// @name              Over-18
// @name:zh-cn        已满 18 岁
// @namespace         https://github.com/Vinfall/UserScripts
// @version           0.3.2
// @author            Vinfall
// @match             https://www.patreon.com/*
// @match             https://*.reddit.com/over18?dest=*
// @exclude-match     https://www.patreon.com/create
// @exclude-match     https://www.patreon.com/login
// @grant             none
// @run-at            document-start
// @license           CC0 1.0 Universal (Public Domain)
// @icon              data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>🔞</text></svg>
// @description       Certainly Not Minor, aka. CNM
// @description:zh-cn 因为我刚满 18 岁~
// ==/UserScript==

(function () {
    'use strict';

    // Define rules
    const config = {
        'www.patreon.com': 'button[data-tag="age-confirmation-button"]',
        'reddit.com': 'button.c-btn-primary.c-btn:nth-of-type(2)'
    };

    function getSelectorForCurrentSite() {
        const hostname = window.location.hostname;
        for (const key in config) {
            if (hostname.includes(key)) {
                return config[key];
            }
        }
        return null;
    }

    function autoConfirmAge() {
        const selector = getSelectorForCurrentSite();
        if (!selector) {
            console.warn("No matching rule found.");
            return;
        }

        // Search for age verify button
        const ageVerifyButton = document.querySelector(selector);
        if (ageVerifyButton) {
            ageVerifyButton.click();
        } else {
            // If not found, try again later
            setTimeout(autoConfirmAge, 1000);
        }
    }

    window.addEventListener('load', function () {
        setTimeout(autoConfirmAge, 1000);
    });
})();