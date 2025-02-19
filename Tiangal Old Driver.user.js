// ==UserScript==
// @name        Tiangal Old Driver
// @match       https://www.tiangal.com/*
// @exclude     https://www.tiangal.com/sign.html*
// @grant       none
// @version     1.4.8
// @description Show NSFW works on Tiangal
// @description:zh-cn 天遊二次元默认开启老司机模式
// ==/UserScript==
(function () {
    'use strict';

    window.addEventListener('load', function () {
        var confirmAdultButton = document.querySelector('.swal2-styled.swal2-confirm');
        if (confirmAdultButton) {
            confirmAdultButton.click();
        }
    });

    var hiddenElement = document.querySelector('#hidedown');
    if (hiddenElement) {
        hiddenElement.style.display = 'block';
    }

    const elementsToHide = [
        // Landing page
        '.slick',
        '.git_reader.widget',
        // Game details
        '.steamcontent',
        '#commentform',
        // Login page
        '.nsl-container-buttons',
        '.nsl-container-login-layout-below.nsl-container-block.nsl-container',
    ];

    elementsToHide.forEach((element) => {
        const elementToHide = document.querySelector(element);
        if (elementToHide) {
            elementToHide.style.display = 'none';
        }
    });
})();
