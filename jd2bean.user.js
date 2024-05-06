// ==UserScript==
// @name         JD to Beancount
// @namespace    https://github.com/Vinfall/UserScript
// @author       zsx, Ein Verne, Vinfall
// @version      1.1.2
// @match        https://order.jd.com/*
// @match        https://details.jd.com/*
// @description  根据京东订单生成 Beancount 账单，打开京东我的订单页面或订单详情 (https://order.jd.com/center/list.action)，查看浏览器 console
// @license      MIT
// @grant        none
// ==/UserScript==

/*
    Disclaimer:
    1. If you use any coupon during payment, it will NOT be reflected in JD's end. Take care of those transactions!
        如果在支付方式中使用了优惠/折扣，不会显示在京东订单中，需要手动校对对应订单！
    2. Liability account is for reference only, you should ALWAYS watch out if you ever used other payment methods.
        负债账户仅供参考，如果使用过其他支付方式需要自行修改。
*/

/*
    TODO:
    Support JD Union (https://union.jd.com/presentRecord)
*/

(function () {
    'use strict'
    let debitAccount = {
        // Stripped version of dumb categorizer in `config.py`
        "DEFAULT": "Expenses:Other",
        // 服饰美容
        "衣|裤|袜|鞋|服装|NIKE|李宁|迪卡侬|优衣库|被[子单罩套]": "Expenses:Life:Clothing",
        "[腰书]包|耳塞|眼[罩镜]": "Expenses:Life:Wearing",
        // 食物
        "矿泉水|芬达|雪碧|可乐|红茶|海之盐|阿萨姆|送水|怡宝|饮料|美年达|奶茶|[鲜牛]奶|饮品|咖啡|cafe|拿铁|烧仙草": "Expenses:Food:Drinks",
        "水果": "Expenses:Food:Fruits",
        // 健康
        "口罩|化妆|面膜|[洗洁]面奶|[毛纸湿]巾|清洗液": "Expenses:Health:Medicare",
        // 娱乐
        "图书|书店|商务印书馆|当当|出版": "Expenses:Fun:Book",
        // 游戏
        "卡带|[Ss]witch|SWITCH|任天堂|Nintendo|[23]DS|NGC|WII|AMIIBO|amiibo": "Expenses:Game:Nintendo",
        "PLAYSTATION|PS[45N]": "Expenses:Game:PSN",
        "Xbox|XGP|XBOX": "Expenses:Game:Microsoft",
        // 数码科技
        "gopro|大疆|无人机|键盘|鼠标|SD卡|U盘|USB|[相耳]机|手柄|显示器|[显网]卡|硬盘|NAS|内存|路由器|数据线|支架|oppo|huawei|vivo|iqoo|电源|树莓派": "Expenses:Tech:Gadget",
    }
    let liabilityAccount = "Liabilities:CreditCard:CMB:AmEx"

    function chooseExpenseAccount(goodsName) {
        for (let debitAccountKey in debitAccount) {
            let regex = new RegExp(debitAccountKey);
            let re = goodsName.match(regex)
            if (re != null) {
                return debitAccount[debitAccountKey]
            }
        }
        return debitAccount['DEFAULT']
    }

    const $ = document.querySelectorAll.bind(document);

    // 封装重复的查询和操作
    function getText(selector, context = document) {
        return context.querySelector(selector).innerText.trim();
    }

    function splitDateTime(dateTime) {
        const [date, time] = dateTime.split(' ');
        return {
            date,
            time
        };
    }

    // frontmatter
    // console.log(';; -*- mode: beancount -*-');

    if ($('.td-void.order-tb').length > 0) {
        setTimeout(() => {
            const orders = Array.from($('.order-tb tbody[id*="tb-"]')).filter(order => {
                const orderStatus = getText('.order-status', order);
                console.log(orderStatus);
                return orderStatus === '已完成';
            }).map(order => {
                const {
                    date,
                    time
                } = splitDateTime(getText('.dealtime', order));
                const expenseAccount = chooseExpenseAccount(getText('.p-name', order));
                const amount = getText('.amount', order).match(/([0-9.]+)/)[1];
                const orderNumber = getText('.number', order);
                const productName = getText('.p-name', order);
                const trackExists = order.querySelectorAll('[id*="track"]').length === 1;
                const productSuffix = trackExists ? '' : ' 等';

                return `
${date} * "京东 ${orderNumber}" "${productName}${productSuffix}"
  date: ${date}
  time: "${time}"
  ${expenseAccount}   ${amount} CNY
  ${liabilityAccount}
`.trim();
            }).join('\n\n');
            console.log(orders);
        }, 5000);
    }

    if ($('.goods-total').length > 0) {
        // 订单详情
        const price = getText('.txt.count').replace(/￥|¥/, '');
        const totalPrice = getText('.goods-total .txt').replace(/￥|¥/, '');
        const priceRatio = price / totalPrice;

        const details = Array.from($('tr[class*="product"]')).map(product => {
            const productName = getText('.p-name', product);
            const productPrice = getText('.f-price', product).replace(/￥|¥/, '');
            const quantity = product.querySelectorAll('td')[4].innerText.trim();
            const expenseAccount = chooseExpenseAccount(productName);
            const date = document.querySelector('[id*="datesubmit"]').value.split(' ')[0];

            return `
${date} * "京东" "${productName}"
  ${expenseAccount}                             ${(productPrice * quantity * priceRatio).toFixed(2)} CNY
  ${liabilityAccount}
`;
        }).join('');
        console.log(details);
    }


})();