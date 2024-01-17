// ==UserScript==
// @name        Tiangal Old Driver
// @namespace   https://github.com/Vinfall/UserScripts
// @match       https://www.tiangal.com/*
// @grant       none
// @version     1.1
// @author      Vinfall
// @description 天遊二次元默认开启老司机模式
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

    var elementsToHide = document.querySelectorAll('.steamcontent, #commentform');
    elementsToHide.forEach(function (element) {
        element.style.display = 'none';
    });
})();