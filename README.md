OpenMoji
========

<img width="1157" alt="openmoji-github-keyvisual" src="https://user-images.githubusercontent.com/480224/124712580-c8b0f880-deff-11eb-8516-3def8df2a42e.png">

Open-source emojis for designers, developers and everyone else! OpenMoji is an open-source project of the HfG Schwäbisch Gmünd by Benedikt Groß, Daniel Utz, 70+ students and external contributors.

👉 [OpenMoji.org/](http://openmoji.org/)

Interact, create, save, and share your work! 🌈`#openmoji`

This GitHub repository contains all of the source files and exported png/svg files of the OpenMoji project.

⚠️ Please note that the master branch is in active development, so if you're looking for stable production version please use one of the releases.

🛠 You can check the latest work in progress developments via the [OpenMoji Dev Catalog](https://hfg-gmuend.github.io/openmoji/) which lists all OpenMojis of the master branch.


## Table of Contents

- [Styleguide](http://openmoji.org/styleguide) Our beloved styleguide.
- [FAQ](FAQ.md) Check if your question has already been answered
- [Contributing](CONTRIBUTING.md) Pull Requests are welcome!
- [Developer Setup](CONTRIBUTING.md#-Developer-Setup) How to setup a environment.
- [API](API.md) documentation for the npm OpenMoji package.
- [Font](font) infos on the OpenMoji-Color and OpenMoji-Black fonts.
- [Team](http://openmoji.org/about/#team) list of all authors and contributors.
- [Acknowledgements](http://openmoji.org/about/#acknowledgement) Thanks!
- [Code of Conduct](CODE_OF_CONDUCT.md) and OpenMoji Community Statement.


## Downloads & Distribution Channels
You can download, use and "consume" OpenMoji in various ways:

- [SVG](https://github.com/hfg-gmuend/openmoji/releases/latest): Color & Black (production ready)
- [Fonts](https://github.com/hfg-gmuend/openmoji/releases/latest): Color & Black (experimental)
- [PNG 618x618](https://github.com/hfg-gmuend/openmoji/releases/latest): Color & Black (production ready)
- [PNG 72x72](https://github.com/hfg-gmuend/openmoji/releases/latest): Color & Black (production ready)
- [OpenMoji app](https://itunes.apple.com/us/app/openmoji/id1462636288): for iOS with emoji picker
- [OpenMoji Stickers](https://itunes.apple.com/us/app/openmoji/id1462636288): for iOS Messages app
- [OpenMoji Github](https://github.com/hfg-gmuend/openmoji/): `git clone --depth 1 https://github.com/hfg-gmuend/openmoji.git` The OpenMoji repo is big! It is recommended to clone it without the entire history, note the --depth flag.
- [OpenMoji NPM Package](https://www.npmjs.com/package/openmoji): `npm install openmoji`. You can also get individual files via [UNPKG](https://unpkg.com/) directly e.g.: unpkg.com/openmoji@12.1.0/color/svg/1F64B.svg
- CDN (will always fetch latest version - to pin to a version, see documentation [here](https://www.jsdelivr.com/features#gh)): cdn.jsdelivr.net/gh/hfg-gmuend/openmoji/color/svg/1F63A.svg

**Community Extensions**

- [OpenMoji Jekyll Plugin](https://github.com/azadeh-afzar/OpenMoji-Jekyll-Plugin): `gem install jekyll-openmoji`
- [OpenMoji Spritemap Generator](https://github.com/axelpale/openmoji-spritemap-generator): OpenMoji combined to handy sprite images
- [OpenMoji in Fedora](https://apps.fedoraproject.org/packages/hfg-gmuend-openmoji-fonts): For Fedora 33 and newer, `sudo yum install hfg-gmuend-openmoji-fonts-all`
- [OpenMoji in JavaFX](https://github.com/pavlobu/emoji-text-flow-javafx): A cross-platform JavaFX library allowing you to replace all standard emoji in extended TextFlow (EmojiTextFlow) with OpenMoji.
- [OpenMoji Awesome CSS Classes](https://github.com/gromain/openmoji-awesome): "Font Awesome" flavored CSS classes eg.  `<i class="oma oma-face-with-monocle"></i>` ready to use for websites.  
- [OpenMoji Sticker Sets](https://github.com/MEibenst/openmoji-sticker-sets): Stickers for Telegram and WhatsApp.
- [OpenMoji Flutter](https://pub.dev/packages/flutter_openmoji): OpenMoji usable as Icon for the FLutter framework.


## Attribution Requirements
As an open source project, attribution is critical from a legal, practical and motivational perspective. Please give us credits! Common places for attribution are for example: to mention us in your project README, the 'About' section or the footer on a website/in mobile apps.

Attribution suggestion:

> All emojis designed by [OpenMoji](https://openmoji.org/) – the open-source emoji and icon project. License: [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/#)


## Anatomy of the OpenMoji Repository

`black/` and `color/` Contains all exported .png and .svg files ¹

`data/` Contains the central openmoji.json with all meta informations for each emoji ¹

`font/` Contains the exported OpenMoji fonts ¹

`guidelines/` Contains various template files related to the styleguide ¹

`helpers/` Contains various helper scripts e.g. to export to .png and .svg, generate skintones variants, enforce the OpenMoji color palette etc. ²

`src/` Contains all source .svg files of OpenMoji. The files are broken up into folders and files corresponding with the Unicode groups and sub-groups ¹

`test/` Automated unit tests to ensure consistency across all source .svg files ²


## License
¹ OpenMoji graphics are licensed under the Creative Commons Share Alike License 4.0 ([CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/))

[![License: CC BY-SA 4.0](https://img.shields.io/badge/License-CC%20BY--SA%204.0-lightgrey.svg)](https://creativecommons.org/licenses/by-sa/4.0/)

² Code licensed under the GNU Lesser General Public License v3 ([LGPL-3.0](https://www.gnu.org/licenses/lgpl-3.0.en.html))

[![License: LGPL-3.0](https://img.shields.io/badge/License-LGPL%20v3-lightgrey.svg)](https://www.gnu.org/licenses/lgpl-3.0.en.html)
