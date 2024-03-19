// ==UserScript==
// @name         Sharepoint Cookie Pasta
// @namespace    https://github.com/Vinfall/UserScripts
// @version      1.0.0
// @author       Vinfall
// @match        https://*.sharepoint.com/*
// @grant        GM_xmlhttpRequest
// @description  Copy OneDrive Sharepoint cookie for aria2 usage.
// ==/UserScript==

// Capture "Set-Cookie" value in document type response header and print it to console log.

(function () {
    'use strict';
    console.log('Working');

    // Only run this script once after the page loads
    window.addEventListener('load', function () {
        GM_xmlhttpRequest({
            method: 'GET',
            url: window.location.href, // Current page URL
            onload: function (response) {
                // Extract Set-Cookie header if present
                var headers = response.responseHeaders.split('\r\n');
                var setCookieHeader = headers.find(header => header.startsWith('Set-Cookie:'));
                if (setCookieHeader) {
                    console.log(setCookieHeader);
                }
            }
        });
    });
})();