// ==UserScript==
// @name              VNDB Character Zodiac
// @name:zh-cn        VNDB 角色星座
// @namespace         https://github.com/Vinfall/UserScripts
// @version           0.3.4
// @author            Vinfall
// @match             https://vndb.org/c*
// @exclude-match     https://vndb.org/c
// @exclude-match     https://vndb.org/*/hist
// @grant             none
// @run-at            document-end
// @license           CC0 1.0 Universal (Public Domain)
// @icon              data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>♈</text></svg>
// @description       Show zodiac signs of VNDB character
// @description:zh-cn 显示 VNDB 角色星座
// ==/UserScript==

(() => {
    // List: ♈♉♊♋♌♍♎♏♐♑♒♓⛎
    // Date: https://en.wikipedia.org/wiki/Astrological_sign#Western_astrological_correspondence_chart
    //       https://en.wikipedia.org/wiki/Equinox
    // Test:
    //      ♈ c84396
    //      ♉ c92335
    //      ♊ c92327
    //      ♋ c8737
    //      ♌ c109413
    //      ♍ c7921
    //      ♎ c34573
    //      ♏ c107031
    //      ♐ c1269
    //      ♑ c165091 c36690
    //      ♒ c5092
    //      ♓ c61060
    const zodiacs = [
        { name: 'Aries', emoji: '♈', start: [3, 20] },
        { name: 'Taurus', emoji: '♉', start: [4, 21] },
        { name: 'Gemini', emoji: '♊', start: [5, 22] },
        { name: 'Cancer', emoji: '♋', start: [6, 21] },
        { name: 'Leo', emoji: '♌', start: [7, 24] },
        { name: 'Virgo', emoji: '♍', start: [8, 24] },
        { name: 'Libra', emoji: '♎', start: [9, 23] },
        { name: 'Scorpio', emoji: '♏', start: [10, 24] },
        { name: 'Sagittarius', emoji: '♐', start: [11, 23] },
        { name: 'Capricorn', emoji: '♑', start: [12, 21] },
        { name: 'Aquarius', emoji: '♒', start: [1, 21] },
        { name: 'Pisces', emoji: '♓', start: [2, 20] },
    ];
    const monthMap = {
        January: 1,
        February: 2,
        March: 3,
        April: 4,
        May: 5,
        June: 6,
        July: 7,
        August: 8,
        September: 9,
        October: 10,
        November: 11,
        December: 12,
    };
    function getZodiac(day, monthStr) {
        const month = monthMap[monthStr];
        if (!day || !month) return null;

        // match zodiac
        for (let i = 0; i < zodiacs.length; i++) {
            const current = zodiacs[i];
            const next = zodiacs[i + 1];
            if (
                !next ||
                (month === current.start[0] && day >= current.start[1]) ||
                (month === next.start[0] && day < next.start[1])
            ) {
                return current;
            }
        }
        return zodiacs[0]; // default to Capricorn
    }
    // find birthday
    const rows = document.querySelectorAll('table.stripe tr');
    let day, monthStr, zodiacData;
    for (const row of rows) {
        const key = row.querySelector('.key');
        if (key && key.textContent.trim() === 'Birthday') {
            const val = row.querySelector('td:last-child').textContent.trim();
            // Format: 1 January, January 1
            const match = val.match(/(\d+)\s+([A-Z][a-z]+)|([A-Z][a-z]+)\s+(\d+)/);
            if (match) {
                day = parseInt(match[1] || match[4], 10);
                monthStr = match[2] || match[3];
                zodiacData = getZodiac(day, monthStr);
                break;
            }
        }
    }
    if (!zodiacData) return;
    // find place to insert
    const headerTd = document.querySelector('table.stripe thead td');
    if (!headerTd) return;
    const emojiSpan = document.createElement('span');
    emojiSpan.style.marginLeft = '5px';
    emojiSpan.title = `Zodiac Sign: ${zodiacData.name}`;
    emojiSpan.textContent = zodiacData.emoji;
    // append to the end after: name, sex/gender, blood type
    headerTd.appendChild(emojiSpan);
})();
