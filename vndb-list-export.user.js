// ==UserScript==
// @name        VNDB User List Exporter
// @namespace   https://github.com/Vinfall/UserScripts
// @match       https://vndb.org/u*
// @grant       none
// @version     2.3.0
// @author      Vinfall
// @license     WTFPL
// @description Export VNDB user list to CSV
// @description:zh-cn 导出 VNDB 用户列表至 CSV
// ==/UserScript==

(function () {
    'use strict';

    // Get table element in user list
    var userListTable = document.querySelector('.ulist.browse > table');

    // Get table header
    var headers = Array.from(userListTable.querySelectorAll('thead tr')).map(row => {
        return Array.from(row.querySelectorAll('td')).map(td => {
            // Delete unwanted operator strings
            return td.textContent.trim().replace(/▴▾|Opt/g, '');
        });
    });

    // Get user list
    var userData = Array.from(userListTable.querySelectorAll('tbody tr')).map(row => {
        return Array.from(row.querySelectorAll('td')).map((td, index) => {
            // Delete unwanted string
            var cellData = td.textContent.trim().replace(/ 👁|▾/g, '');
            // Replace full-width space with normal one
            var cellData = td.textContent.trim().replace(/　/g, ' ');
            // Delete first row (Opt)
            if (index === 0) {
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

    // Add date to export filename
    var today = new Date().toISOString().replace(/[-:]|T/g, '').replace(/\..+/, '');
    var fileName = 'vndb-list-export-' + today + '.csv';

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

    // Add button right after vanilla export button
    var exportList = document.querySelector('#exportlist');
    exportList.parentNode.insertBefore(exportButton, exportList.nextSibling);
})();