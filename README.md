# french-to-sms

[![Tests](https://github.com/raphael-leger/french-to-sms/actions/workflows/test.yml/badge.svg?branch=master)](https://github.com/raphael-leger/french-to-sms/actions/workflows/test.yml)

Experimental project that converts French sentences to French sms style sentences in JavaScript.

It should lead to smaller sentences that are still readable, even though some vocabulary may be known by younger people only 😄

## Installation

```bash
npm install french-to-sms
```

## Usage

```javascript
const frenchToSms = require('french-to-sms');

frenchToSms("coucou");
// => "cc"

frenchToSms("Bonjour tout le monde ! J'espère que vous allez bien ! Moi la patate !");
// => "bjr tt lmond ! jspr k vs allé b1 ! mwa la patate !"

frenchToSms("S'il vous plaît, pouvez-vous faire moins de bruit ? Merci.");
// => "svp, pouvé vs fR - 2 brui ? marci."
```

## Demo

You can test the algorithm out on this [demo page](https://raphael-leger.github.io/french-to-sms/).


## Algorithm

The algorithm behind this project is based upon a custom-made glossary.

It performs successively several replacements of characters.


## Glossary

The glossary in its current state should enable a good quantity of french words and sentences to be shortened rather correctly.
It was built from scratch by kind of reverse engineering the SMS French language and how it can be constructed.


### Actions

The glossary contains actions and there are 3 types of actions:
- `replace`: to replace some characters by some other characters
- `disable_modification`: to prevent some characters from being replaced
- `enable_modification`: to re-allow some characters to be replaced


### Replacements

The glossary is divided in five distinct replacement categories:

- `anywhere`: replacements contained in this category will be performed anywhere within the input text (Useful for general rules, eg: double consonants is often useless `apprends` => `aprends`)
- `endOfWords`: replacements contained in this category will be performed only at the end of words (Useful for general rules at the end of words, eg: the `e` in words ending with `e` is often silent; `pomme ` => `pomm`)
- `startOfWords`: replacements contained in this category will be performed only at the start of words (Useful for general rules at the start of words, eg: the `h` is often silent; `haricot` => `aricot`)
- `wholeWords`: replacements contained in this category will be performed only if they exactly match a whole word (Useful for words that need a specific conversion that does not follow general rules, eg: `monsieur` => `mr`.)
- `endOfWordsFollowedByASpace`: replacements contained in this category will be performed only at the end of words that are followed by a space (Useful to get rid of the space as well, eg: `je suis` => `jsuis`)


### Disable/enable modification
By default, the whole text input is subject to replacements. Though, some characters can be protected from replacements for a given time.

For instance, we may want to replace every occurence of `si` by `6` as it is a good sms equivalent (`sinon` would become `6non`, `aussi` would become `au6`).

But some sounds like `sin` often sound like `zin` so replacing `si` by `6` would be wrongly interpreted (`usine` would become `u6ne`).
So we may want to disable replacements on `sin` while we perform a replacements on `si`, then later-on re-enable the replacements on `sin`.

## Contributing

If for some reason you would like to enhance the glossary, feel free to do a pull request containing updates within the glossary and tests covering the conversion changes you enabled.
