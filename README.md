# UserScripts

## Intro

A few userscripts you can install to manager extensions like [Violentmonkey](https://violentmonkey.github.io).
Unlisted scripts have no intro and serve for myself only (you can still do whatever you want granted they're in Public Domain).

## List

| Name | Function | Install |
| ---- | -------- | :-----: |
| [CNM.R18](#cnmr18) | Skip age verification on numerous sites | [install](https://github.com/Vinfall/UserScripts/raw/main/cnm.r18.user.js) |
| [Discuz-Short-URL](#discuz-short-url) | Show short URL on Discuz forums | [install](https://github.com/Vinfall/UserScripts/raw/main/discuz-short-url.user.js) |
| GitHub-Boldless-Title | Remove strong style in GitHub repo title | [install](https://github.com/Vinfall/UserScripts/raw/main/github-boldless-title.user.js) |
| [GitHub Release Highlight](#github-release-highlight) | Highlight GitHub release assets containing keywords | [install](https://github.com/Vinfall/UserScripts/raw/main/github-release-highlight.user.js) |
| [Indienova Game Hide](#indienova-game-hide) | indienova 每周游戏隐藏包含特定游戏类型 | [安装](https://github.com/Vinfall/UserScripts/raw/main/indienova-game-hide.user.js) |
| [JD2Bean](#jd-to-beancount) | 根据京东订单生成 Beancount 账单 | [安装](https://github.com/Vinfall/UserScripts/raw/main/jd2bean.user.js) |
| Show-Orig-Pic | Open image in original resolution | [install](https://github.com/Vinfall/UserScripts/raw/main/show-orig-pic.user.js) |
| [Skip Redirect Inplace](#skip-redirect-inplace) | Skip stupid URL redirect in href | [install](https://github.com/Vinfall/UserScripts/raw/main/skip-redirect-inplace.user.js) |
| [SAO](#steam-advanced-outlink) | Better outlinks on Steam store | [install](https://github.com/Vinfall/UserScripts/raw/main/steam-advanced-outlink.user.js) |
| [VNDB List Export](#vndb-list-export) | Export VNDB user VN/length vote to CSV | [install](https://github.com/Vinfall/UserScripts/raw/main/vndb-list-export.user.js) |
| [Weibo Mobile Redirect](#weibo-mobile-redirect) | 新浪微博自动跳转移动版，支持微博、文章、视频 | [安装](https://github.com/Vinfall/UserScripts/raw/main/weibo-mobile-redirect.user.js) |

## Docs

### CNM.R18

Confirm age automatically on various sites (mostly doujin/game related, but with most Otome stuff excluded) as I'm *Certainly Not Minor* aka. CNM.R18.

Tested to work on all [VNDB extlinks](https://vndb.org/d3#4) except sites require filling DoB like Steam, Epic Games, GOG & eShop US (and some good guy who do not require age verification).

Ideally this *can* work on most sites that requires a NSFW parameter or press a button, but I only add websites I'm aware of.

> [!TIP]
> This also does not have much effect if you seldom/never clean your browser data (which you should NOT do, but that's none of my business), mostly cookies in this case, since you usually only need to verify once and use the website while that cookie lasts.

Alternatively, you can just write a userscript to place/extend confirmed cookies on those websites, if somehow this script breaks in the future. This way is much easier in most cases, but I did not take it on purpose as I don't give a fxxk about cookies and they end up getting deleted once I close the browser, rendering such userscript pointless.

### Discuz Short URL

> [!WARNING]
> This is the sanitized public version and would NOT be updated regularly.

- Only tested on a few Discuz forums
- Only work in limited URLs/mods
- NOT recommended to use

### GitHub Release Highlight

> [!WARNING]
> This is the sanitized public version and would NOT be updated regularly.

Given that it's released in public domain, feel free to do whatever you want :)

### Indienova Game Hide

#### 使用说明

关键词列表因人而异，安装并访问一次 indienova 每周游戏界面后，可以在脚本管理器找到该脚本，点击 `Values` 一栏，修改 `keywords` 字典。
此外，逻辑变量 `ovverrideDefault` 表示是否覆盖脚本自带的关键词列表，值为 `false` 时会与自带列表合并，默认为 `true`（仅使用自定义列表）。

#### 代办

- 支持 `/news-of-overseas-indie-games-and-industry` 页面的 demo 列表 (`p` element instead of `H4`, [example](https://indienova.com/indie-game-news/news-of-overseas-indie-games-and-industry-vol-15/#iah-2))
- 支持 `/indie-game-news/steam-next-fest-*` 页面的 demo 列表

### JD to Beancount

> [!WARNING]
> 这是归档的公开版本，**不会**得到更新。

使用前请查看脚本的 Disclaimer 并修改对应 Beancount 账户。

### Skip Redirect Inplace

> [!NOTE]
> This is not recommended for usage as it slows down every matched website even if you don't click on any outgoing links.

Just a compliment to other existing UserScripts (which would skip link redirect on demand) you can get anywhere.

#### TODO

- Simplify rules, `selector` & `regex` are mostly identical

### Steam Advanced Outlink

The game features card on Steam store page comes with outlinks to the respective game feature (obviously), which is useless as SteamDB has MUCH better functionality on this.

Steam Advanced Outlink, aka. SAO, would replace the default list of outlinks with a few goodies that are really useful.

It also serves as a minimal implementation of Augmented Steam for me since it can be used in mobile browsers with UserScript support like [cromite](https://github.com/uazo/cromite).

While directly inspired by and originated from [Steam Cloudsave](https://greasyfork.org/zh-CN/scripts/489218-steam-cloudsave/), the script is a full rewrite so I change the license from MIT to CC0 (Public Domain).

### VNDB List Export

> [!WARNING]
> DEPRECATED!
> It's suggested to export data via [VNDB query](https://query.vndb.org/about) instead.
> You can find the queries on [my vndb repo](https://github.com/Vinfall/vndb/tree/main/sql).

### Weibo Mobile Redirect

自动跳转微博、文章~~和视频~~为移动端页面。

> [!NOTE]
> ~~Why?~~
> Why not?
> 移动端页面没有 PC 端网页*那么多*的干扰元素，加载速度也要快 60%，何乐而不为。

开启 JavaScript 的情况下访问 `weibo.com` 会先跳转到 `passport.weibo.com` 再跳转回来，脚本会无限循环。
测试下来唯一能让脚本正常工作的办法是在 uBO 禁用 `weibo.com` 的 JavaScript，从而禁止微博自带的链接跳转……
但这样会破坏视频播放的功能，建议需要播放时临时启用 JS，或者使用 [gallery-dl](https://github.com/mikf/gallery-dl)。

### No-Intro

VNDB List Export:
- User VN List
  1. Open user list, e.g. `https://vndb.org/u114514/ulist` (replace the UID)
  2. Select `Multi-select` in the upper right corner & choose labels wisely
  3. Click the number above the table and change it to max (200 as of writing), then click 👁️ icon on the right and choose visible columns
  4. Click `Export as CSV`
  5. Change page, and repeat step 4
  6. Combine those CSV manually, or use [vndb-merge.py](https://gist.vinfall.com/Vinfall/716e312743f74d958d51ee29783fcdc9)
  7. (For Excel usage) change file encoding to `UTF-8 BOM`, or dumb Excel won't recognize CJK characters
- User Length Votes
  1. Open user lengths vote list, e.g. `https://vndb.org/u114514/lengthvotes` (replace the UID)
  2. Click `Export as CSV` right under `Length votes` heading (or in the upper right corner, if logged in)
  3. Change page, and repeat 2
  4. Combine those CSV manually, or use [vndb-merge.py](https://gist.vinfall.com/Vinfall/716e312743f74d958d51ee29783fcdc9)
  5. (For Excel usage) change file encoding to `UTF-8 BOM`, or dumb Excel won't recognize CJK characters

## Notice

Do NOT clone submodule as it's private and protected with private key.
~~You don't even have a chance now that it's a git alias and hosted locally though.~~

## [License](./LICENSE)

Licensed under CC0 1.0 Universal or Public Domain, whichever is more permissive, unless otherwise noted in the script.
