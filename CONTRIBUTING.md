Contributing to OpenMoji
========================

Interested in contributing? Yay! Here are a few infos how the workflow typically works:

* **Contribute an Emoji via Email and Sending .svg Files**
* **Contribute an Emoji via Github and Pull Requests (Preferred)**
* **Hexcodes extras-openmoji**
* **Fix a Bug**
* **How to Submit a Pull Request**
* **Developer Setup**
* **How to Run the Tests**


## 💌 Contribute an Emoji via Email and Sending .svg Files
Simply send us the source .svg file and the meta informations via email e.g.:

```csv
emoji,hexcode,openmoji_tags,openmoji_author
ℹ️,2139,"advice,info",Jose Avila
```

You can find the email address at [openmoji.org/about](http://openmoji.org/about/#contact). Thanks 🙏!


## 🚀 Contribute an Emoji via Github and Pull Requests (preferred)
If you have an original idea about a new emoji or you spot one which is missing according to the Unicode definition, open an [issue](https://github.com/hfg-gmuend/openmoji/issues) describing your emoji, and let us know you are interested! Initiate a discussion, wait for the green light, and then assign it to yourself!


### 1. Meta Infos
Before you start working on a source .svg file you should find and name .svg file with the corresponding hexcode. Either the emoji is already defined in Unicode or you have to propose a hexcode which is in the private use area (see below in Hexcodes extras-openmoji).

Add your meta infos at the very end of one of the files below:
* `data/enhancements-emoji-unicode-data.csv` if your emoji is already part of an Emoji Unicode standard e.g. [Emoji v12](https://unicode.org/Public/emoji/12.0/emoji-test.txt).
* `data/extras-openmoji.csv` if your emoji is currently not part of Unicode.
* `data/extras-unicode.csv` if your emoji is not part of an Emoji Unicode standard, but you could "recycle" an exiting Unicode for it e.g. ⬌ (25A1)

N.B. the properties prefixed `openmoji_` are not part of the Unicode specification.

Run `node helpers/generate-data-tables.js` to generate from the .csv files above the deduced OpenMoji data tables. This is important as the automated unit test and other mechanisms rely on the central data file `data/openmoji.json`


### 2. Design Your Emoji
🙏 Please follow the [OpenMoji Styleguide](http://openmoji.org/styleguide)

✅ Use the [OpenMoji Tester App](https://openmoji-tester.glitch.me/) to check whether your emoji passes our automated tests. All of your svg files have to produce green tests only. Fix your files until everything is green! Please! :)


### 3. File Conventions
In order to merge you emoji as seamless as possible into the OpenMoji collection, please bear the following file conventions in mind:

* src/{group}/{subgroups}/{hexcode}.svg

e.g. 🐌

* src/animals-nature/animal-bug/1F40C.svg


### 4. Normalize SVG Formatting
Before you go on to submit we aks you should to normalize the formatting of the source code of your svg file(s). We want to be agnostic in terms of the editor used to produce the emojis. Every svg editor e.g. Adobe Illustrator, Sketch App, Figma etc. produce slightly different formated svg files on export. But we want to have a consistent svg source code style, hence please run the command below to normalize all your files or an individual file.

Normalize all files in src folder:

```bash
npm run pretty-src-svg
```

Normalize an individual file e.g.:

```bash
node_modules/.bin/svgo src/activities/arts-crafts/1F3A8.svg --config helpers/beautify-svg.yml
```


### 5. Submission
Yay! Now all your files are ready to go! Please submit a PR against the master branch. Please submit only the files in `src` folder, and do not generate the files in `color` and `black` folders. We will take care of your OpenMoji from there! Thanks 🙏!

## Non-standard emoji

There are two options for adding extra emoji. If the symbol exists as a unicode code point already - like math symbols, heiroglyphics - you can design and add it to [src/extras-unicode](src/extras-unicode). If the symbol does not exist, it can be added instead as an OpenMoji symbol in [src/extras-openmoji](src/extras-openmoji).

### Hexcodes for extras-unicode

Please create a folder under [src/extras-unicode](src/extras-unicode) with the "sub-group" name. Name the svg as the unicode codepoint in this folder.

### Hexcodes for extras-openmoji

Emojis that are not (yet) defined in Unicode are located in the [Private Use Area](https://en.wikipedia.org/wiki/Private_Use_Areas). The Hexcode runs from `E000` to `F8FF`. The total number of code points is 6.400.

For the OpenMoji project we divided the private use are into 100 equal sized blocks of 64 code points:


| subcategory | block start | block end |
| --- | --- | --- |
| animals-nature | E000 | E040 |
| brand | E040 | E080 |
| emergency | E080 | E0C0 |
| … | … | … |

If a subgroup needs more than 64 code points, then the subgroup continues in the next free block. An overview gives this [Google Doc](https://docs.google.com/spreadsheets/d/1xq4uJshm3eHi8BfqMlvWdXfansNugto1XJjPFbBCnV4/edit?usp=sharing). The names of subgroups (in extras-openmoji) are a close as possible aligned with already defined [Unicode Emoji](https://unicode.org/Public/emoji/12.0/emoji-test.txt) ones.

### Other files 

Next add the information about the new character to [data/extras-openmoji.csv](data/extras-openmoji.csv). Finally run `node helpers/generate-data-tables.js` and then create a Pull Request.

## 🐞Fix a Bug
If it's not on the issues list, add it. If it's already on the [issues](https://github.com/hfg-gmuend/openmoji/issues) list, assign it to yourself or comment on the issue indicating you're working on it. Go ahead and fix it and submit a PR.


## How to Submit a Pull Request
[Fork](https://help.github.com/articles/fork-a-repo/) the OpenMoji repository and create a ["PR" pull request](https://help.github.com/articles/creating-a-pull-request-from-a-fork/) from your fork. 


## Developer Setup
1. Install [node.js](https://nodejs.org) (see version in the file [`.nvmrc`](https://github.com/hfg-gmuend/openmoji/blob/master/.nvmrc#L1))
2. Open Terminal and navigate over to the `openmoji` folder that you downloaded onto your computer:

```
cd path/to/folder
```

3. Run:

```
npm install
```

## How to Run the Tests

The folder `test/` contains automated unit tests to ensure consistency across all source .svg and production files. You can run all tests with:

```bash
npm test
```
Or run individual test e.g. all "xxx layer existing" tests:

```bash
node_modules/.bin/mocha --grep "layer existing" --reporter mochawesome --reporter-options reportDir=test/report,reportFilename=report,json=false,code=false,cdn=true,reportTitle=OpenMoji-Tester,reportPageTitle=OpenMoji-Tester test/*.js --openmoji-data-json $PWD/data/openmoji.json --openmoji-src-folder $PWD/src
```

