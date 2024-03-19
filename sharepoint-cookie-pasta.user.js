// ==UserScript==
// @name         Sharepoint Cookie Pasta
// @namespace    https://github.com/Vinfall/UserScripts
// @version      2.6.2
// @author       Vinfall
// @match        https://*.sharepoint.com/*
// @license      Mozilla Public License
// @grant        GM_xmlhttpRequest
// @grant        GM_setClipboard
// @description  Copy OneDrive Sharepoint cookie for aria2 usage.
// ==/UserScript==

(function () {
    'use strict';

    // Function to add the Copy Cookie button
    function addCopyCookieButton(cookieValue) {
        // Download button
        var targetElement = document.querySelector('.primarySet-102.ms-CommandBar-primaryCommand.ms-OverflowSet > .item-103.ms-OverflowSet-item');
        if (targetElement) {
            // Create the button element
            var button = document.createElement('button');
            button.textContent = '🍪 Copy Cookie';
            button.style.marginLeft = '5px';
            button.addEventListener('click', function () {
                // Copy the cookie value to the clipboard
                GM_setClipboard(cookieValue, 'text');
                button.textContent = 'Cookie copied!';
                setTimeout(function () {
                    button.textContent = '🍪 Copy Cookie';
                }, 2000);
            });
            targetElement.parentNode.insertBefore(button, targetElement.nextSibling);
        }
    }

    // Capture the Set-Cookie header on document load
    window.addEventListener('load', function () {
        GM_xmlhttpRequest({
            method: 'GET',
            url: window.location.href,
            onload: function (response) {
                // console.log(response.responseHeaders);
                // Convert 'Set-Cookie' to lowercase for better matching
                var headers = response.responseHeaders.replace(/Set-Cookie/g, 'set-cookie').split('\r\n');
                // Extract Set-Cookie header if present
                var setCookieHeader = headers.find(header => header.startsWith('set-cookie:'));
                if (setCookieHeader) {
                    // Extract the actual cookie part
                    var cookieValue = setCookieHeader.split('set-cookie: ')[1].split('Sprequestguid')[0].trim();
                    console.log(cookieValue);
                    // Add the Copy Cookie button to the page
                    addCopyCookieButton(cookieValue);
                }
            }
        });
    });
})();