// ==UserScript==
// @name         Git Release Highlight
// @namespace    https://github.com/Vinfall/UserScripts
// @version      5.1.2
// @author       Vinfall
// @match        https://github.com/*/*/releases*
// @match        https://github.com/*/*/releases/tag/*
// @match        https://codeberg.org/*/*/releases*
// @match        https://codeberg.org/*/*/releases/tag/*
// @grant        none
// @license      GPL-3.0-only
// @run-at       document-end
// @icon         data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>💡</text></svg>
// @description  Highlight release assets on Git hosting services, e.g. GitHub, Codeberg
// ==/UserScript==

// general keywords
// biome-ignore format: do not touch my list
const keywords = [
    // Windows
    'win_x64.zip', 'windows-x86_64.zip', 'Win64.zip', 'win-x64-', // common prefix/suffic
    'Windows-Portable-x86_64', 'Portable.x64.zip', // portable
    '-x86_64-pc-windows-msvc.zip', //rust
    'msixbundle', // appx
    'Windows.11.v',
    '.exe',
    // Linux
    // 'Linux_x86_64.tar.gz',
    // 'amd64.deb',
    // 'x86_64.AppImage',
    // Hash
    'SHA256SUM',
    'checksums',
];

// repo-specific keywords
const repos = {
    // Codeberg
    'forgejo/forgejo': ['linux-arm64.xz'],
    // GitHub
    'eden-emulator/Releases': [
        '-amd64-clang-pgo.AppImage', // -amd64-gcc-standard.AppImage
        '-optimized.apk',
        '-mingw-amd64-clang-pgo.zip',
    ],
    'neelabo/NeeView': ['-fd.zip'],
    'ryanoasis/nerd-fonts': ['CascadiaCode.tar.xz', 'CascadiaMono.tar.xz', 'DejaVuSansMono.tar.xz', 'FiraCode.tar.xz'],
};

const services = [
    {
        domain: 'github.com',
        // ul: '.Box--condensed > ul',
        asset: 'a.' + 'wb-break-all',
    },
    {
        domain: 'codeberg.org',
        asset: 'li.attachment > a',
    },
];

// pick selector by domain
const url = window.location.href;
for (const service of services) {
    if (url.includes(service.domain)) {
        assetSelector = service.asset;
        break; // exit loop once matched
    }
}

function highlight(element) {
    const text = element.textContent || '';
    // try repo specific first
    for (const [repo, assets] of Object.entries(repos)) {
        if (location.href.includes(repo) && assets.some((asset) => text.includes(asset))) {
            return true;
        }
    }
    // fallback to general
    if (keywords.some((keyword) => text.includes(keyword))) {
        return true;
    }
    return false;
}

function scan() {
    const links = document.querySelectorAll(assetSelector);
    for (const element of links) {
        if (highlight(element)) {
            element.style.color = '#7ce49a';
        }
    }
}

scan();

const observer = new MutationObserver(() => {
    scan();
});

observer.observe(document.body, {
    childList: true,
    subtree: true,
});
