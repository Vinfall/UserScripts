// ==UserScript==
// @name        VNDB Length Votes Exporter
// @namespace   https://github.com/Vinfall/UserScripts
// @match       https://vndb.org/u*/lengthvotes
// @grant       none
// @version     2.0.0
// @author      Vinfall
// @license     WTFPL
// @description Export VNDB user length votes list to CSV
// @description:zh-cn 导出 VNDB 用户游戏时长列表至 CSV
// ==/UserScript==

// Input: table selector
// Output: table data in CSV format
function getTable(selector) {
    // Get table element in user length votes list
    var userListTable = document.querySelector(selector);

    // Get table header
    var headers = Array.from(userListTable.querySelectorAll('thead tr')).map(row => {
        return Array.from(row.querySelectorAll('td')).map(td => {
            // Delete unwanted operator strings
            return td.textContent.trim().replace(/▴▾/g, '');
        });
    });

    // Get length votes list
    var userData = Array.from(userListTable.querySelectorAll('tbody tr')).map(row => {
        return Array.from(row.querySelectorAll('td')).map((td, index) => {
            // Replace full-width space with normal one
            var cellData = td.textContent.trim().replace(/　/g, ' ');
            // Wrap content with double quotes
            return '"' + cellData.replace(/"/g, '""') + '"';
        });
    });

    // Convert to CSV
    var csvContent = '';
    headers.forEach(row => {
        csvContent += row.join(',') + '\n';
    });
    // Delete leading spaces in header
    csvContent = csvContent.replace(/ ,/g, ',');
    // DO NOT CHANGE THE LINE ABOVE

    userData.forEach(row => {
        csvContent += row.join(',') + '\n';
    });
    // Delete leading spaces in table body
    csvContent = csvContent.replace(/\s+$/gm, '');
    csvContent = csvContent.replace(/^\s*,/gm, '');
    // Delete empty lines like ""
    csvContent = csvContent.replace(/\n"",/gm, '\n');
    csvContent = csvContent.replace(/^""$/gm, '');
    csvContent = csvContent.replace(/\n\n/gm, '\n');

    return csvContent;
}

function addButton(csvContent, selector, fileNamePrefix) {
    // Add date to export filename
    // Sample ISO date: 20240204120335
    var today = new Date().toISOString().replace(/[-:]|T/g, '').replace(/\..+/, '');
    var fileName = fileNamePrefix + today + '.csv';

    // Create export button
    var exportButton = document.createElement('button');
    exportButton.textContent = 'Export as CSV';
    exportButton.id = 'exportButton';
    exportButton.style.marginLeft = '2px';
    exportButton.addEventListener('click', function () {
        var blob = new Blob([csvContent], {
            type: 'text/csv'
        });
        var url = URL.createObjectURL(blob);
        var a = document.createElement('a');
        a.href = url;
        a.download = fileName;
        a.click();
    });

    // Add button at the very right of browse tab
    var browseTab = document.querySelector(selector);
    browseTab.parentNode.insertBefore(exportButton, browseTab.nextSibling);
}

(function () {
    'use strict';

    var csvContent = getTable('.lengthlist.browse > table');
    addButton(csvContent, '.browsetabs', 'vndb-lengthvotes-export-');
})();