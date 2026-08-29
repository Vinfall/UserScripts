// ==UserScript==
// @name              GitHub Boldless Title
// @namespace         https://github.com/Vinfall/UserScripts
// @version           2.0.0
// @author            Vinfall
// @match             https://github.com/*
// @match             https://gist.github.com/*
// @exclude-match     https://gist.github.com/auth/*
// @exclude-match     https://gist.github.com/join*
// @exclude-match     https://gist.github.com/login
// @exclude-match     https://github.com/*/*/actions/runs/*
// @exclude-match     https://github.com/*/*/actions/workflows/*
// @exclude-match     https://github.com/*/*/blob/*/*
// @exclude-match     https://github.com/*/*/commit/*
// @exclude-match     https://github.com/*/*/compare/*
// @exclude-match     https://github.com/*/*/graphs/*
// @exclude-match     https://github.com/*/*/issues*
// @exclude-match     https://github.com/*/*/pull/*/files
// @exclude-match     https://github.com/*/*/pulls*
// @exclude-match     https://github.com/*/*/tree/*/*
// @exclude-match     https://github.com/*?tab=overview*
// @exclude-match     https://github.com/*?tab=packages*
// @exclude-match     https://github.com/*?tab=projects*
// @exclude-match     https://github.com/*?tab=repositories*
// @exclude-match     https://github.com/*?tab=stars*
// @exclude-match     https://github.com/copilot
// @exclude-match     https://github.com/copilot/*
// @exclude-match     https://github.com/git/git/*
// @exclude-match     https://github.com/login
// @exclude-match     https://github.com/login/
// @exclude-match     https://github.com/login?*
// @exclude-match     https://github.com/sessions/*
// @exclude-match     https://github.com/signin
// @grant             none
// @run-at            document-end
// @license           CC0 1.0 Universal (Public Domain)
// @description       Remove strong style in GitHub repo/gist title
// @description:zh-cn GitHub 仓库名取消加粗
// ==/UserScript==

(() => {
    const selector = 'strong[itemprop="name"]';
    function removeStrong(root = document) {
        root.querySelectorAll(selector).forEach((strong) => {
            strong.replaceWith(...strong.childNodes);
        });
    }
    function start() {
        removeStrong();
        const observer = new MutationObserver(() => {
            removeStrong();
        });
        observer.observe(document.body, {
            childList: true,
            subtree: true,
        });
    }
    if (document.body) {
        start();
    } else {
        document.addEventListener('DOMContentLoaded', start, { once: true });
    }
})();
