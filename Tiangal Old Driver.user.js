// ==UserScript==
// @name        Tiangal Old Driver
// @namespace   https://github.com/Vinfall/UserScripts
// @match       https://www.tiangal.com/*
// @exclude     https://www.tiangal.com/sign.html*
// @grant       none
// @version     1.3.0
// @author      Vinfall
// @description Enable adult mode for Tiangal
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

    const elements = ['.steamcontent, #commentform, .slick, .git_reader.widget, .nsl-container-login-layout-below.nsl-container-block.nsl-container'];

    var elementsToHide = document.querySelectorAll(elements);
    elementsToHide.forEach(function (element) {
        element.style.display = 'none';
    });
})();