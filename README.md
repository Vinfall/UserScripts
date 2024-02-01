## Intro

A few userscripts you can install to manager extensions like [Violentmonkey](https://violentmonkey.github.io).
Unlisted scripts have no intro and serve for myself only (you can still do whatever you want granted they're in Public Domain).

## List

| Name | Function |
| ---- | ---- |
| [`Sensitive-GameBanana.user.js`](https://github.com/Vinfall/UserScripts/raw/main/Sensitive-GameBanana.user.js) | Skip GameBanana NSFW warning redirect when not logged in |
| [`vndb-list-export.user.js`](https://github.com/Vinfall/UserScripts/raw/main/vndb-list-export.user.js) | Export VNDB user list to CSV |
| [`indienova-game-hide.user.js`](https://github.com/Vinfall/UserScripts/raw/main/indienova-game-hide.user.js) | indienova 每周游戏隐藏包含特定关键字的游戏 |

### VNDB User List Exporter

#### How to Use

1. Log in and open user list, e.g. `https://vndb.org/u114514/ulist`
2. Select `Multi-select` in the upper right corner & choose labels wisely
3. Click the number above the table and change it to max (200 as of writing), then click 👁️ icon on the right and choose visible columns
4. Click `Export as CSV`
5. Change page, and repeat 4
6. Combine those CSV manually
7. (For Excel usage) change file encoding to UTF-8 BOM, or dumb Excel won't recognize CJK characters

#### Bugs & Todo

- [x] VN/Developer with comma in their name would trigger a data offset
- You would return to first page after exporting the CSV, this is unintended and considered a bug
- No auto page for now (my last attempt ended up with infinite loop...)
- `Export as CSV` button is placed next to `Export` button VNDB provides, which means you cannot use this script without login, but you can manually edit the query code to achieve that 

## Todo

`indienova-game-hide`:
- [ ] Add a clickable button to avoid violently hiding elements
- [ ] Support demo listing in `/news-of-overseas-indie-games-and-industry` (`p` element instead of `H4`, [example](https://indienova.com/indie-game-news/news-of-overseas-indie-games-and-industry-vol-15/#iah-2))

## Notice

Do NOT clone submodule as it's private and protected with private key.

## License

Licensed under CC0 1.0 Universal (Public Domain), unless otherwise noted in the script *per se*.

