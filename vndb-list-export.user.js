// ==UserScript==
// @name        VNDB List Export
// @namespace   https://github.com/Vinfall/UserScripts
// @version     5.1.0
// @author      Vinfall, alvibo
// @match       https://vndb.org/u*
// @match       https://vndb.org/u*/ulist*
// @match       https://vndb.org/u*/lengthvotes
// @icon        https://vndb.org/favicon.ico
// @grant       GM_xmlhttpRequest
// @license     WTFPL
// @description Export VNDB user VN & length vote list to CSV
// @description:zh-cn 导出 VNDB 用户游戏列表或时长列表至 CSV
// @connect     vndb.org
// ==/UserScript==

// Input: table selector
// Output: table data in CSV format
function getTable(selector, doc = document) {
    // Get table element in user list
    const userListTable = doc.querySelector(selector);

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
            const tdClone = td.cloneNode(true);
            // Remove invisible class
            const invisibleElement = tdClone.querySelector('.invisible');
            if (invisibleElement) {
                invisibleElement.remove();
            }
            // Delete unwanted string
            let cellData = tdClone.textContent.trim().replace(/ 👁|▾/g, '');
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

// Fetch page content using GM_xmlhttpRequest with retry functionality
async function fetchPageContentWithRetry(url, retries = 3, delay = 1000) {
    for (let i = 0; i < retries; i++) {
        try {
            const pageContent = await fetchPageContent(url);
            return pageContent;
        } catch (error) {
            console.error(`Attempt ${i + 1} failed for URL: ${url}. Retrying...`);
            if (i < retries - 1) {
                await new Promise((resolve) => setTimeout(resolve, delay)); // Wait before retrying
            } else {
                throw error; // Throw error if all retries fail
            }
        }
    }
}

// Fetch page content using GM_xmlhttpRequest
function fetchPageContent(url) {
    return new Promise((resolve, reject) => {
        GM_xmlhttpRequest({
            method: 'GET',
            url: url.startsWith('http') ? url : `https://vndb.org${url}`,
            headers: {
                'User-Agent': navigator.userAgent, // use real UA to bypass xbotcheck
                Accept: 'text/html',
            },
            anonymous: false, // send cookie to get localized titles
            onload: (response) => {
                resolve(response.responseText);
            },
            onerror: (error) => {
                reject(error);
            },
        });
    });
}

// Fetch data from all pages with ulist handling
async function fetchAllPagesData(tableSelector) {
    let allData = '';
    let currentPage = 1;
    let hasNextPage = true;
    const currentUrl = window.location.href;
    while (hasNextPage) {
        let pageUrl;

        // keep URL format
        if (currentUrl.includes('p=')) {
            pageUrl = currentUrl.replace(/p=\d+/, `p=${currentPage}`);
        } else {
            const separator = currentUrl.includes('?') ? '&' : '?';
            pageUrl = `${currentUrl}${separator}p=${currentPage}`;
        }
        console.log(`Fetching data from page ${currentPage}: ${pageUrl}`);

        try {
            const pageContent = await fetchPageContentWithRetry(pageUrl);
            const parser = new DOMParser();
            const doc = parser.parseFromString(pageContent, 'text/html');

            const csvContent = getTable(tableSelector, doc);

            if (currentPage === 1) {
                allData += csvContent; // include header for p1
                allData += '\n';
            } else {
                // skip the header
                const rows = csvContent.split('\n').slice(1).join('\n');
                // if (rows.trim())
                allData += `${rows}\n`;
            }
            // check next page
            const nextPageButton = doc.querySelector('.browsetabs a[rel="next"]');
            if (nextPageButton) {
                currentPage++;
            } else {
                hasNextPage = false;
            }
        } catch (error) {
            console.error(`Failed at page ${currentPage}:`, error);
            hasNextPage = false; // stop on error
        }
    }

    return allData;
}

function addExportButton(table, buttonSelector, fileNamePrefix) {
    // Add date prefix in filename, e.g. 20250325
    const today = new Date().toISOString().slice(0, 10).replace(/-/g, '');
    const fileName = `${fileNamePrefix + today}.csv`;

    // Create export button
    const exportButton = document.createElement('button');
    exportButton.textContent = 'Export as CSV';
    exportButton.id = 'exportButton';
    exportButton.style.marginLeft = '2px';
    exportButton.addEventListener('click', async (event) => {
        // Prevent default form submission behavior
        event.preventDefault();
        event.stopPropagation();

        const csvContent = await fetchAllPagesData(table);

        // Set UTF-8 BOM header
        const bom = new Uint8Array([0xef, 0xbb, 0xbf]);
        const blob = new Blob([bom, csvContent], {
            type: 'text/csv',
        });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = fileName;
        a.click();
    });

    // Add button after the selector
    const browseTab = document.querySelector(buttonSelector);
    if (browseTab) {
        browseTab.parentNode.insertBefore(exportButton, browseTab.nextSibling);
    } else {
        console.error('Button not found:', buttonSelector);
    }
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
