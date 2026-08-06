// ==UserScript==
// @name         GitHub Release Highlight
// @namespace    https://github.com/Vinfall/UserScripts
// @version      4.2.3
// @author       Vinfall
// @match        https://github.com/*/*/releases/tag/*
// @grant        none
// @license      GPL-3.0-only
// @run-at       document-end
// @icon         data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>💡</text></svg>
// @description  Highlight GitHub release assets containing keywords
// ==/UserScript==

// TODO: Support "https://github.com/*/*/releases"
// 		 Skip highlightKeywords if handleSpecialMatching matches
//       Support other git hosting services like gitlab, codeberg etc.

// General highlight keywords
// biome-ignore format: do not touch my list
const keywords = [
    // Windows
    'Windows-Portable-x86_64',
    'win_x64.zip', 'windows-x86_64.zip', 'Win64.zip',
    'msixbundle',
    '.exe',
    // Hash
    'SHA256SUM',
    'checksums',
];

const _attributeShape = [
    { name: 'repo', type: 'string' },
    { name: 'asset', type: 'string' },
];

const uniqueValues = [
    // Repo-specific highlight keywords
    ['Hibbiki/chromium-win64', 'nosync.7z'],
    ['obsidianmd/obsidian-releases', 'arm64.tar.gz'],
];

const services = [
    // Differentiate Git hosting services
    {
        domain: 'github.com',
        ul: '.Box--condensed > ul',
        asset: 'a.' + 'Truncate',
    },
];

// Pick selector by domain
const url = window.location.href;
for (const service of services) {
    if (url.includes(service.domain)) {
        ulSelector = service.ul;
        assetSelector = service.asset;
        break; // exit loop once matched
    }
}

// Function to change the color of text if it includes any keyword
function highlightKeywords(element) {
    for (const keyword of keywords) {
        if (element.textContent.includes(keyword)) {
            // console.log("Catching" + element.textContent)
            element.style.color = '#7ce49a';
        }
    }
}

// Function to handle special matching for specific repositories
function handleSpecialMatching(element) {
    // Iterating over the unique values with the new array format
    for (let i = 0; i < uniqueValues.length; i++) {
        const [repo, asset] = uniqueValues[i]; // Destructure the flat array
        if (location.href.includes(repo) && element.textContent.includes(asset)) {
            // console.log("Special matching for repo: " + unique.repo);
            element.style.color = '#7ce49a';
        }
    }
}

// Callback function for the MutationObserver
function handleMutation(mutationsList, observer) {
    for (const mutation of mutationsList) {
        if (mutation.type === 'childList') {
            const ul = document.querySelector('.Box--condensed > ul');
            if (ul) {
                const links = ul.querySelectorAll(`a.${targetClass}`);
                for (const element of links) {
                    handleSpecialMatching(element);
                    highlightKeywords(element);
                }
                observer.disconnect(); // Stop observing once the ul element is found
            }
        }
    }
}

// Create a new MutationObserver
const observer = new MutationObserver(handleMutation);

// Start observing the body for changes
observer.observe(document.body, {
    childList: true,
    subtree: true,
});
