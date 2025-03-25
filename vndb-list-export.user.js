// ==UserScript==
// @name        VNDB List Export
// @namespace   https://github.com/Vinfall/UserScripts
// @version     5.0.2
// @author      Vinfall, alvibo
// @match       https://vndb.org/u*
// @match       https://vndb.org/u*/ulist*
// @match       https://vndb.org/u*/lengthvotes
// @icon        https://vndb.org/favicon.ico
// @grant       GM_xmlhttpRequest
// @license     WTFPL
// @description Export VNDB user VN & length vote list to CSV
// @description:zh-cn 导出 VNDB 用户游戏列表或时长列表至 CSV
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
                'User-Agent': 'Mozilla/5.0',
                Accept: 'text/html',
            },
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
    const url = new URL(window.location.href);
    let baseUrl = url.pathname; // Use 'let' instead of 'const'
    let params = new URLSearchParams(url.search); // Use 'let' instead of 'const'

    // Remove "p" from params
    params.delete('p');

    // Check if the initial URL is fake (e.g., contains "vnlist=1")
    if (params.has('vnlist')) {
        // Find the button leading to the first page on the CURRENT PAGE
        const firstPageButton = document.querySelector('.browsetabs a:first-child');
        if (firstPageButton) {
            const firstPageUrl = firstPageButton.href;
            console.log(`Detected fake URL. Redirecting to first page: ${firstPageUrl}`);
            const pageContent = await fetchPageContentWithRetry(firstPageUrl);
            const parser = new DOMParser();
            const doc = parser.parseFromString(pageContent, 'text/html');

            // Get CSV content for the first page
            const csvContent = getTable(tableSelector, doc);
            allData += csvContent;

            // Update the base URL and params for subsequent pages
            const newUrl = new URL(firstPageUrl);
            baseUrl = newUrl.pathname; // Reassign 'baseUrl'
            params = new URLSearchParams(newUrl.search); // Reassign 'params'

            // Skip the first page in the pagination loop
            currentPage = 2; // Start from the second page
        } else {
            console.error('Could not find the first page button.');
            return '';
        }
    }

    while (hasNextPage) {
        // Set "p" to the current page number
        params.set('p', currentPage);
        // Reconstruct the URL
        const pageUrl = `https://vndb.org${baseUrl}${params.toString() ? `?${params.toString()}` : ''}`;
        console.log(`Fetching data from page ${currentPage}: ${pageUrl}`);

        try {
            const pageContent = await fetchPageContentWithRetry(pageUrl);
            const parser = new DOMParser();
            const doc = parser.parseFromString(pageContent, 'text/html');

            // Get CSV content for the current page
            const csvContent = getTable(tableSelector, doc);

            // Append only the rows (skip the header for subsequent pages)
            if (currentPage === 1) {
                allData += csvContent; // Include header for the first page
            } else {
                const rows = csvContent.split('\n').slice(1).join('\n'); // Skip the header
                allData += `${rows}\n`;
            }

            // Check if there is a next page
            const nextPageButton = doc.querySelector('.browsetabs a[rel="next"]');
            if (nextPageButton) {
                currentPage++;
            } else {
                hasNextPage = false;
            }
        } catch (error) {
            console.error(`Failed to fetch page ${currentPage}:`, error);
            hasNextPage = false; // Stop fetching if retries fail
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
