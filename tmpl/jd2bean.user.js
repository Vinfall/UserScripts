// ==UserScript==
// @name         JD to Beancount
// @namespace    https://github.com/Vinfall/UserScripts
// @author       zsx, Ein Verne, Vinfall
// @version      2.3.1
// @match        https://order.jd.com/*
// @match        https://details.jd.com/*
// @description  根据京东订单生成 Beancount 账单，打开京东我的订单页面或订单详情 (https://order.jd.com/center/list.action)，查看浏览器 console
// @license      MIT
// @grant        none
// ==/UserScript==

/*
    Disclaimer:
    1. Coupon used in payment will NOT be reflected in JD's end. Manually audit is required.
        如果在支付方式中使用了优惠/折扣，京东的金额是错误的，需要手动校对。
    2. Accounts are for reference only, customize before use.
        账户分类仅供参考，使用前请自行修改。
*/

(() => {
    // Minimal dumb categorizer, c.f. common_expense_account in import.py
    const expenseAccounts = {
        DEFAULT: 'Expenses:Other', // 'Expenses:Food:Take-out'
        // 服饰美容
        '衣|裤|袜|鞋|服装|NIKE|李宁|迪卡侬|优衣库|被[子单罩套]': 'Expenses:Life:Clothing',
        '[腰书]包|耳塞|眼[罩镜]': 'Expenses:Life:Wearing',
        // 食物
        '包子|馒头|[面菜肉]包|杯面|海福盛': 'Expenses:Food:Breakfast',
        '矿泉水|雪碧|可乐|红茶|怡宝|饮料|奶茶|[鲜牛]奶|饮品|咖啡|cafe|拿铁|蜜雪冰城|[一1]点点':
            'Expenses:Food:Drinks',
        水果: 'Expenses:Food:Fruits',
        // 健康
        '医院|药房': 'Expenses:Health:Hospital',
        '口罩|化妆|面膜|[洗洁]面奶|[毛纸湿]巾|清洗液': 'Expenses:Health:Medicare',
        // 娱乐
        '图书|书店|商务印书馆|当当|出版': 'Expenses:Fun:Book',
        // 游戏
        '卡带|[Ss]witch|SWITCH|任天堂|Nintendo|3DS|NGC|WII|AMIIBO|amiibo': 'Expenses:Game:Nintendo',
        'PLAYSTATION|PS[45N]': 'Expenses:Game:PSN',
        'Xbox|XBOX|XGP': 'Expenses:Game:Microsoft',
        // 数码科技
        'gopro|大疆|无人机|键盘|鼠标|SD卡|U盘|USB|[相耳]机|手柄|显示器|[显网]卡|硬盘|NAS|内存|路由器|数据线|支架|oppo|huawei|vivo|iqoo|电源|树莓派':
            'Expenses:Tech:Gadget',
        // 杂物
        '家乐福|超[市商]|便利店|百货|商贸': 'Expenses:Consumable',
    };
    const liabilityAccount = 'Liabilities:CreditCard:CMB:AmEx';

    function chooseExpenseAccount(goodsName) {
        for (const expenseAccount in expenseAccounts) {
            if (expenseAccount === 'DEFAULT') {
                continue;
            }
            const regex = new RegExp(expenseAccount);
            if (regex.test(goodsName)) {
                return expenseAccounts[expenseAccount];
            }
        }
        return expenseAccounts.DEFAULT;
    }

    function text(selector, context = document) {
        const element = context.querySelector(selector);
        return element ? element.innerText.trim() : '';
    }

    function all(selector, context = document) {
        return Array.from(context.querySelectorAll(selector));
    }

    function parseDateTime(value) {
        // 例如：2026-08-09 16:03:54
        const match = value.trim().match(/^(\d{4}-\d{1,2}-\d{1,2})\s+(\d{2}:\d{2}:\d{2})/);
        if (!match) {
            return {
                date: value.trim().split(/\s+/)[0] || '',
                time: '',
            };
        }
        return {
            date: match[1],
            time: match[2],
        };
    }

    function parseMoney(value) {
        // 支持：¥23.25、￥23.25、23.25
        const match = value.replace(/,/g, '').match(/-?\d+(?:\.\d+)?/);
        return match ? Number(match[0]) : 0;
    }

    function formatMoney(value) {
        return Number(value).toFixed(2);
    }

    function escapeBeancountString(value) {
        return String(value).replace(/\\/g, '\\\\').replace(/"/g, '\\"').replace(/\r?\n/g, ' ');
    }

    function getOrderNumber(order) {
        return text('[class^="orderMetas-"] [class^="metaValue-"]', order);
    }

    function getOrderProducts(order) {
        return all('[class^="productItem-"]', order)
            .map((product) => {
                const name =
                    text('h3[class^="productTitle-"]', product) ||
                    text('[class^="goodImg-"]', product) ||
                    text('[class^="goodImg-"][title]', product);
                const countText = text('[class^="countNum-"]', product);
                const quantity = parseMoney(countText) || 1;
                return {
                    name,
                    quantity,
                };
            })
            .filter((product) => product.name);
    }

    function exportOrders() {
        const orderCards = all('.listContent-c79c2f [class^="orderCard-"]');
        if (orderCards.length === 0) {
            console.warn('没有找到订单卡片，请确认订单列表已经加载完成。');
            return false;
        }
        const result = orderCards
            .filter((order) => {
                const status = text('[class^="statusText-"]', order);
                return status === '已完成';
            })
            .map((order) => {
                const dateTime = text('[class^="orderTime-"] [class^="metaValue-"]', order);
                const { date, time } = parseDateTime(dateTime);
                const orderNumber = getOrderNumber(order);
                const products = getOrderProducts(order);
                if (products.length === 0) {
                    console.warn('订单没有找到商品名称：', order);
                    return '';
                }
                const totalPrice = parseMoney(text('[class^="priceRow-"]', order));

                // 使用第一个商品名，如果订单中有多个商品，则在名称后加“等”
                // const firstProductName = products[0].name;
                // const productSuffix = products.length > 1 ? ' 等' : '';
                // const goodsName = `${firstProductName}${productSuffix}`;
                // const expenseAccount = chooseExpenseAccount(firstProductName);

                // 列出所有商品名
                const goodsName = products.map((product) => `${product.name} ×${product.quantity}`).join('，');
                const expenseAccount = chooseExpenseAccount(goodsName);

                return `
${date} * "京东" "${escapeBeancountString(goodsName)}"
  time: "${time}"
  transaction: "${escapeBeancountString(orderNumber)}"
  ${liabilityAccount}  -${formatMoney(totalPrice)} CNY
  ${expenseAccount}`.trim();
            })
            .filter(Boolean)
            .join('\n\n');
        console.log(result);
        return true;
    }

    function getSelectedOrderPeriod() {
        const container =
            document.querySelector('.selectContainer-73b052') || document.querySelector('[class^="selectContainer-"]');

        if (!container) {
            return '';
        }

        const spans = Array.from(container.querySelectorAll('span')).filter((span) => {
            const value = span.textContent.replace(/\s+/g, ' ').trim();
            // e.g. 近3个月订单, 今年内订单, 2025年订单
            return value.includes('订单');
        });
        // 优先读取可见的周期文本
        const visibleSpan = spans.find((span) => {
            return span.offsetParent !== null;
        });

        return (
            visibleSpan?.textContent.replace(/\s+/g, ' ').trim() ||
            spans[0]?.textContent.replace(/\s+/g, ' ').trim() ||
            ''
        );
    }

    let lastExportedKey = '';
    let exportTimer = null;

    function getPageKey() {
        const period = getSelectedOrderPeriod();
        return `${period}@@${window.location.href}`;
    }

    function scheduleExport() {
        clearTimeout(exportTimer);

        // 等待订单列表 DOM 更新
        exportTimer = setTimeout(() => {
            const currentKey = getPageKey();
            // 当前周期和 URL 都没有变化，不重复导出
            if (currentKey === lastExportedKey) {
                return;
            }

            const exported = exportOrders();

            if (exported) {
                lastExportedKey = currentKey;
                console.log(`已导出：${getSelectedOrderPeriod()}\n${window.location.href}`);
            }
        }, 1200);
    }

    function watchUrlChanges() {
        const methods = ['pushState', 'replaceState'];
        methods.forEach((methodName) => {
            const originalMethod = history[methodName];
            history[methodName] = function (...args) {
                const result = originalMethod.apply(this, args);
                // 切换分页时触发
                window.dispatchEvent(new Event('jd-url-change'));
                return result;
            };
        });
        // 浏览器前进、后退
        window.addEventListener('popstate', () => {
            scheduleExport();
        });
        // pushState/replaceState
        window.addEventListener('jd-url-change', () => {
            scheduleExport();
        });
    }

    function watchOrderPage() {
        watchUrlChanges();
        const observer = new MutationObserver(() => {
            const currentKey = getPageKey();
            // 年份、时间范围或 URL 发生变化时重新导出
            if (currentKey !== lastExportedKey) {
                scheduleExport();
            }
        });

        observer.observe(document.body, {
            subtree: true,
            childList: true,
            characterData: true,
        });

        // 首次进入页面时导出
        scheduleExport();

        console.log('开始监听京东订单变化');
    }

    watchOrderPage();
})();
