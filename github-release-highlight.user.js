// ==UserScript==
// @name         GitHub Release Highlight
// @namespace    https://github.com/Vinfall/UserScripts
// @version      2.1.2
// @author       Vinfall
// @match        https://github.com/*/*/releases/tag/*
// @grant        none
// @license      CC0 1.0 Universal (Public Domain)
// @description  Highlight GitHub release assets containing keywords
// ==/UserScript==

// TODO: Support "https://github.com/*/*/releases"
// 		 Skip highlightKeywords if handleSpecialMatching matches

// Function to change the color of text if it includes any keyword
function highlightKeywords(element) {
    keywords.forEach(keyword => {
        if (element.textContent.includes(keyword)) {
            // console.log("Catching" + element.textContent)
            element.style.color = '#7ce49a';
        }
    });
}

// Function to handle special matching for specific repositories
function handleSpecialMatching(element) {
    uniques.forEach(unique => {
        if (location.href.includes(unique.repo) && element.textContent.includes(unique.asset)) {
            // console.log("Special matching for repo: " + unique.repo);
            element.style.color = '#7ce49a';
        }
    });
}

// Callback function for the MutationObserver
function handleMutation(mutationsList, observer) {
    for (let mutation of mutationsList) {
        if (mutation.type === 'childList') {
            const ul = document.querySelector('.Box--condensed > ul');
            if (ul) {
                const links = ul.querySelectorAll('a.' + targetClass);
                links.forEach(element => {
                    handleSpecialMatching(element);
                    highlightKeywords(element);
                });
                observer.disconnect(); // Stop observing once the ul element is found
            }
        }
    }
}

const targetClass = 'Truncate';
// General highlight keywords
const keywords = ['Windows-Portable-x86_64', 'x64_Lite', 'x64_portable', 'Portable.x64.zip', 'win_x64.zip', '.exe'];
const uniques = [
    // Repo-specific highlight keywords
    {
        repo: 'obsidianmd/obsidian-releases',
        asset: 'arm64.tar.gz'
    },
    {
        repo: 'Hibbiki/chromium-win64',
        asset: 'nosync.7z'
    }
];

// Create a new MutationObserver
const observer = new MutationObserver(handleMutation);

// Start observing the body for changes
observer.observe(document.body, {
    childList: true,
    subtree: true
});