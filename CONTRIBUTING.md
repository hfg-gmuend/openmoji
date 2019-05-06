Contributing to OpenMoji
========================

Interested in contributing? Yay! Here are a few infos how the workflow typically works:

* **Contribute an Emoji via Email and Sending .svg Files**
* **Contribute an Emoji via Github and Pull Requests (Preferred)**
* **Fix a Bug**
* **How to Submit a Pull Request**
* **Developer Setup**


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
Before you start working on a source .svg file you should find and name .svg file with the corresponding hexcode. Either the emoji is already defined in Unicode or you have to propose a hexcode which is in the private use area.

Add your meta infos at the very end of one of the files below:
* `data/enhancements-emoji-unicode-data.csv` if your emoji is already part of an Emoji Unicode standard e.g. [Emoji v12](https://unicode.org/Public/emoji/12.0/emoji-test.txt).
* `data/extras-openmoji.csv` if your emoji is currently not part of Unicode.
* `data/extras-unicode.csv` if your emoji is not part of an Emoji Unicode standard, but you could "recycle" an exiting Unicode for it e.g. ⬌ (25A1)

N.B. the properties prefixed `openmoji_` are not part of the Unicode specification.

Run `node helpers/generate-data-tables.js` to generate from the .csv files above the deduced OpenMoji data tables. This is important as the automated unit test and other mechanisms rely on the central data file `data/openmoji.json`


### 2. Design Your Emoji
🙏 Please follow the [OpenMoji Styleguide](http://openmoji.org/styleguide)

✅ Run `npm test` to check whether your emoji passes our automated tests.


### 3. File Conventions

In order to merge you emoji as seamless as possible into the OpenMoji collection, please bear the following file conventions in mind:

* src/{group}/{subgroups}/{hexcode}.svg

e.g. 🐌

* src/animals-nature/animal-bug/1F40C.svg


### 4. Submission

Yay! Now all your files are ready to go! Please submit a PR against the master branch. Thanks 🙏!


## 🐞Fix a Bug

If it's not on the issues list, add it. If it's already on the [issues](https://github.com/hfg-gmuend/openmoji/issues) list, assign it to yourself or comment on the issue indicating you're working on it. Go ahead and fix it and submit a PR.


## How to Submit a Pull Request

[Fork](https://help.github.com/articles/fork-a-repo/) the OpenMoji respository and create a ["PR" pull request](https://help.github.com/articles/creating-a-pull-request-from-a-fork/) from your fork. 


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