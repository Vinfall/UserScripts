// ==UserScript==
// @name        VNDB List Export
// @namespace   https://github.com/Vinfall/UserScripts
// @match       https://vndb.org/u*/ulist*
// @match       https://vndb.org/u*/lengthvotes
// @grant       none
// @version     4.3.0
// @author      Vinfall
// @license     WTFPL
// @description Export VNDB user VN & length vote list to CSV
// @description:zh-cn 导出 VNDB 用户游戏列表或时长列表至 CSV
// ==/UserScript==

// Input: table selector
// Output: table data in CSV format
function getTable(selector) {
    // Get table element in user list
    var userListTable = document.querySelector(selector);

    // Get table header
    var headers = Array.from(userListTable.querySelectorAll('thead tr')).map(row => {
        return Array.from(row.querySelectorAll('td')).map(td => { // this is weird, should be 'th' for real
            // Delete unwanted operator strings
            return td.textContent.trim().replace(/▴▾|Opt/g, '');
        });
    });

    // Get list
    var userData = Array.from(userListTable.querySelectorAll('tbody tr')).map(row => {
        return Array.from(row.querySelectorAll('td')).map((td, index) => {
            // Delete unwanted string
            var cellData = td.textContent.trim().replace(/ 👁|▾/g, '');
            // Replace full-width space with normal one
            cellData = cellData.replace(/　/g, ' ');

            // Delete first row only if it's ulist table
            if (selector.includes('.ulist') && index === 0) {
                cellData = cellData.replace(/^\d+\/\d+/, '');
            }

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

function addExportButton(table, selector, fileNamePrefix) {
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
        var csvContent = getTable(table);
        var blob = new Blob([csvContent], {
            type: 'text/csv'
        });
        var url = URL.createObjectURL(blob);
        var a = document.createElement('a');
        a.href = url;
        a.download = fileName;
        a.click();
    });

    // Add button after the selector
    var browseTab = document.querySelector(selector);
    browseTab.parentNode.insertBefore(exportButton, browseTab.nextSibling);
}

(function () {
    'use strict';
    var url = window.location.href;
    // User list
    if (url.includes('ulist')) {
        var tableSelector = '.ulist.browse > table';
        // Fallback to labelfilters if vanilla VNDB export button is unavailable (i.e. not login)
        var buttonSelector = document.querySelector('#exportlist') ? '#exportlist' : '.submit';
        addExportButton(tableSelector, buttonSelector, 'vndb-list-export-');
    }
    // Length votes list
    else if (url.includes('lengthvotes')) {
        var tableSelector = '.lengthlist.browse > table';
        // Dirty fallback button if the user has so limited length votes...
        var buttonSelector = document.querySelector('.browsetabs') ? '.browsetabs' : 'article > h1';
        addExportButton(tableSelector, buttonSelector, 'vndb-lengthvotes-export-');
    }
    // Error handling, actually redundant as long as VNDB does not change those URLs
    else {
        console.log(url + 'is not a valid domain or currently unsupported.');
    }
})();