# Changelog

## [7.12.1](https://gitlab.lavid.ufpb.br/vlibras2019/vlibras-web-extensions/vlibras-web-browsers/compare/v7.12.0...v7.12.1) (2026-09-03)

### Bug Fixes

* **a11y:** add alt text to widget popup and button images ([2e864dc](https://gitlab.lavid.ufpb.br/vlibras2019/vlibras-web-extensions/vlibras-web-browsers/commit/2e864dc56c5243ec4b885a34d30ccb4708a172c9))

# [7.12.0](https://gitlab.lavid.ufpb.br/vlibras2019/vlibras-web-extensions/vlibras-web-browsers/compare/v7.11.0...v7.12.0) (2026-09-03)

### Bug Fixes

* **deps:** patch security vulnerabilities ([26bc03a](https://gitlab.lavid.ufpb.br/vlibras2019/vlibras-web-extensions/vlibras-web-browsers/commit/26bc03a3305e24c3284995c2e4e6dc7b3e46621b))

### Features

* add focus-visible accessibility styles for vlibras-button ([ff0895f](https://gitlab.lavid.ufpb.br/vlibras2019/vlibras-web-extensions/vlibras-web-browsers/commit/ff0895f8e5833cdab90f196ed58d81e108d95270))
* **loader:** expose access widget instance via `access` property ([5d4a126](https://gitlab.lavid.ufpb.br/vlibras2019/vlibras-web-extensions/vlibras-web-browsers/commit/5d4a12669c935013ef1d815ad8ac779e1b9cea82))
* **widget:** improve dialog accessibility and close button customization ([f04ed6d](https://gitlab.lavid.ufpb.br/vlibras2019/vlibras-web-extensions/vlibras-web-browsers/commit/f04ed6dbaeacbf760d0a15ae5730770ee8dc5e63))
* **widget:** improve header menu and avatar button layout ([655af33](https://gitlab.lavid.ufpb.br/vlibras2019/vlibras-web-extensions/vlibras-web-browsers/commit/655af33aba2aa39af3b102714a0f6badbfec5cfd))

# [7.11.0](https://gitlab.lavid.ufpb.br/vlibras2019/vlibras-web-extensions/vlibras-web-browsers/compare/v7.10.0...v7.11.0) (2026-08-31)

### Bug Fixes

* **header:** only track expand event when expanding ([6cfc197](https://gitlab.lavid.ufpb.br/vlibras2019/vlibras-web-extensions/vlibras-web-browsers/commit/6cfc1971a36d4483d8e9defc243593f6bd0a911c))
* **pristine-globals:** use native 'String.prototype' methods via call to avoid corrupted prototypes ([0d97b0b](https://gitlab.lavid.ufpb.br/vlibras2019/vlibras-web-extensions/vlibras-web-browsers/commit/0d97b0b66e5d20033f7e20f89ce74b00e92c93f7))
* **toggle-avatar-button:** conditionally hide avatar name button when guide is selected ([d68646a](https://gitlab.lavid.ufpb.br/vlibras2019/vlibras-web-extensions/vlibras-web-browsers/commit/d68646ae81e73014cb1f02943bd1d1b2d19ca970))

### Features

* **core/actions:** support json translation responses ([1f9dafc](https://gitlab.lavid.ufpb.br/vlibras2019/vlibras-web-extensions/vlibras-web-browsers/commit/1f9dafc590e905b395055c9a64da2b5802eaa510))
* **player, widget:** guard speed action and improve speed control ui ([d7b4c1b](https://gitlab.lavid.ufpb.br/vlibras2019/vlibras-web-extensions/vlibras-web-browsers/commit/d7b4c1b409326612e3dd1e8dad6c008b297edb9e))
* **widget:** display translated text in feedback suggestion dialog ([2de2298](https://gitlab.lavid.ufpb.br/vlibras2019/vlibras-web-extensions/vlibras-web-browsers/commit/2de2298d17a55f670644582bfde2265c6acff660))
* **widget:** enhance translation validation and update typescript target ([8730837](https://gitlab.lavid.ufpb.br/vlibras2019/vlibras-web-extensions/vlibras-web-browsers/commit/873083788699b1b73ab384fc3d12ff202de0fcce))

# [7.10.0](https://gitlab.lavid.ufpb.br/vlibras2019/vlibras-web-extensions/vlibras-web-browsers/compare/v7.9.1...v7.10.0) (2026-08-28)

### Bug Fixes

* **loader:** add null check for path argument ([4295b99](https://gitlab.lavid.ufpb.br/vlibras2019/vlibras-web-extensions/vlibras-web-browsers/commit/4295b99f3652e72446eb8bdce230b874035868a6))

### Features

* update unity build (28-08-26) ([9d093f2](https://gitlab.lavid.ufpb.br/vlibras2019/vlibras-web-extensions/vlibras-web-browsers/commit/9d093f259ac732d755a19e80cd03c8233c70435d))

## [7.9.1](https://gitlab.lavid.ufpb.br/vlibras2019/vlibras-web-extensions/vlibras-web-browsers/compare/v7.9.0...v7.9.1) (2026-08-27)

### Performance Improvements

* **posthog:** disable performance capture and tighten typings ([0a17b33](https://gitlab.lavid.ufpb.br/vlibras2019/vlibras-web-extensions/vlibras-web-browsers/commit/0a17b336dd62ede0f2d681950359a2e122979f3b))

# [7.9.0](https://gitlab.lavid.ufpb.br/vlibras2019/vlibras-web-extensions/vlibras-web-browsers/compare/v7.8.1...v7.9.0) (2026-08-27)

### Bug Fixes

* adjust tab visibility sync logic ([50a378c](https://gitlab.lavid.ufpb.br/vlibras2019/vlibras-web-extensions/vlibras-web-browsers/commit/50a378cc770086b29a6822ca9ff99297aa187e5a))
* **feedback:** persist suggestion reopen state across widget unmount ([f325244](https://gitlab.lavid.ufpb.br/vlibras2019/vlibras-web-extensions/vlibras-web-browsers/commit/f325244c594e58f2dfa53cd89b50f28f1495d1c0))
* **loader:** add safe localstorage access with try/catch ([81b1ff6](https://gitlab.lavid.ufpb.br/vlibras2019/vlibras-web-extensions/vlibras-web-browsers/commit/81b1ff61ab02d934b5ad0bc7b0d72a5df49e8236))
* **progress-bar:** hide progress bar when count is zero ([74ed5a2](https://gitlab.lavid.ufpb.br/vlibras2019/vlibras-web-extensions/vlibras-web-browsers/commit/74ed5a28fcaa48aa17316612b73ee8bb1f1bdacb))
* **ui/dialog:** prevent title overflow and ensure text truncation ([fa5ffdb](https://gitlab.lavid.ufpb.br/vlibras2019/vlibras-web-extensions/vlibras-web-browsers/commit/fa5ffdb77b2f479d1cf53a2b4dd2835d9e5e7df1))

### Features

* **loader:** auto-open widget based on persisted state ([4271814](https://gitlab.lavid.ufpb.br/vlibras2019/vlibras-web-extensions/vlibras-web-browsers/commit/4271814b73631c5ca9cc94996b013b4b531f9dff))
* **player:** include version in player iframe url ([58cb288](https://gitlab.lavid.ufpb.br/vlibras2019/vlibras-web-extensions/vlibras-web-browsers/commit/58cb28898b373ee633802df558ee063fd0d0c78c))
* **player:** retry player iframe load on 503/stuck load ([13a2ca1](https://gitlab.lavid.ufpb.br/vlibras2019/vlibras-web-extensions/vlibras-web-browsers/commit/13a2ca1b0df410ce48ac18a9899878798e1cc12c))

### Reverts

* "feat(widget): enhance progress bar with smooth animated progress" ([4383476](https://gitlab.lavid.ufpb.br/vlibras2019/vlibras-web-extensions/vlibras-web-browsers/commit/43834768d210976f6821706fa951d5fbefd4b59c))

## [7.8.1](https://gitlab.lavid.ufpb.br/vlibras2019/vlibras-web-extensions/vlibras-web-browsers/compare/v7.8.0...v7.8.1) (2026-08-25)

### Bug Fixes

* **core:** lock restored string prototype methods and improve corruption handling ([277716a](https://gitlab.lavid.ufpb.br/vlibras2019/vlibras-web-extensions/vlibras-web-browsers/commit/277716a8b4d17a3e542ae55b308e4912d46f2b19))
* **styles:** neutralize host page font-size effect on rem-based CSS ([a12d2be](https://gitlab.lavid.ufpb.br/vlibras2019/vlibras-web-extensions/vlibras-web-browsers/commit/a12d2be52008b6407f5fc832b9a1b01b58926c03))

# [7.8.0](https://gitlab.lavid.ufpb.br/vlibras2019/vlibras-web-extensions/vlibras-web-browsers/compare/v7.7.0...v7.8.0) (2026-08-25)

### Bug Fixes

* **unity-loader:** disable unity cache ([498bb27](https://gitlab.lavid.ufpb.br/vlibras2019/vlibras-web-extensions/vlibras-web-browsers/commit/498bb27f56fc9bc3a34f1a56b611ade8f61d7b13))

### Features

* **posthog:** disable posthog tracking on local development hosts ([211b9c8](https://gitlab.lavid.ufpb.br/vlibras2019/vlibras-web-extensions/vlibras-web-browsers/commit/211b9c890239f4c4826b5d654b7aa0cab500f20b))

# [7.7.0](https://gitlab.lavid.ufpb.br/vlibras2019/vlibras-web-extensions/vlibras-web-browsers/compare/v7.6.0...v7.7.0) (2026-08-24)

### Bug Fixes

* **core:** restore pristine 'String' prototype methods ([6182cf9](https://gitlab.lavid.ufpb.br/vlibras2019/vlibras-web-extensions/vlibras-web-browsers/commit/6182cf9c8a70818b02c7731c7bcf6a353ad14e3e))
* **styles:** correct css variable name for font-size ([ed945db](https://gitlab.lavid.ufpb.br/vlibras2019/vlibras-web-extensions/vlibras-web-browsers/commit/ed945db35c9ef86049b93e1e9053c9a2db7c2bca))

### Features

* add random avatar selection support ([10f6496](https://gitlab.lavid.ufpb.br/vlibras2019/vlibras-web-extensions/vlibras-web-browsers/commit/10f6496a50acb1916f519731c2d6f84478404a96))

# [7.6.0](https://gitlab.lavid.ufpb.br/vlibras2019/vlibras-web-extensions/vlibras-web-browsers/compare/v7.5.0...v7.6.0) (2026-08-24)

### Bug Fixes

* **text-capture:** safely retrieve selected option text ([609c26f](https://gitlab.lavid.ufpb.br/vlibras2019/vlibras-web-extensions/vlibras-web-browsers/commit/609c26f1d0a2d8821f6b4d07765177512cc01366))

### Features

* **widget:** enhance progress bar with smooth animated progress ([d793429](https://gitlab.lavid.ufpb.br/vlibras2019/vlibras-web-extensions/vlibras-web-browsers/commit/d793429fc6491e53d40827a56dc5f205b4a2bdf0))

# [7.5.0](https://gitlab.lavid.ufpb.br/vlibras2019/vlibras-web-extensions/vlibras-web-browsers/compare/v7.4.0...v7.5.0) (2026-08-19)

### Bug Fixes

* **sync:** adjust tab visibility condition to check for playing status ([f47368b](https://gitlab.lavid.ufpb.br/vlibras2019/vlibras-web-extensions/vlibras-web-browsers/commit/f47368bfe35b417b9f7a3ef7274f24372ef2d05a))

### Features

* **perf:** add gzip/brotli compression and versioned loader ([ab4371f](https://gitlab.lavid.ufpb.br/vlibras2019/vlibras-web-extensions/vlibras-web-browsers/commit/ab4371fb1317ea3a2380fff801c6e7db4ff1262c))
* **player/widget:** add 'OBRIGADO' bundle and allow custom static url for 'playStatic' ([fdd2b0a](https://gitlab.lavid.ufpb.br/vlibras2019/vlibras-web-extensions/vlibras-web-browsers/commit/fdd2b0a576ddb4cc11f07c7251f23489523babd5))
* update unity build (19-08-26) ([6c19463](https://gitlab.lavid.ufpb.br/vlibras2019/vlibras-web-extensions/vlibras-web-browsers/commit/6c1946363689d61ca810093a3f3dc105f8e3c184))
* **widget:** add gloss translation flag and improve translation handling ([464bde3](https://gitlab.lavid.ufpb.br/vlibras2019/vlibras-web-extensions/vlibras-web-browsers/commit/464bde3bb253b35d6adc0a0f31039ec050824d5c))
* **widget:** display vlibras widget version in about screen ([634ec49](https://gitlab.lavid.ufpb.br/vlibras2019/vlibras-web-extensions/vlibras-web-browsers/commit/634ec49eaa58ec872a9939570800a0a3f226cc87))

# [7.4.0](https://gitlab.lavid.ufpb.br/vlibras2019/vlibras-web-extensions/vlibras-web-browsers/compare/v7.3.0...v7.4.0) (2026-08-11)

### Bug Fixes

* **deps:** patch security vulnerabilities ([e925a90](https://gitlab.lavid.ufpb.br/vlibras2019/vlibras-web-extensions/vlibras-web-browsers/commit/e925a90476241b10432e6a46b95b91aa161e7e07))

### Features

* **button:** extend size variants to xl and lg ([0fee340](https://gitlab.lavid.ufpb.br/vlibras2019/vlibras-web-extensions/vlibras-web-browsers/commit/0fee340842f0642e24e91c3d5374e72fdda5daba))
* **dialog:** add comment icon to feedback dialog title ([4b4d473](https://gitlab.lavid.ufpb.br/vlibras2019/vlibras-web-extensions/vlibras-web-browsers/commit/4b4d4733d4e0acd2f2de4cf19994605d916757de))
* update unity build (06-08-26) ([9402b9f](https://gitlab.lavid.ufpb.br/vlibras2019/vlibras-web-extensions/vlibras-web-browsers/commit/9402b9fa0446eea92884d4c6dd8b6aa80adb6d04))
* update unity build (10-08-26) ([1417871](https://gitlab.lavid.ufpb.br/vlibras2019/vlibras-web-extensions/vlibras-web-browsers/commit/1417871b78c6d6eec4e81a07dc0f97af9e60f276))
* **widget/feedback:** add confirmation step for positive feedback ([#110](https://gitlab.lavid.ufpb.br/vlibras2019/vlibras-web-extensions/vlibras-web-browsers/issues/110)) ([60500b6](https://gitlab.lavid.ufpb.br/vlibras2019/vlibras-web-extensions/vlibras-web-browsers/commit/60500b61d8313c497e5bdbac1b224f18691beb07))

# [7.3.0](https://gitlab.lavid.ufpb.br/vlibras2019/vlibras-web-extensions/vlibras-web-browsers/compare/v7.2.0...v7.3.0) (2026-08-04)

### Bug Fixes

* **deps:** upgrade deps to resolve pnpm audit vulnerabilities ([dba993b](https://gitlab.lavid.ufpb.br/vlibras2019/vlibras-web-extensions/vlibras-web-browsers/commit/dba993b14a2c3db6be436c24f8ed5900b208026d))
* **sync:** correct dark theme subtitle shadow color ([9aa94d1](https://gitlab.lavid.ufpb.br/vlibras2019/vlibras-web-extensions/vlibras-web-browsers/commit/9aa94d1245c8e377e889660b9e2bec30189f7e6e))

### Features

* **player-options:** delay avatar toggle and welcome play ([95be209](https://gitlab.lavid.ufpb.br/vlibras2019/vlibras-web-extensions/vlibras-web-browsers/commit/95be209975ca80a7363000d11d6fd605e72b647a))
* **player:** externalize avatar list and add validation ([a03f442](https://gitlab.lavid.ufpb.br/vlibras2019/vlibras-web-extensions/vlibras-web-browsers/commit/a03f4425883188092118bbaf8f3dc0a6f593b110))
* **styles:** add range-slider utility and update opacity field ([84d2d0b](https://gitlab.lavid.ufpb.br/vlibras2019/vlibras-web-extensions/vlibras-web-browsers/commit/84d2d0b86e234e1e0ae1a4b2b41df8b365223a63))
* **ui:** disable tooltip on touch devices ([1143bb1](https://gitlab.lavid.ufpb.br/vlibras2019/vlibras-web-extensions/vlibras-web-browsers/commit/1143bb16ec92bd0b23a698ec38ead0523fbe6cd1))
* **ui:** hide app overlay when guide is open ([0b762bd](https://gitlab.lavid.ufpb.br/vlibras2019/vlibras-web-extensions/vlibras-web-browsers/commit/0b762bde2eab1dccf3794562738d1d7c692d1839))
* **widget:** display "upset" emotion in emotions option ([1fb0cc8](https://gitlab.lavid.ufpb.br/vlibras2019/vlibras-web-extensions/vlibras-web-browsers/commit/1fb0cc828e734fe6da9fe2647964f0d74be7a912))
* **widget:** expose app info in window sync ([22f5feb](https://gitlab.lavid.ufpb.br/vlibras2019/vlibras-web-extensions/vlibras-web-browsers/commit/22f5feb7a2ab1524a099c6d61520be395ef4968c))

# [7.2.0](https://gitlab.lavid.ufpb.br/vlibras2019/vlibras-web-extensions/vlibras-web-browsers/compare/v7.1.0...v7.2.0) (2026-07-31)


### Bug Fixes

* **common/hooks:** handle selector errors in useQuery ([7e2c776](https://gitlab.lavid.ufpb.br/vlibras2019/vlibras-web-extensions/vlibras-web-browsers/commit/7e2c7762543c6f47ee7c3eaa281d4abf981f2dd2))
* **core/dom:** handle detached elements and improve root overlay creation ([0ba739c](https://gitlab.lavid.ufpb.br/vlibras2019/vlibras-web-extensions/vlibras-web-browsers/commit/0ba739c40c1aebabbba27cbcf7b23d342b401153))
* correct aria-label typo in 'ScreenClose' component ([3f3114e](https://gitlab.lavid.ufpb.br/vlibras2019/vlibras-web-extensions/vlibras-web-browsers/commit/3f3114eadd7ce83ba288298bcd4b28d2dec29cb1))
* improve cleanup of timers and debounced callbacks ([f966c83](https://gitlab.lavid.ufpb.br/vlibras2019/vlibras-web-extensions/vlibras-web-browsers/commit/f966c834ab321942a4dffdb9e3e01b4cdb395a69))
* improve resilience of theme hook, loader init, and translator error handling ([b791ae9](https://gitlab.lavid.ufpb.br/vlibras2019/vlibras-web-extensions/vlibras-web-browsers/commit/b791ae977ccd4a52b8ac160d8ffcafa4a5671923))
* **player:** validate iframe message source ([a9193c9](https://gitlab.lavid.ufpb.br/vlibras2019/vlibras-web-extensions/vlibras-web-browsers/commit/a9193c9f1b5217bbf5da9e85c739616682f8d701))
* update imports to use preact hooks and jsx-runtime ([b9cb4d6](https://gitlab.lavid.ufpb.br/vlibras2019/vlibras-web-extensions/vlibras-web-browsers/commit/b9cb4d678f8b268bb5ebf5079b60d3c09dd35577))
* **utils:** replace regex lookbehind in sanitizeUrl for browser compatibility ([6cd7c0e](https://gitlab.lavid.ufpb.br/vlibras2019/vlibras-web-extensions/vlibras-web-browsers/commit/6cd7c0ea7fe98932e170530f465af3153bae24ed))
* **widget:** increase tab visibility playback delay from 500 ms to 1000 ms ([f3accb6](https://gitlab.lavid.ufpb.br/vlibras2019/vlibras-web-extensions/vlibras-web-browsers/commit/f3accb6a18e59328afe1a70e114caaf0d0750783))


### Features

* **build:** add es module format to output and update readme ([51172e1](https://gitlab.lavid.ufpb.br/vlibras2019/vlibras-web-extensions/vlibras-web-browsers/commit/51172e1649157681ab4b6177c1af73d74b863242))
* **consent-banner:** hide banner during playback and adjust layout spacing ([917882e](https://gitlab.lavid.ufpb.br/vlibras2019/vlibras-web-extensions/vlibras-web-browsers/commit/917882ee8546996452d7fd2d23e3e60132771d17))
* **consent:** add user consent flow for analytics tracking ([68cbdde](https://gitlab.lavid.ufpb.br/vlibras2019/vlibras-web-extensions/vlibras-web-browsers/commit/68cbdde4fe68799d9ef92f4ca2500db6e85630ed))
* **core/actions:** add handling for superseded translation requests ([34c9aa1](https://gitlab.lavid.ufpb.br/vlibras2019/vlibras-web-extensions/vlibras-web-browsers/commit/34c9aa1442878af00b275197ad8763e351f60236))
* **core/inert:** implement inert polyfill and integrate into widget ([354f7fd](https://gitlab.lavid.ufpb.br/vlibras2019/vlibras-web-extensions/vlibras-web-browsers/commit/354f7fd6eef453318bec2681e6c1a5aeb65f8d95))
* **data:** add missing states to regionalism ([b6e6184](https://gitlab.lavid.ufpb.br/vlibras2019/vlibras-web-extensions/vlibras-web-browsers/commit/b6e618492b98936a1e3465262df4284611a100ee))
* **font:** refactor default font loading ([ac31128](https://gitlab.lavid.ufpb.br/vlibras2019/vlibras-web-extensions/vlibras-web-browsers/commit/ac31128f9708b8d6311858af55a4dd77e836ebd4))
* **sync:** add player idle teardown and conditional rendering based on mount state ([3b76a56](https://gitlab.lavid.ufpb.br/vlibras2019/vlibras-web-extensions/vlibras-web-browsers/commit/3b76a56c9d9886d889fe6481d8b1d43cdda24ddd))
* **sync:** refactor window synchronization logic ([2e5aeb1](https://gitlab.lavid.ufpb.br/vlibras2019/vlibras-web-extensions/vlibras-web-browsers/commit/2e5aeb191c5336817a358bcf9a90d6463e4978a0))
* update unity build (31-07-26) ([9af5fad](https://gitlab.lavid.ufpb.br/vlibras2019/vlibras-web-extensions/vlibras-web-browsers/commit/9af5fad4694e99da6fdbe0e7c7dcd337d4ad30f7))
* **widget:** add lazy‑loaded dialogs with fallbacks and update loader script ([7102ed0](https://gitlab.lavid.ufpb.br/vlibras2019/vlibras-web-extensions/vlibras-web-browsers/commit/7102ed01defc0acfb3cdaef249e2c3a7e1e2ad25))


### Performance Improvements

* **assets:** externalize base64 icons and images to static files ([8f09d9f](https://gitlab.lavid.ufpb.br/vlibras2019/vlibras-web-extensions/vlibras-web-browsers/commit/8f09d9f52826bbad527cc4f2526c5338347a4027))
* **draggable:** throttle resize and pointermove handling with requestAnimationFrame ([372279c](https://gitlab.lavid.ufpb.br/vlibras2019/vlibras-web-extensions/vlibras-web-browsers/commit/372279c68e159053f0cd53f855a5d78fb38102bb))
* migrate fonts to woff2 format ([c3ebe15](https://gitlab.lavid.ufpb.br/vlibras2019/vlibras-web-extensions/vlibras-web-browsers/commit/c3ebe1534c5917435a4808b3b7246e02e1fd46c3))

# [7.1.0](https://gitlab.lavid.ufpb.br/vlibras2019/vlibras-web-extensions/vlibras-web-browsers/compare/v7.0.0...v7.1.0) (2026-07-30)


### Bug Fixes

* **dialogs/feedback:** remove inert prop from DialogHeader ([b61c500](https://gitlab.lavid.ufpb.br/vlibras2019/vlibras-web-extensions/vlibras-web-browsers/commit/b61c500d66128b108c32acc64922c1f3e60adc25))
* **player:** add error handling for unity instance initialization ([89b5576](https://gitlab.lavid.ufpb.br/vlibras2019/vlibras-web-extensions/vlibras-web-browsers/commit/89b557651a8cef226e9cd028bbd26600c27a9a30))
* **progress-bar:** prevent rendering when max is 0 ([db40f4c](https://gitlab.lavid.ufpb.br/vlibras2019/vlibras-web-extensions/vlibras-web-browsers/commit/db40f4c103c1c2cca38abc313294d2cf0a9224fc))


### Features

* **core|player:** adjust environment mode detection for extension builds ([27df6a4](https://gitlab.lavid.ufpb.br/vlibras2019/vlibras-web-extensions/vlibras-web-browsers/commit/27df6a42100d5e88a01c1f351e7aba049d048815))
* **dictionary:** add callback to reopen dictionary screen after playing definitions ([26af794](https://gitlab.lavid.ufpb.br/vlibras2019/vlibras-web-extensions/vlibras-web-browsers/commit/26af794c2dab536c19330dcfd01cc472df86e1cc))
* exclude 'upset' emotion from options ([01b0d6c](https://gitlab.lavid.ufpb.br/vlibras2019/vlibras-web-extensions/vlibras-web-browsers/commit/01b0d6c433c163f6fcd94da4f7e6b6ce9a30ef13))
* **feedback-dialog:** add loading spinner and pending state handling ([4ab76db](https://gitlab.lavid.ufpb.br/vlibras2019/vlibras-web-extensions/vlibras-web-browsers/commit/4ab76db0df0da0ec46bc194542f9e782acc703ec))
* **text-capture:** improve button element detection ([3c5f649](https://gitlab.lavid.ufpb.br/vlibras2019/vlibras-web-extensions/vlibras-web-browsers/commit/3c5f649d4cace1ea36cc8c592bee46fb07a5ac23))
* update unity build (29-07-26) ([fba8752](https://gitlab.lavid.ufpb.br/vlibras2019/vlibras-web-extensions/vlibras-web-browsers/commit/fba87524b99d1a6129d02bfbecd2cd088da66e0f))

# [7.0.0](https://gitlab.lavid.ufpb.br/vlibras2019/vlibras-web-extensions/vlibras-web-browsers/compare/v7.0.0-alpha.2...v7.0.0) (2026-07-29)


### Bug Fixes

* skip tab visibility sync when player is idle and reduce delay to 500ms ([a3a0e8c](https://gitlab.lavid.ufpb.br/vlibras2019/vlibras-web-extensions/vlibras-web-browsers/commit/a3a0e8c4d1005712f3a264459f674ee05ee09b3c))


### Features

* **emotions:** add new emotions and update icons ([fd0c7d6](https://gitlab.lavid.ufpb.br/vlibras2019/vlibras-web-extensions/vlibras-web-browsers/commit/fd0c7d64ce0d5758cccb51d28293e607dae21233))
* **sync:** pause/play actions based on tab visibility ([1955c9f](https://gitlab.lavid.ufpb.br/vlibras2019/vlibras-web-extensions/vlibras-web-browsers/commit/1955c9f7c1d922d7f2ca931d5e6f0f6285c8c9d6))
* **translator:** add analytics tracking for open and translate events ([74db950](https://gitlab.lavid.ufpb.br/vlibras2019/vlibras-web-extensions/vlibras-web-browsers/commit/74db9500aedb0e4a776cd6c69283a39f6158eb44))
* update unity build (28-07-26) ([df08d3c](https://gitlab.lavid.ufpb.br/vlibras2019/vlibras-web-extensions/vlibras-web-browsers/commit/df08d3cc4d1d794d7260d848e96fcb1fee4ebf41))
* **widget:** add configurable default position (left/right) ([92459e4](https://gitlab.lavid.ufpb.br/vlibras2019/vlibras-web-extensions/vlibras-web-browsers/commit/92459e49bf8eb51ac4d71dcbf9f463f03f12f67b))

# [7.0.0-alpha.2](https://gitlab.lavid.ufpb.br/vlibras2019/vlibras-web-extensions/vlibras-web-browsers/compare/v7.0.0-alpha.1...v7.0.0-alpha.2) (2026-07-27)


### Bug Fixes

* **demo:** remove type="module" from script tag ([dd92900](https://gitlab.lavid.ufpb.br/vlibras2019/vlibras-web-extensions/vlibras-web-browsers/commit/dd92900dc1ff15fd158c13f86800d75c5edc58c2))
* **widget:** disable playback button while sending or input empty ([44cd156](https://gitlab.lavid.ufpb.br/vlibras2019/vlibras-web-extensions/vlibras-web-browsers/commit/44cd1561f6e2c329999ca2f0c6521ed8b3217f0c))


### Features

* update unity build (24-07-26) ([e1879fd](https://gitlab.lavid.ufpb.br/vlibras2019/vlibras-web-extensions/vlibras-web-browsers/commit/e1879fd0fa8c7d6ddde76353cae26a21c8faec70))

# [7.0.0-alpha.0](https://gitlab.lavid.ufpb.br/vlibras2019/vlibras-web-extensions/vlibras-web-browsers/compare/v6.0.0...v7.0.0-alpha.0) (2026-03-22)


### Bug Fixes

* close emotions tooltip when clicking outside ([aa4e5e8](https://gitlab.lavid.ufpb.br/vlibras2019/vlibras-web-extensions/vlibras-web-browsers/commit/aa4e5e8dd34ef2da9cc58e2c94c3f0b735215507))
* **controls:** update available speeds ([f6c05e9](https://gitlab.lavid.ufpb.br/vlibras2019/vlibras-web-extensions/vlibras-web-browsers/commit/f6c05e96e1c26ef41488df8cc7c1a774749f017b))
* **types:** correct avatar name from 'hozana' to 'hosana' ([7b5145b](https://gitlab.lavid.ufpb.br/vlibras2019/vlibras-web-extensions/vlibras-web-browsers/commit/7b5145b6c1b6f6a001367f48aee5c88adb2ba152))
* update api endpoints for dictionary and signs ([8715783](https://gitlab.lavid.ufpb.br/vlibras2019/vlibras-web-extensions/vlibras-web-browsers/commit/87157833044c88f617135ec712893954baf52e8b))
* **utils:** prevent 'sanitizeUrl' from collapsing protocol slashes ([3cb6dcc](https://gitlab.lavid.ufpb.br/vlibras2019/vlibras-web-extensions/vlibras-web-browsers/commit/3cb6dcc0d68346871012082f87295c1296eda8ac))


### Features

* add dev scripts, config, trie and actions ([a64f840](https://gitlab.lavid.ufpb.br/vlibras2019/vlibras-web-extensions/vlibras-web-browsers/commit/a64f84050ee7d2ed16cf449de43855c128a79e81))
* **aux-controls:** update help icon to guide icon ([132359d](https://gitlab.lavid.ufpb.br/vlibras2019/vlibras-web-extensions/vlibras-web-browsers/commit/132359dcd2f6e79744784b09e0e1fe33e9d992cf))
* **build:** add dev build command and rename vw_path variable ([1feafd6](https://gitlab.lavid.ufpb.br/vlibras2019/vlibras-web-extensions/vlibras-web-browsers/commit/1feafd6a55a372457f6d9a2880f0172e10f0f204))
* **change-avatar:** close on click outside ([fb64d98](https://gitlab.lavid.ufpb.br/vlibras2019/vlibras-web-extensions/vlibras-web-browsers/commit/fb64d98ae0f10c4d22b0b0b34204dbafde3c35f0))
* **Dictionary:** improve styling and error handling ([98dec01](https://gitlab.lavid.ufpb.br/vlibras2019/vlibras-web-extensions/vlibras-web-browsers/commit/98dec01cfd5c5d926012c7f596848f51a390ea1a))
* **emotions:** add doubt emotion ([b557a27](https://gitlab.lavid.ufpb.br/vlibras2019/vlibras-web-extensions/vlibras-web-browsers/commit/b557a27cd1a75a07bdf74408a0584a6f22f5d3eb))
* **guide:** minor updates ([82e04d9](https://gitlab.lavid.ufpb.br/vlibras2019/vlibras-web-extensions/vlibras-web-browsers/commit/82e04d9e49bc31748495afa2d72fdcea5cfb7bf1))
* **guide:** update text and gloss for more options ([ea8b3d8](https://gitlab.lavid.ufpb.br/vlibras2019/vlibras-web-extensions/vlibras-web-browsers/commit/ea8b3d8a1e730dea15b19cc8889b0fcf41e550ce))
* **header:** update dictionary icon ([9dbe1b5](https://gitlab.lavid.ufpb.br/vlibras2019/vlibras-web-extensions/vlibras-web-browsers/commit/9dbe1b5c1e5cd0b4c6a6b32027996c17bc11c486))
* **icons:** add move & subtitle-off icons ([c5a915c](https://gitlab.lavid.ufpb.br/vlibras2019/vlibras-web-extensions/vlibras-web-browsers/commit/c5a915c0e0c11affd52e99edac0541541ecbf569))
* implement avatar emotions ([0891e1e](https://gitlab.lavid.ufpb.br/vlibras2019/vlibras-web-extensions/vlibras-web-browsers/commit/0891e1e6972e0d8a8bb608002241da2ebf606659))
* **more-options:** add modal with more options and rename 'AdditionalOptions' to 'AuxiliaryOptions' ([42dfdbb](https://gitlab.lavid.ufpb.br/vlibras2019/vlibras-web-extensions/vlibras-web-browsers/commit/42dfdbb25dcdee4d6e3527e34a639ffecad3f169))
* **player:** add config support and welcome animation handling ([d41c743](https://gitlab.lavid.ufpb.br/vlibras2019/vlibras-web-extensions/vlibras-web-browsers/commit/d41c743a823055d135318fb507c153cd5a2e79d9))
* **player:** add subtitles toggle and improve player controls ([ee7b8a9](https://gitlab.lavid.ufpb.br/vlibras2019/vlibras-web-extensions/vlibras-web-browsers/commit/ee7b8a92a6ce922ff37d2a922d4fd516c18fb5bd))
* **player:** sanitize iframe url to prevent double slashes ([34b59f7](https://gitlab.lavid.ufpb.br/vlibras2019/vlibras-web-extensions/vlibras-web-browsers/commit/34b59f7d437b004c8bb48c0ccd5057d5a26e4177))
* **ui/button:** add gov variants and adjust ghost/muted styles ([b3106e6](https://gitlab.lavid.ufpb.br/vlibras2019/vlibras-web-extensions/vlibras-web-browsers/commit/b3106e661daaabc5e462f977d6c2ba3cf6a71868))
* **v7:** initial commit ([5e7f038](https://gitlab.lavid.ufpb.br/vlibras2019/vlibras-web-extensions/vlibras-web-browsers/commit/5e7f038626cee18f68f17a70d992aa523664221c))
* **widget:** add draggable widget grabber ([e77cee5](https://gitlab.lavid.ufpb.br/vlibras2019/vlibras-web-extensions/vlibras-web-browsers/commit/e77cee5a346107cba41ab429f20e3839f12f2a7c))
* **widget:** add draggable widget with enhanced loading screen ([40b9d52](https://gitlab.lavid.ufpb.br/vlibras2019/vlibras-web-extensions/vlibras-web-browsers/commit/40b9d52b5002318cd8666470f35cdf62cdf7d33b))
* **widget:** add manager provider ([2968b78](https://gitlab.lavid.ufpb.br/vlibras2019/vlibras-web-extensions/vlibras-web-browsers/commit/2968b782cd6d1e3142c27c2c67c11b3ebff1ccde))
* **widget:** add send review feature with error handling ([46cb18b](https://gitlab.lavid.ufpb.br/vlibras2019/vlibras-web-extensions/vlibras-web-browsers/commit/46cb18b0d36854fdd436e4c68898006505acce4b))
* **widget:** add temporary width animation for access button ([91d1c9c](https://gitlab.lavid.ufpb.br/vlibras2019/vlibras-web-extensions/vlibras-web-browsers/commit/91d1c9cdc2ef396df6af55f758abeaa16b675fdc))
* **widget:** implement dynamic positioning and text capture ([09c6734](https://gitlab.lavid.ufpb.br/vlibras2019/vlibras-web-extensions/vlibras-web-browsers/commit/09c6734076c23191673be64e830fdc533cb1e05e))
* **widget:** implement text capture tooltip and restructure providers ([807a53f](https://gitlab.lavid.ufpb.br/vlibras2019/vlibras-web-extensions/vlibras-web-browsers/commit/807a53f756ced595c155ac180ff006b774e8eab0))
* **widget:** restructure providers and add settings screen (wip) ([51e6a84](https://gitlab.lavid.ufpb.br/vlibras2019/vlibras-web-extensions/vlibras-web-browsers/commit/51e6a848d7694624727ee8176c67371601171665))
