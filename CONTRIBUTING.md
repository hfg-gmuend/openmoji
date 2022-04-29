Contributing to OpenMoji
========================

Interested in contributing? Yay! Here are a few infos how the workflow typically works:

* [💌 Contribute an Emoji via Email and Sending .svg Files](#-Contribute-an-Emoji-via-Email-and-Sending-svg-Files)
* [🚀 Contribute an Emoji via Github and Pull Requests (Preferred)](#-Contribute-an-Emoji-via-Github-and-Pull-Requests-preferred)
    * [File Name And Folder](#1-File-Name-And-Folder)
    * [Design Your Emoji](#2-design-your-emoji)
    * [Normalize SVG Formatting](#3-Normalize-SVG-Formatting)
    * [Test Your Design](#4-test-your-design)
    * [Information About The Emoji](#5-Information-About-The-Emoji)
    * [Submission](#6-Submission)
        * [How to Submit a Pull Request](#How-to-Submit-a-Pull-Request)
* [:octocat: Non-standard emoji](#octocat-non-standard-emoji)
    * [Hexcodes for extras-unicode](#Hexcodes-for-extras-unicode)
    * [Hexcodes for extras-openmoji](#Hexcodes-for-extras-openmoji)
    * [Other files](#Other-files)
* [🐞 Fix a Bug](#-Fix-a-Bug)

* [👩‍💻👨‍💻 Developer Setup](#-Developer-Setup)
* [⁉️ How to Run the Tests](#️-How-to-Run-the-Tests)

## 💌 Contribute an Emoji via Email and Sending .svg Files
Simply send us the source .svg file and the meta informations via email e.g.:

```csv
emoji,hexcode,openmoji_tags,openmoji_author
ℹ️,2139,"advice, info",Jose Avila
```

You can find the email address at [openmoji.org/about](http://openmoji.org/about/#contact). Thanks 🙏!


## 🚀 Contribute an Emoji via Github and Pull Requests (preferred)
If you have an original idea about a new emoji or you spot one which is currently missing in Unicode, open an [issue](https://github.com/hfg-gmuend/openmoji/issues) describing your emoji, like [#84](https://github.com/hfg-gmuend/openmoji/issues/84), and let us know you are interested! Initiate a discussion, wait for the green light, and then assign it to yourself!

If steps 3 onwards sound daunting to you, don't worry! You can simply create an issue and attach your SVG files in a .ZIP, see [#138](https://github.com/hfg-gmuend/openmoji/issues/138) for this process

### 1. File Name And Folder
Before you start working on an .svg design, you should find and name it with the corresponding hexcode. You can find this by searching for the character online and it should look something like 1F389 (🎉) or 1F3C3-200D-2642-FE0F (🏃‍♂️). If it is not currently an emoji, see the steps in [Non-standard emoji](#octocat-non-standard-emoji)

In order to merge you emoji as seamless as possible into the OpenMoji collection, please place the design in the directory like so:

* src/{group}/{subgroups}/{hexcode}.svg

e.g. 🐌

* src/animals-nature/animal-bug/1F40C.svg

### 2. Design Your Emoji

🙏 Please follow the [OpenMoji Styleguide](http://openmoji.org/styleguide)


### 3. Normalize SVG Formatting

Before you submit we ask you to normalize the formatting of the source code of your svg file(s). We want to be agnostic in terms of the editor used to produce the emojis. Every svg editor e.g. Adobe Illustrator, Sketch App, Inkscape etc. produce slightly different formated svg files on export. More information about how to export files can be found in our styleguide. As we want to have a consistent svg source code style, hence please run the command below to normalize all your files or an individual file.

Normalize all files in src folder (⚠ this might take some time):

```bash
npm run pretty-src-svg
```

Normalize an individual file e.g.:

```bash
node_modules/.bin/svgo src/activities/arts-crafts/1F3A8.svg --config helpers/beautify-svg.yml
```

### 4. Test Your Design

To ensure that all of our designs are consistent, please use the [OpenMoji Tester App](https://openmoji-tester.glitch.me/) to check whether your emoji passes our automated tests. All of your svg files have to produce green tests only ✅, fix your files until everything is green! Please! :)

### 5. Information About The Emoji

Add your meta infos at the very end to exacltly one of the following files:

-  `data/enhancements-emoji-unicode-data.csv` if you have designed a standard Emoji which is part of Unicode
-  `data/extras-openmoji.csv` if you have designed a non-standard Emoji which is not part of Unicode and should go into Private Use Area, see → [:octocat: Non-standard emoji](#octocat-non-standard-emoji)
-  `data/extras-unicode.csv` if you have designed a standard Unicode charakter but which is also not part of the Unicode Emoji standard, see → [:octocat: Non-standard emoji](#octocat-non-standard-emoji)

N.B. the properties prefixed `openmoji_` are not part of the Unicode specification.

Run `npm run generate-data-tables` to generate from the .csv files above the deduced OpenMoji data tables. This is important as the automated unit test and other mechanisms rely on the central data file `data/openmoji.json`

### 6. Submission

Yay! Now all your files are ready to go! Please submit a PR against the master branch. Please submit only the files in `src` folder, and do not generate the files in `color` and `black` folders. We will take care of your OpenMoji from there! Thanks 🙏!

#### How to Submit a Pull Request

[Fork](https://help.github.com/articles/fork-a-repo/) the OpenMoji repository and create a ["PR" pull request](https://help.github.com/articles/creating-a-pull-request-from-a-fork/) from your fork. (Here is also a [friendly video tutorial on "PR" pull requests](https://www.youtube.com/watch?v=_NrSWLQsDL4) by Daniel Shifmann / The Coding Train)

## :octocat: Non-standard emoji

There are two options for adding extra emoji. If the symbol exists as a Unicode code point already - like math symbols, heiroglyphics - you can design and add it to [src/extras-unicode](src/extras-unicode). If the symbol does not exist, it can be added instead as an OpenMoji symbol in [src/extras-openmoji](src/extras-openmoji). 

In either case, please check that the emoji follows our [Contribution Guidelines for Non-Unicode](CODE_OF_CONDUCT.md#Contribution-Guidelines-for-Non-Unicode-Emojis).

### Hexcodes for extras-unicode

As an example, many of the designs in the [Miscellaneous Symbols](https://jrgraphix.net/r/Unicode/2600-26FF) section are perfect for emojis. Please create a folder under [src/extras-unicode](src/extras-unicode) with the "sub-group" name. Name the svg as the unicode codepoint in this folder, e.g. ⬌ (25A1), and add the information about the file to `data/extras-unicode.csv`

### Hexcodes for extras-openmoji

Emojis that are not (yet) defined in Unicode are located in the [Private Use Area](https://en.wikipedia.org/wiki/Private_Use_Areas). The Hexcode runs from `E000` to `F8FF`. The total number of code points is 6.400.

For the OpenMoji project we divided the private use are into 100 equal sized blocks of 64 code points:


| subcategory    | block start | block end |
|----------------|-------------|-----------|
| animals-nature | E000        | E040      |
| brand          | E040        | E080      |
| emergency      | E080        | E0C0      |
| …              | …           | …         |

If a subgroup needs more than 64 code points, then the subgroup continues in the next free block. An overview gives this [Google Doc](https://docs.google.com/spreadsheets/d/1xq4uJshm3eHi8BfqMlvWdXfansNugto1XJjPFbBCnV4/edit?usp=sharing). The names of subgroups (in extras-openmoji) are a close as possible aligned with already defined [Unicode Emoji](https://unicode.org/Public/emoji/12.0/emoji-test.txt) ones.

### Other files

Next add the information about the new character to [data/extras-openmoji.csv](data/extras-openmoji.csv). Finally run `npm run generate-data-tables` and then create a Pull Request.

## 🐞 Fix a Bug
If it's not on the issues list, add it. If it's already on the [issues](https://github.com/hfg-gmuend/openmoji/issues) list, assign it to yourself or comment on the issue indicating you're working on it. Go ahead and fix it and submit a PR.

## 👩‍💻👨‍💻 Developer Setup

### Node.js

1. Install [node.js](https://nodejs.org) (see version in the file [`.nvmrc`](https://github.com/hfg-gmuend/openmoji/blob/master/.nvmrc#L1))
2. Open Terminal and navigate over to the `openmoji` folder that you downloaded onto your computer:

```bash
cd path/to/folder
```

3. Run:

```bash
npm install
```

### bash scripts

If you want to run the bash scripts  (.sh files) in the `helpers` folder e.g. for exporting png files, you will have to [install additional dependencies](https://github.com/hfg-gmuend/openmoji/tree/master/helpers#additional-dependencies).

## ⁉️ How to Run the Tests

The folder `test/` contains automated unit tests to ensure consistency across all source .svg and production files. You can run all tests with:

- `npm test` all tests including checking production files
- `npm run test-dev` all tests excluding checking production files

Or run individual test e.g. all "xxx layer existing" tests:

```bash
node_modules/.bin/mocha --grep "layer existing" test/*.js --openmoji-data-json $PWD/data/openmoji.json --openmoji-src-folder $PWD/src
```
