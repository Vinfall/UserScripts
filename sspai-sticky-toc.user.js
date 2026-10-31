// ==UserScript==
// @name              SSPai Sticky ToC
// @name:zh-cn        少数派固定目录
// @namespace         https://github.com/Vinfall/UserScripts
// @version           0.3.0
// @author            Vinfall
// @match             https://sspai.com/post/*
// @grant             none
// @run-at            document-idle
// @license           CC0 1.0 Universal (Public Domain)
// @icon              data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22 fill=%22%23DA282A%22>π</text></svg>
// @description       Set sticky ToC on sspai
// @description:zh-cn 自动固定少数派文章的 ToC
// ==/UserScript==

(() => {
    const pinDirectory = () => {
        const wrapper = document.querySelector('.comp__Directory__wrapper');
        const pinButton = document.querySelector('.article__directory__pin');

        if (!wrapper || !pinButton) return;
        if (wrapper.classList.contains('pinned')) return;

        // ssCommunityIcon__pin--line -> ssCommunityIcon__pin
        const icon = pinButton.querySelector('i');
        if (icon?.classList.contains('ssCommunityIcon__pin--line')) {
            pinButton.click();
        }
    };

    pinDirectory();

    const observer = new MutationObserver(pinDirectory);
    observer.observe(document.documentElement, {
        childList: true,
        subtree: true,
        attributes: true,
        attributeFilter: ['class'],
    });
})();
