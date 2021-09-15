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


## Algorithm

The algorithm behind this project is based upon a custom-made glossary. It performs several replacements of characters in a given order. Some specific replacements are made at the end of words, others at the start of words, other in the middle of them, and some specific words are also completely replaced.

### Replacements prevention
By default, the whole text input is subject to replacements. Though, some characters can be protected from replacements for a given time.

For instance, we may want to replace every occurence of "si" by "6" as it is a good sms equivalent ("sinon" would become "6non", "aussi" would become "au6").

But some sounds like "sin" often sound like `zin` so replacing "si" by "6" would be wrongly interpreted ("usine" would become "u6ne").
So we may want to prevent replacements on "sin" while we perform a replacements on "si", then later-on re-enable the replacements on "sin".
This is why there is a replacement prevention system in the algorithm.


## Glossary

The glossary should enable a good quantity of french words and sentences to be shortened roughly correctly.
It was built from scratch by kind of "reverse engineering" the French language and the way it can be shortened up based on phonetics.

Ths glossary contains actions and there are 3 types of actions:
- `replace_now`: to replace some characters by some other characters
- `prevent_modification`: to prevent some characters from being replaced
- `enable_modification`: to re-allow some characters to be replaced


## Contributing

If for some reason you would like to enhance the glossary, feel free to do a pull request containing updates within the glossary and tests covering the conversion changes you enabled.
