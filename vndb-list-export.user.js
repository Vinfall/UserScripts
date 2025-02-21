// ==UserScript==
// @name        VNDB List Export
// @namespace   https://github.com/Vinfall/UserScripts
// @version     4.5.1
// @author      Vinfall
// @match       https://vndb.org/u*
// @match       https://vndb.org/u*/ulist*
// @match       https://vndb.org/u*/lengthvotes
// @icon        https://vndb.org/favicon.ico
// @grant       none
// @license     WTFPL
// @description Export VNDB user VN & length vote list to CSV
// @description:zh-cn 导出 VNDB 用户游戏列表或时长列表至 CSV
// ==/UserScript==

// Input: table selector
// Output: table data in CSV format
function getTable(selector) {
    // Get table element in user list
    const userListTable = document.querySelector(selector);

    // Get table header
    const headers = Array.from(userListTable.querySelectorAll('thead tr')).map((row) => {
        return Array.from(row.querySelectorAll('td')).map((td) => {
            // this is weird, should be 'th' for real
            // Delete unwanted operator strings
            return td.textContent.trim().replace(/▴▾|Opt/g, '');
        });
    });

    // Get list
    const userData = Array.from(userListTable.querySelectorAll('tbody tr')).map((row) => {
        return Array.from(row.querySelectorAll('td')).map((td, index) => {
            // Delete unwanted string
            let cellData = td.textContent.trim().replace(/ 👁|▾/g, '');
            // Replace full-width space with normal one
            cellData = cellData.replace(/　/g, ' ');

            // Delete first row only if it's ulist table
            if (selector.includes('.ulist') && index === 0) {
                cellData = cellData.replace(/^\d+\/\d+/, '');
            }

            // Wrap content with double quotes
            return `"${cellData.replace(/"/g, '""')}"`;
        });
    });

    // Convert to CSV
    let csvContent = '';
    for (const row of headers) {
        csvContent += `${row.join(',')}\n`;
    }
    // Delete leading spaces in header
    csvContent = csvContent.replace(/ ,/g, ',');
    // DO NOT CHANGE THE LINE ABOVE

    for (const row of userData) {
        csvContent += `${row.join(',')}\n`;
    }
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
    const today = new Date()
        .toISOString()
        .replace(/[-:]|T/g, '')
        .replace(/\..+/, '');
    const fileName = `${fileNamePrefix + today}.csv`;

    // Create export button
    const exportButton = document.createElement('button');
    exportButton.textContent = 'Export as CSV';
    exportButton.id = 'exportButton';
    exportButton.style.marginLeft = '2px';
    exportButton.addEventListener('click', () => {
        const csvContent = getTable(table);
        const blob = new Blob([csvContent], {
            type: 'text/csv',
        });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = fileName;
        a.click();
    });

    // Add button after the selector
    const browseTab = document.querySelector(selector);
    browseTab.parentNode.insertBefore(exportButton, browseTab.nextSibling);
}

function addLengthVotes() {
    // CSS selector does not work so use almighty XPath
    const xpath = "//header//nav//menu//li[contains(., 'list')]";
    const listLi = document.evaluate(xpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;

    // Modify based on cloned list element
    const lengthVotesLi = listLi.cloneNode(true);
    const lengthVotesA = lengthVotesLi.querySelector('a');
    lengthVotesA.textContent = 'lengthvotes';
    // Remove focus
    lengthVotesLi.classList.remove('tabselected');
    lengthVotesA.href = lengthVotesA.href.replace(/ulist.*$/g, 'lengthvotes');
    listLi.parentNode.insertBefore(lengthVotesLi, listLi.nextSibling);
}

(() => {
    // Add lengthvotes button
    addLengthVotes();
    const url = window.location.href;
    // User list
    if (url.includes('ulist')) {
        const tableSelector = '.ulist.browse > table';
        // Fallback to labelfilters if vanilla VNDB export button is unavailable (i.e. not login)
        const buttonSelector = document.querySelector('#exportlist') ? '#exportlist' : '.submit';
        addExportButton(tableSelector, buttonSelector, 'vndb-list-export-');
    }
    // Length votes list
    else if (url.includes('lengthvotes')) {
        const tableSelector = '.lengthlist.browse > table';
        // Dirty fallback button if the user has so limited length votes...
        const buttonSelector = document.querySelector('.browsetabs') ? '.browsetabs' : 'article > h1';
        addExportButton(tableSelector, buttonSelector, 'vndb-lengthvotes-export-');
    }
    // Error handling, actually redundant as long as VNDB does not change those URLs
    else {
        console.log(`${url}is not a valid domain or currently unsupported.`);
    }
})();
