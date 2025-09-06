// ==UserScript==
// @name              CNM.R18
// @name:zh-cn        刚满 18 岁
// @namespace         https://github.com/Vinfall/UserScripts
// @version           2.24.2
// @author            Vinfall
// @match             https://*.fanbox.cc/
// @match             https://*.fanbox.cc/plans
// @match             https://*.fanbox.cc/plans/*
// @match             https://*.fanbox.cc/posts/*
// @match             https://*.itch.io/*
// @match             https://*.reddit.com/over18?dest=*
// @match             https://a.sofmap.com/adult_confirm.aspx?url=*
// @match             https://a.sofmap.com/product_detail.aspx?sku=*
// @match             https://appendingpulse.jp/dl/*
// @match             https://bookmate-net.com/ec/*
// @match             https://booth.pm/*/items/*
// @match             https://ec.toranoana.jp/tora_r/ec/item/*
// @match             https://gamebanana.com/mods/*
// @match             https://gamejolt.com/games/*/*
// @match             https://gamejolt.com/games/*/*/followers
// @match             https://huggingface.co/*/*
// @match             https://huggingface.co/*/*/discussions
// @match             https://huggingface.co/*/*/tree/*
// @match             https://jastusa.com/games/*/*
// @match             https://jastusa.com/zh_Hans/games/*/*
// @match             https://jastusa.com/zh_Hant/games/*/*
// @match             https://moepedia.net/
// @match             https://moe-gameaward.com/
// @match             https://moepedia.net/*
// @match             https://moepedia.net/game/*
// @match             https://patch.moe/
// @match             https://pcshop-mk.shop-pro.jp/?pid=*
// @match             https://refuge.tokyo/*.html
// @match             https://steamcommunity.com/app/*
// @match             https://store.hikarifield.co.jp/downloads/*
// @match             https://store.nintendo.com.hk/*
// @match             https://www.amiami.jp/top/detail/detail?gcode=*
// @match             https://www.amiami.jp/top/detail/detail?scode=*
// @match             https://www.animate-onlineshop.jp/pd/*
// @match             https://www.animate-onlineshop.jp/pn/*
// @match             https://www.animategames.jp/home/age?redirect=*
// @match             https://www.digiket.com/work/show/_data/ID=*
// @match             https://www.dlsite.com/*-touch/
// @match             https://www.dlsite.com/*-touch/*
// @match             https://www.dlsite.com/*/work/=/product_id/*
// @match             https://www.dmm.co.jp/*/age_check/=/?rurl=*
// @match             https://www.getchu.com/php/attestation.html?aurl=*
// @match             https://www.hobicolle.com/
// @match             https://www.jkforum.net/p/forum.php?*
// @match             https://www.johren.games/?backUrl=*
// @match             https://www.loverslab.com/topic/*
// @match             https://www.melonbooks.co.jp/detail/detail.php?product_id=*
// @match             https://www.nijiyome.jp/
// @match             https://www.nijiyome.jp/*
// @match             https://www.nintendo.com/jp/*/creators-voice/*
// @match             https://www.patreon.com/*
// @match             https://www.ptt.cc/ask/over18?from=*
// @match             https://www.will-order.com/age.php?rurl=*
// @exclude-match     https://*/*username=*
// @exclude-match     https://*/admin.php?*
// @exclude-match     https://*/forum.php?*goto*
// @exclude-match     https://*/forum.php?mod=redirect*
// @exclude-match     https://download.patch.moe/*
// @exclude-match     https://huggingface.co/blog/*
// @exclude-match     https://huggingface.co/collections/*
// @exclude-match     https://huggingface.co/datasets/*
// @exclude-match     https://huggingface.co/docs/*
// @exclude-match     https://huggingface.co/learn/*
// @exclude-match     https://huggingface.co/papers/*
// @exclude-match     https://huggingface.co/posts/*
// @exclude-match     https://huggingface.co/spaces/*
// @exclude-match     https://huggingface.co/tasks/*
// @exclude-match     https://store.nintendo.com.hk/checkout/*
// @exclude-match     https://www.animate-onlineshop.jp/mypage/*
// @exclude-match     https://www.fanbox.cc/auth/*
// @exclude-match     https://www.melonbooks.co.jp/detail/detail.php?*adult_view=1
// @exclude-match     https://www.patreon.com/create
// @exclude-match     https://www.patreon.com/login
// @grant             none
// @run-at            document-start
// @license           CC0 1.0 Universal (Public Domain)
// @icon              data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>🔞</text></svg>
// @description       Certainly Not Minor, aka. CNM.R18
// @description:zh-cn 因为我刚满 18 岁~
// ==/UserScript==

