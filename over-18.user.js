// ==UserScript==
// @name              Over-18
// @name:zh-cn        已满 18 岁
// @namespace         https://github.com/Vinfall/UserScripts
// @version           0.12.1
// @author            Vinfall
// @match             https://*.itch.io/*
// @match             https://*.reddit.com/over18?dest=*
// @match             https://booth.pm/*/items/*
// @match             https://ec.toranoana.jp/tora_r/ec/item/*
// @match             https://gamebanana.com/mods/*
// @match             https://gamejolt.com/games/*/*
// @match             https://gamejolt.com/games/*/*/followers
// @match             https://jastusa.com/games/*/*
// @match             https://jastusa.com/zh_Hans/games/*/*
// @match             https://jastusa.com/zh_Hant/games/*/*
// @match             https://store.nintendo.com.hk/*
// @match             https://www.animategames.jp/home/age?redirect=*
// @match             https://www.digiket.com/work/show/_data/ID=*
// @match             https://www.getchu.com/php/attestation.html?aurl=*
// @match             https://www.patreon.com/*
// @exclude-match     https://store.nintendo.com.hk/checkout/*
// @exclude-match     https://www.patreon.com/create
// @exclude-match     https://www.patreon.com/login
// @grant             none
// @run-at            document-start
// @license           CC0 1.0 Universal (Public Domain)
// @icon              data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>🔞</text></svg>
// @description       Certainly Not Minor, aka. CNM.R18
// @description:zh-cn 因为我刚满 18 岁~
// ==/UserScript==

(function () {
    'use strict';

    // Define rules
    const config = {
        'animategames.jp': '.btn-blr18.btn',
        'booth.pm': '.js-approve-adult > .adult-check-nav',
        'digiket.com': '.btn-lg.btn-info.btn',
        'gamebanana.com': '.ShowNsfwContentButton',
        'gamejolt.com': '.link-muted > span', // this mutes until I exit
        // 'gamejolt.com': '.-block.-outline.-primary.button', // this only works for once
        // 'gog.com': '.age-gate__button.button--big.button',
        'itch.io': '.buttons > .button',
        'jastusa.com': '.content-gate__footer > button.is-primary.button',
        'nintendo.com.hk': 'button#eco-product-confirmation-hide.action-primary',
        'patreon.com': 'button[data-tag="age-confirmation-button"]',
        'reddit.com': 'button.c-btn-primary.c-btn:nth-of-type(2)',
        'toranoana.jp': '#js-en-confirm-adult > .c-modal_content_body > .text-center.c-modal_content_inner > .mt-4.ui-confirm-adult-btn-wrapper > .ui-confirm-adult-btn-primary.c-btn-black.c-btn.js-ui-modal-close.js-btn-primary',
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
        const hostname = window.location.hostname;
        const sessionKey = `ageConfirmed-${hostname}`;

        // Check if we've run on this site in this session
        if (sessionStorage.getItem(sessionKey)) {
            return;
        }

        const selector = getSelectorForCurrentSite();
        if (!selector) {
            console.warn("No matching rule found.");
            return;
        }

        // Search for age verify button
        const ageVerifyButton = document.querySelector(selector);
        if (ageVerifyButton) {
            ageVerifyButton.click();
            // Store a click flag in sessionStorage
            sessionStorage.setItem(sessionKey, 'true');
        } else {
            // If not found, try again later
            setTimeout(autoConfirmAge, 800);
        }
    }

    window.addEventListener('load', function () {
        setTimeout(autoConfirmAge, 800);
    });
})();