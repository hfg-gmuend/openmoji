OpenMoji FAQ
============

## Licensing and attribution
<details>
<summary>
	🤔: What's the license of OpenMoji for app / website / book / ad / video ... projects?
</summary>

Thank you for wanting to use OpenMoji in your project! OpenMoji is published under the Creative Commons Share Alike License 4.0 ([CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/#)). This means you are free to:

- **Share** — copy and redistribute OpenMoji in any medium or format
- **Adapt** — remix, transform, and build upon OpenMoji
- **for any purpose, even commercially.**

Under the following terms:

- **Attribution** — You must give OpenMoji [appropriate credit](https://github.com/hfg-gmuend/openmoji#attribution-requirements), and indicate if changes were made (e.g. like we do in our [changelog](changelog.txt)). You may do so in any reasonable manner, but not in any way that suggests the OpenMoji Project endorses you or your use.
- **ShareAlike** — If you remix, transform, or build upon the material, you must distribute your contributions under the same license [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/#) as OpenMoji.

(Bullet points are based on the official license text of [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/#))
</details>

<details>
<summary>
🤔: What is the suggested attribution for OpenMoji?
</summary>

> All emojis designed by [OpenMoji](https://openmoji.org/) – the open-source emoji and icon project. License: [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/#)
</details>

<details>
<summary>
🤔: How to attribute OpenMoji in a film / video / youtube clip?
</summary>

- Add the suggested OpenMoji attribution to your video description (text below your video e.g. on youtube)
- Mention OpenMoji e.g. in the credits section at the end, in the voice track or add a small footnote when the first OpenMoji appears
</details>

## Contributing

<details>
<summary>
🤔: How can I help or contribute to OpenMoji?
</summary>

Contributions and help are very welcome! Please check the [CONTRIBUTING.md](https://github.com/hfg-gmuend/openmoji/blob/master/CONTRIBUTING.md) guide!
</details>


<details>
<summary>
🤔: I would like to propose a new OpenMoji, how does this work?
</summary>

Start a conversation on Github with us. For example [#84](https://github.com/hfg-gmuend/openmoji/issues/84) and [#97](https://github.com/hfg-gmuend/openmoji/issues/97)
</details>

<details>
<summary>
🤔: Does the OpenMoji project have a Contributor License Agreement (CLA)?
</summary>

No. OpenMoji does not have an explicit Contributor License Agreement. We simply go with common practice of many open source projects: "inbound = outbound"! Every Github user already agrees to this via the [terms of service](https://help.github.com/en/github/site-policy/github-terms-of-service#6-contributions-under-repository-license) of Github:

> Whenever you make a contribution to a repository containing notice of a license, you license your contribution under the same terms, and you agree that you have the right to license your contribution under those terms. 

Full discussion and context in [#120](https://github.com/hfg-gmuend/openmoji/issues/120).
</details>

<details>
<summary>
🤔: I suggested / proposed / asked for an Emoji ... but why is my name not listed as "author" of the new OpenMoji?
</summary>

Because we decided that the authorship should go to the person who took actively care of everything in terms of making: sketching, designing, testing, iterating, discussing etc. until the new OpenMoji was accepted. Idealy the same person takes care of the entire pipeline from start to end. However if the initial suggestion was by a different person, we will acknowledge this is the changelog.txt file while still credit the "maker" as the author.
</details>

## Technical problems

<details>
<summary>
🤔: The OpenMoji Black or Colorfont is not working as expected ... is this me?
</summary>

⚠️ The colorfont version of OpenMoji is in a very early alpha stage and not intended to use in production! Please follow the [discussion](https://github.com/hfg-gmuend/openmoji/issues/93) for updates.
</details>

## Other

<details>
<summary>
🤔: Is there an "emoji popup" or "emoji picker" available for OpenMoji?
</summary>

No, we are sorry! This is simply out of scope. But all other ways to consume/use/download OpenMojis are listed under [Downloads & Distribution Channels](https://github.com/hfg-gmuend/openmoji#downloads--distribution-channels).
</details>


<details>
<summary>
🤔: How can I convert an emoji to an openmoji svg with javascript?
</summary>

This script can be added to any website: 
```
<html>
<script>
    function get_emoji(emoji) {
        let emoji_code = [...emoji].map(e => e.codePointAt(0).toString(16)).join(`-`).toUpperCase();
        new_url = `https://openmoji.org/data/color/svg/${emoji_code}.svg`
        document.write(`<img src=${new_url} style="height: 80px;">`);
    }
    get_emoji("🦴")
    get_emoji("🎭")
    get_emoji("👩‍⚕️")
</script>
</html>
```



</details>





<details>
<summary>
🤔: How can I convert an emoji to an openmoji png image with python?
</summary>

This script can be used: 
```
from PIL import Image
import requests

def get_emoji(emoji):
    emoji_code = "-".join(f"{ord(c):x}" for c in emoji).upper()
    url = f"https://raw.githubusercontent.com/hfg-gmuend/openmoji/master/color/72x72/{emoji_code}.png"
    im = Image.open(requests.get(url, stream=True).raw)
   # image = np.array(im.convert("RGBA")) 
    return im

get_emoji("🦴")
get_emoji("🎭")
get_emoji("👩‍⚕️")
```


</details>


