// ==UserScript==
// @name        VNDB User List Exporter
// @namespace   https://github.com/Vinfall/UserScripts
// @match       https://vndb.org/u*
// @grant       none
// @version     2.2.0
// @author      Vinfall
// @license     WTFPL
// @description Export VNDB user list to CSV
// @description:zh-cn 导出 VNDB 用户列表至 CSV
// ==/UserScript==

(function () {
    'use strict';

    // 获取用户列表的table元素
    var userListTable = document.querySelector('.ulist.browse > table');

    // 获取表头字段
    var headers = Array.from(userListTable.querySelectorAll('thead tr')).map(row => {
        return Array.from(row.querySelectorAll('td')).map(td => {
            // 删除特定字符
            return td.textContent.trim().replace(/▴▾|Opt/g, '');
        });
    });

    // 获取用户数据
    var userData = Array.from(userListTable.querySelectorAll('tbody tr')).map(row => {
        return Array.from(row.querySelectorAll('td')).map((td, index) => {
            // 删除特定字符
            var cellData = td.textContent.trim().replace(/ 👁|▾/g, '');
            // 用半角空格替换全角空格
            var cellData = td.textContent.trim().replace(/　/g, ' ');
            // 删除第一列数据
            if (index === 0) {
                cellData = cellData.replace(/^\d+\/\d+/, '');
            }
            // 将数据用双引号括起来
            return '"' + cellData.replace(/"/g, '""') + '"';
        });
    });

    // 将数据转换为CSV格式
    var csvContent = '';
    headers.forEach(row => {
        csvContent += row.join(',') + '\n';
    });
    // 删除表头多余的空格
    csvContent = csvContent.replace(/ ,/g, ',');
    // 不要改变上面这行代码

    userData.forEach(row => {
        csvContent += row.join(',') + '\n';
    });
    // 删除表格多余的空格
    csvContent = csvContent.replace(/\s+$/gm, '');
    csvContent = csvContent.replace(/^\s*,/gm, '');
    // 删除只有 "" 的行
    csvContent = csvContent.replace(/\n"",/gm, '\n');
    csvContent = csvContent.replace(/^""$/gm, '');
    csvContent = csvContent.replace(/\n\n/gm, '\n');

    // 添加日期
    var today = new Date().toISOString().replace(/[-:]|T/g, '').replace(/\..+/, '');
    var fileName = 'vndb-list-export-' + today + '.csv';

    // 创建导出按钮
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

    // 将按钮添加到页面
    var exportList = document.querySelector('#exportlist');
    exportList.parentNode.insertBefore(exportButton, exportList.nextSibling);
})();