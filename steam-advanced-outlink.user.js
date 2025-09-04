// ==UserScript==
// @name         Steam Advanced Outlink
// @namespace    https://github.com/Vinfall/UserScripts
// @version      3.3.0
// @author       Vinfall
// @match        https://store.steampowered.com/app/*
// @icon         https://store.steampowered.com/favicon.ico
// @grant        none
// @license      CC0 1.0 Universal (Public Domain)
// @description  Better outlinks on Steam store
// @description:zh-cn Steam 商店页面外链优化
// ==/UserScript==

(() => {
    const appId = /app\/(\d+)\//.exec(location.href)?.pop();
    if (appId) {
        console.log(appId);

        const warningColor = 'red';
        const conditions = [
            // Outlink replacement
            {
                srcIncludes: 'ico_achievements',
                text: 'Steam Hunters',
                href: `https://steamhunters.com/apps/${appId}/achievements`,
            },
            {
                srcIncludes: 'ico_cloud',
                text: 'Cloudsave',
                href: `https://store.steampowered.com/account/remotestorageapp?appid=${appId}&index=0`,
            },
            {
                srcIncludes: 'ico_cards',
                text: 'Steam Card Exchange',
                href: `https://www.steamcardexchange.net/index.php?gamepage-appid-${appId}/`,
            },
            {
                srcIncludes: 'ico_workshop',
                text: 'Workshop',
                href: `https://steamcommunity.com/workshop/browse/?appid=${appId}&browsesort=toprated&section=readytouseitems`,
            },
            // Warning on unexpected feature
            {
                // 'ico_cart' == IAP, 'ico_info` == profile features limited
                srcIncludes: [
                    'ico_coop',
                    'ico_multiPlayer',
                    'ico_cart',
                    'ico_vac',
                    'ico_info',
                    'ico_learning_about_game',
                ],
                color: warningColor,
            },
        ];

        // TODO: expand to div.page_content > .game_meta_data.rightcol for better matching
        const elements = document.querySelectorAll('a.game_area_details_specs_ctn');
        for (const element of elements) {
            for (const condition of conditions) {
                if (Array.isArray(condition.srcIncludes)) {
                    if (
                        condition.srcIncludes.some((src) =>
                            element.querySelector('.icon img.category_icon').src.includes(src),
                        )
                    ) {
                        // Set color on unwanted feature
                        if (condition.color) {
                            element.querySelector('.label').style.color = condition.color;
                            element.querySelector('.label').style.fontWeight = 'bold';
                        }
                    }
                } else {
                    // Replace outlink otherwise
                    if (element.querySelector('.icon img.category_icon').src.includes(condition.srcIncludes)) {
                        element.href = condition.href;
                        element.querySelector('.label').innerText = condition.text;
                    }
                }
            }
        }

        // Redirect useless community outlink to guide
        const communityLink = document.querySelector(`a[href="https://steamcommunity.com/app/${appId}"]`);
        if (communityLink) {
            communityLink.href = `https://steamcommunity.com/app/${appId}/guides`;
        }
    } else {
        console.error('Unsupported URL');
    }
})();
