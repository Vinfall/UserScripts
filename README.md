## Intro

A few userscripts you can install to manager extensions like [Violentmonkey](https://violentmonkey.github.io).
Unlisted scripts have no intro and serve for myself only (you can still do whatever you want granted they're in Public Domain).

## List

| Name | Function |
| ---- | ---- |
| [`Sensitive-GameBanana.user.js`](https://github.com/Vinfall/UserScripts/raw/main/Sensitive-GameBanana.user.js) | Skip GameBanana NSFW warning redirect when not logged in |
| [`vndb-list-export.user.js`](https://github.com/Vinfall/UserScripts/raw/main/vndb-list-export.user.js) | Export VNDB user VN/length vote list to CSV |
| [`reddit-over18.user.js`](https://github.com/Vinfall/UserScripts/raw/main/reddit-over18.user.js) | Skip Reddit over 18 warning |
| [`indienova-game-hide.user.js`](https://github.com/Vinfall/UserScripts/raw/main/indienova-game-hide.user.js) | indienova 每周游戏隐藏包含特定关键字的游戏 |
| [`a9vg-redirect-skip.user.js`](https://github.com/Vinfall/UserScripts/raw/main/a9vg-redirect-skip.user.js) | A9VG 跳过外链跳转确认 |
| [`steam-game-feature-kai.user.js`](https://github.com/Vinfall/UserScripts/raw/main/steam-game-feature-kai.user.js) | Alternative game feature outlinks on Steam store webpage |
| [`sharepoint-cookie-pasta.user.js`](https://github.com/Vinfall/UserScripts/raw/main/sharepoint-cookie-pasta.user.js) | Copy OneDrive Sharepoint cookie for aria2 usage |
| [`censored-dlsite.user.js`](https://github.com/Vinfall/UserScripts/raw/main/censored-dlsite.user.js) | Censored DLsite genre list |
| [`uncensored-dlsite.user.js`](https://github.com/Vinfall/UserScripts/raw/main/uncensored-dlsite.user.js) | Uncensored DLsite genre list |
| [`github-release-highlight.user.js`](https://github.com/Vinfall/UserScripts/raw/main/github-release-highlight.user.js) | Highlight GitHub release assets containing keywords |
| [`jd2bean.user.js`](https://github.com/Vinfall/UserScripts/raw/main/jd2bean.user.js) | 根据京东订单生成 Beancount 账单 |

### VNDB List Export

#### How to Export User List

1. Open user list, e.g. `https://vndb.org/u114514/ulist` (replace the number)
2. Select `Multi-select` in the upper right corner & choose labels wisely
3. Click the number above the table and change it to max (200 as of writing), then click 👁️ icon on the right and choose visible columns
4. Click `Export as CSV`
5. Change page, and repeat 4
6. Combine those CSV manually
7. (For Excel usage) change file encoding to `UTF-8 BOM`, or dumb Excel won't recognize CJK characters

> [!NOTE]
> It's NOT recommended to do *delta update* if you want stats like `Rating` & `Length` as they are dynamic (expected to change over time).

#### How to Export Length Votes List

1. Open user lengths vote list, e.g. `https://vndb.org/u114514/lengthvotes` (replace the number)
2. Click `Export as CSV` right under `Length votes` heading (or in the upper right corner, if logged in)
3. Change page, and repeat 2
4. Combine those CSV manually
5. (For Excel usage) change file encoding to `UTF-8 BOM`, or dumb Excel won't recognize CJK characters

> [!TIP]
> It's possible to do *delta update* as length votes are generally static and should not change unless you do that explicitly.

#### Bugs & Todo

- [x] Adjust data offset for VN/Developer name with comma
- [x] Support length votes export
- [x] Support list export without login
- [x] Solve length votes export breakage if the user has only one page
- [x] Add length votes button
- [ ] Would return to first page after exporting the CSV, this is unintended and considered a bug
- [ ] Auto pager (or add an additional `Save page data` button & export at once in the end?)

### Indienova Game Hide

#### 使用说明

关键词列表因人而异，安装并访问一次 indienova 每周游戏界面后，可以在脚本管理器找到该脚本，点击 `Values` 一栏，修改 `keywords` 字典。
此外，逻辑变量 `ovverrideDefault` 表示是否覆盖脚本自带的关键词列表，值为 `false` 时会与自带列表合并，默认为 `true`（仅使用自定义列表）。

#### 代办

- [x] 为隐藏游戏添加一个临时显示按钮
- [ ] 支持 `/news-of-overseas-indie-games-and-industry` 页面的 demo 列表 (`p` element instead of `H4`, [example](https://indienova.com/indie-game-news/news-of-overseas-indie-games-and-industry-vol-15/#iah-2))

### Steam Game Feature Kai

The game features card on Steam store page comes with outlinks to the respective game feature (obviously), which is a bit useless as SteamDB has MUCH better functionality on this.

This script would replace the default list of features with a few goodies that are really useful.

It also serves as a minimal replacement for Augmented Steam for me since it does not require an extra extension and can be used in mobile browsers with userscript support like [cromite](https://github.com/uazo/cromite).

While inspired by and originated from [Steam Cloudsave](https://greasyfork.org/zh-CN/scripts/489218-steam-cloudsave/), the script is considered to be a full rewrite so it should be safe to change the license from MIT to CC0 (Public Domain).

### Sharepoint Cookie Pasta

OneDrive Sharepoint can be hard to deal with at times and multiple tools that can get direct link & cookies from Sharepoint do not work nowadays, this is created to ease the pain *a little* by having a `Copy cookie` button so that I don't have to open DevTools over and over again.

In case the button does not show up, the cookie is also printed to console log. You can easily filter out the message by searching `user.js`.

#### Todo

- [ ] Catch document type response gracefully & only output if the cookie begins with `FedAuth`

### Censored/Uncensored DLsite

A silly script for fun regarding DLsite forced to censor its genre list according to [a questionable X post](https://twitter.com/mttb2ccp_pt2/status/1772466120290693434). You can censor it yourself if you want, and vice versa XD.

### GitHub Release Highlight

> [!WARNING]
> This is the sanitized public version and would NOT be updated regularly.

Given that it's released in public domain, feel free to do whatever you want :)

### JD to Beancount

> [!WARNING]
> 这是归档的公开版本，**不会**得到更新。

使用前请查看脚本的 Disclaimer 并修改对应 Beancount 账户。

## Notice

Do NOT clone submodule as it's private and protected with private key.

## [License](./LICENSE)

Licensed under CC0 1.0 Universal (Public Domain), unless otherwise noted in the script *per se*.
