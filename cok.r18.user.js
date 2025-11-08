// ==UserScript==
// @name              COK.R18
// @name:zh-cn        刚满 18 岁 Cookie 版
// @namespace         https://github.com/Vinfall/UserScripts
// @version           0.9.0
// @author            Vinfall
// @match             https://*.itch.io/*
// @match             https://store.steampowered.com/agecheck/app/*
// @match             https://www.gog.com/*/game/*
// @match             https://www.moyu.moe/*
// @match             https://www.nintendo.com/*/store/products/*
// @match             https://www.nintendo.com/us/store/products/*
// @match             https://www.ptt.cc/ask/over18?from=*
// @match             https://www.ptt.cc/bbs/*/*.html
// @exclude-match     https://www.gog.com/forum/*
// @exclude-match     https://www.moyu.moe/*/*/pr
// @exclude-match     https://www.moyu.moe/about
// @exclude-match     https://www.moyu.moe/about/*
// @exclude-match     https://www.moyu.moe/auth/*
// @exclude-match     https://www.moyu.moe/edit/create
// @exclude-match     https://www.moyu.moe/friend-link
// @exclude-match     https://www.moyu.moe/login
// @exclude-match     https://www.moyu.moe/register
// @grant             unsafeWindow
// @grant             GM_getValue
// @grant             GM_setValue
// @run-at            document-start
// @license           CC0 1.0 Universal (Public Domain)
// @icon              data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>🔞</text></svg>
// @description       Certainly Older than Kid, aka. COK.R18
// @description:zh-cn 因为我刚满 18 岁~
// ==/UserScript==

// Docs: https://developer.mozilla.org/en-US/docs/Web/API/Document/cookie

/*
TODO
- add a lot more sites, comment out the ones existed in CNM.R18
- set cookie_override via GM_setValue
- set cookie in the correct way (is it even possible?)
- fix itch
- better support for Steam/PTT (auto redirect after setting cookie)
*/

// patch for 'unsafeWindow is not defined'
const _global = typeof unsafeWindow === 'undefined' ? window : unsafeWindow;

const cookie_override = true;
// const noFlagSites = ['itch.io'];

const config = [
    {
        domains: ['gog.com'],
        name: 'gog_wantsmaturecontent',
        value: '18',
    },
    {
        domains: ['itch.io'],
        name: 'allow_nsfw_games',
        value: '%5b3660070%5d', // 1970-01-01
    },
    // {
    //     domains: ['moyu.moe'],
    //     name: 'kun-patch-setting-store|state|data|kunNsfwEnable',
    //     value: 'all',
    // }, // infinite loop
    {
        domains: ['nintendo.com'],
        name: 'nintendo.ageGate.isOldEnough',
        value: '"true"', // this is correct, the value is literal "true"
    },
    {
        domains: ['ptt.cc'],
        name: 'over18',
        value: '1',
    },
    {
        domains: ['store.steampowered.com'],
        name: 'birthtime', // not lastagecheckage or wants_mature_content
        value: '-3599',
    },
];

/**
 * Find config via hostname
 * @returns {object|undefined}
 */
function getMatchingConfig() {
    const hostname = window.location.hostname;
    return config.find((item) => item.domains.some((domain) => hostname.includes(domain)));
}

/**
 * Get Cookie
 * @param {string} name
 * @returns {string|null}
 */
function getCookie(name) {
    const match = document.cookie.match(new RegExp(`(^|;\\s*)${name}=([^;]+)`));
    return match ? match[2] : null;
}

/**
 * Set Cookie
 * @param {string} name
 * @param {string} value
 * @param {number} days
 */
function setCookie(name, value, days = 365) {
    const date = new Date();
    date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
    const expires = `expires=${date.toUTCString()}`;
    // biome-ignore lint/suspicious/noDocumentCookie: CookieStore only works for HTTPS
    document.cookie = `${name}=${value}; ${expires}; path=/; SameSite=Lax`;
}

function main() {
    const matchingConfig = getMatchingConfig();

    if (!matchingConfig) {
        console.log('Domain not found. Skipping.');
        return;
    }

    const { name, value } = matchingConfig;
    const currentCookieValue = getCookie(name);
    // cookie w/ correct value
    if (currentCookieValue === value) {
        console.log(`Cookie "${name}" value matched, skipping.`);
        return;
    }
    // no cookie or wrong value
    if (currentCookieValue !== null) {
        // wrong value
        if (cookie_override) {
            console.log(`Cookie "${name}" value mismatch, and cookie_override is true, overwriting...`);
            setCookie(name, value);
            // refresh page after setting cookie
            location.reload();
        } else {
            console.log(`Cookie "${name}" value mismatch, but cookie_override is false, skipping...`);
            return;
        }
    } else {
        // no cookie
        console.log(`Cookie "${name}" not found, setting...`);
        setCookie(name, value);
        // refresh page after setting cookie
        location.reload();
    }
}

main();
