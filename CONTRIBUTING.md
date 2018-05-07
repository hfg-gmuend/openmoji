Contributing to OpenMoji
========================

Interested in contributing? Yay! Here are a few infos how the workflow typically works:

* **Contribute an Emoji via Email and Sending .ai Files**
* **Contribute an Emoji via Github and Pull Requests (Preferred)**
* **Fix a Bug**
* **How to Submit a Pull Request**
* **Overview OpenMoji Repository**

## 💌 Contribute an Emoji via Email and Sending .ai Files

Simply send us the source .ai files and the meta informations via email.

```csv
emoji,hexcode,group,subgroups,annotation,tags,hfg_tags,hfg_author
ℹ️,2139,symbols,alphanum,information,i,"advice,info",Jose Avila
```

You can find the email address at [openmoji.org/about](http://openmoji.org/about.html#contact). Thanks 🙏!

## 🚀 Contribute an Emoji via Github and Pull Requests (preferred)

If you have an original idea about a new emoji or you spot one which is missing according to the Unicode definition, open an [issue](https://github.com/hfg-gmuend/openmoji/issues) describing your emoji, and let us know you are interested! Initiate a discussion, wait for the green light, and then assign it to yourself!

### 1. Meta Infos
Before you start working on the .ai files you should have filled out the meta informations, as all file names are deduced from the hexcode of the emoji.

If the emoji is defined in Unicode, the corresponding meta informations look like this:

```csv
emoji,hexcode,group,subgroups,annotation,tags,hfg_tags,hfg_author
ℹ️,2139,symbols,alphanum,information,i,"advice,info",Jose Avila
```

N.B. the properties hfg_tags and hfg_author are not part of the Unicode specification.

`hfg_tags`: optionally, extend the description with custom tags. 

`hfg_author`: state who designed it in First Lastname.

If you are designing a new emoji which is not defined in Unicode, you will have to pick an empty hexcode from the private use area. We have generated a few empty ones at the end of `data/openmoji.csv`, please use the first available one. Try also to find for the remaining fields useful values.


### 2. File Conventions

In order to merge you emoji as seamless as possible into the OpenMoji collection, please bear the following file conventions in mind:

* src/{group}/{subgroups}/{hexcode}.ai
* black/72x72/{hexcode}.png
* black/618x618/{hexcode}.png
* black/svg/{hexcode}.svg
* black/72x72/{hexcode}.png
* black/618x618/{hexcode}.png
* black/svg/{hexcode}.svg

e.g. 🐌

* src/animals-nature/animal-bug/1F40C.ai
* black/72x72/1F40C.png
* black/618x618/1F40C.png
* black/svg/1F40C.svg
* black/72x72/1F40C.png
* black/618x618/1F40C.png
* black/svg/1F40C.svg

You can generate the .png and .svg files with [`ai-export-src-file.jsx`](https://github.com/hfg-gmuend/openmoji/blob/master/helpers/illustrator/ai-export-src/ai-export-src-file.jsx). The script runs directly inside Adobe Illustator. [Instructions](https://github.com/hfg-gmuend/openmoji/blob/master/helpers/illustrator) on how to run and setup it are available in the same folder too.


### 3. Submission

We kindly ask you to submit per PR just a single emoji (in black and color).

There might be exceptions with emoijs which belong together, think of families like hand gesture, arrows etc. When your are planning to submit more than a singe emoji in a PR, please contact us first.

Yay! Now all your files are ready to go! Please submit a PR against the master branch. Thanks 🙏!


## 🐞Fix a Bug

If it's not on the issues list, add it. If it's already on the [issues](https://github.com/hfg-gmuend/openmoji/issues) list, assign it to yourself or comment on the issue indicating you're working on it. Go ahead and fix it and submit a PR.


## How to Submit a Pull Request

If you have not done it yet, please [fork](https://help.github.com/articles/fork-a-repo/) the OpenMoji respository.

How to create a ["PR" pull request](https://help.github.com/articles/creating-a-pull-request-from-a-fork/) from your fork. 


## Overview OpenMoji Repository

`black/` and `color/` Contains all exported .png and .svg files. The .ai files are broken up into folders 

`data/` Contains a central .csv table with all the meta informations for each emoji.

`font/` Contains the exported .otf OpenMoji fonts

`guidelines/` Contains various template files related to the guidelines.

`helpers/` Contains various helper scripts e.g. to export .ai files to .png and .svg images.

`src/` Contains all the source .ai files of OpenMoji. The .ai files are broken up into folders and files corresponding with the Unicode groups and sub-groups.