// Buttons
function verifyButton() {
    // Define rules
    // biome-ignore format: do not touch my list
    const config = {
        'a.sofmap.com': '.blue.button',
        // 'amiami.jp': 'input:nth-of-type(5)', // '.btn_go > form', not working
        'animate-onlineshop.jp': 'dynamicSelector', // special case
        'animategames.jp': '.btn-blr18.btn',
        'appendingpulse.jp': '#in', // old releases
        // new releases
        // '.btn-danger.btn', '#fbi-warning > .modal-dialog > .modal-content > .modal-footer > .btn-primary.btn',
        'bookmate-net.com': '.btn-block.btn-lg.btn-success.btn',
        'booth.pm': '.js-approve-adult > .mx-16.\\!text-semantic-blue',
        'digiket.com': '.btn-lg.btn-info.btn',
        'dlsite.com': 'dynamicSelector', // special case
        'dmm.co.jp': '.css-w5doa7.fill.large.turtle-Button.turtle-component > [href]',
        'fanbox.cc': '.dhrsDw.iorEfw.CommonButton__CommonButtonOuter-sc-1s35wwu-0.ButtonBase-sc-1pize7g-0',
        'gamebanana.com': '.ShowNsfwContentButton',
        'gamejolt.com': '.link-muted > span', // this mutes until I exit
        // 'gamejolt.com': '.-block.-outline.-primary.button', // this only works for once
        'getchu.com': '[href^="https://www.getchu.com/soft.phtml"]',
        // 'gog.com': '.age-gate__button.button--big.button', // not working
        'hobicolle.com': '.close_modal',
        'huggingface.co': '[href^="?not-for-all-audiences=true"]', // '.self-start.!mt-6.btn'
        // 'itch.io': '.buttons > .button', // not working
        'jastusa.com': '.content-gate__footer > button.is-primary.button',
        'jkforum.net': '#fwin_dialog_submit',
        'johren.games': '.link_enter.mainbtn-primary-lv1',
        'loverslab.com': '.fields > button',
        'moe-gameaward.com': '.btn_pink',
        'moepedia.net': '.age-button_yes',
        'nijiyome.jp': '.btn-approval.type_01',
        'nintendo.com.hk': 'button#eco-product-confirmation-hide.action-primary',
        'patch.moe': 'a.css-button-rounded--red:nth-of-type(1)',
        'patreon.com': 'button[data-tag="age-verification-button-yes"]', // FIXME: not working on mobile
        'pcshop-mk.shop-pro.jp': '#validation_select_yes > [href]',
        // 'ptt.cc': 'button.btm-big[name="yes"][value="yes"]', // not working
        'reddit.com': 'button.c-btn-primary.c-btn:nth-of-type(2)',
        'refuge.tokyo': '#but_accept',
        'steamcommunity.com': 'button.btn_medium.btn_blue_steamui > span',
        'store.hikarifield.co.jp': '.mt-3.btn-info.btn',
        'toranoana.jp': '#js-en-confirm-adult > .c-modal_content_body > .text-center.c-modal_content_inner > .mt-4.ui-confirm-adult-btn-wrapper > .ui-confirm-adult-btn-primary.c-btn-black.c-btn.js-ui-modal-close.js-btn-primary',
        'will-order.com': '[src="/images/age/yes_male.gif"]',
        'www.nintendo.com': '.js-confirm-screen-close-btn.ncom-c-btn' // Nintendo JP only, US does not have this
    };

    // These sites require verification every time
    const noFlagSites = [
        'appendingpulse.jp',
        'touch', // DLsite mobile
        'huggingface.co',
    ];

    function getSelectorForCurrentSite() {
        const hostname = window.location.hostname;
        const href = window.location.href;
        for (const key in config) {
            if (hostname.includes(key)) {
                // Special handling for DLsite
                if (key === 'dlsite.com') {
                    // Mobile
                    if (href.includes('touch')) {
                        return 'div.c-modal__button:nth-of-type(1)';
                    }
                    // PC
                    else {
                        const pathname = window.location.pathname;
                        return `[href="${pathname}"]`;
                    }
                }
                if (key === 'animate-onlineshop.jp') {
                    const pathname = window.location.pathname;
                    return `[href^="${pathname}"]`;
                }
                return config[key];
            }
        }
        return null;
    }

    function autoConfirmAge() {
        const hostname = window.location.hostname;
        const href = window.location.href;
        const sessionKey = `ageConfirmed-${hostname}`;

        // Check if we've run on this site in this session
        if (sessionStorage.getItem(sessionKey)) {
            return;
        }

        const selector = getSelectorForCurrentSite();
        if (!selector) {
            console.warn('No matching rule found.');
            return;
        }

        // Search for age verify button
        const ageVerifyButton = document.querySelector(selector);
        if (ageVerifyButton) {
            ageVerifyButton.click();
            // Skip flag on noFlagSites
            if (noFlagSites.some((uri) => href.includes(uri))) {
                return;
            }
            // Store a click flag in sessionStorage
            sessionStorage.setItem(sessionKey, 'true');
            return;
        } else {
            // If not found, try again later
            setTimeout(autoConfirmAge, 800);
        }
    }

    window.addEventListener('load', () => {
        setTimeout(autoConfirmAge, 800);
    });
}

// NSFW params
function verifyParam() {
    // Define rules
    const siteParams = {
        'a.softmap.com': 'aac=on',
        'melonbooks.co.jp': 'adult_view=1',
        // Getchu not working even w/ url redirect, use verifyButton instead
        // 'getchu.com': 'gc=gc',
    };

    const currentHost = window.location.host;
    const currentUrl = window.location.href;

    // Check existing params
    for (const [site, paramToAdd] of Object.entries(siteParams)) {
        if (currentHost.endsWith(site)) {
            const sessionKey = `paramAdded-${currentHost}`;

            if (sessionStorage.getItem(sessionKey)) {
                continue;
            }

            // Check if the param already exists
            if (!currentUrl.includes(paramToAdd)) {
                let newUrl;
                if (currentUrl.includes('?')) {
                    // host.tld?param=1
                    newUrl = `${currentUrl}&${paramToAdd}`;
                } else {
                    // host.tld (aka. no param)
                    newUrl = `${currentUrl}?${paramToAdd}`;
                }

                window.location.href = newUrl;
                sessionStorage.setItem(sessionKey, 'true');
                return;
            }
        }
    }
}

(() => {
    verifyParam();
    verifyButton();
})();
