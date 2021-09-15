# french-to-sms

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


## Glossary

The glossary should enable a good quantity of french words and sentences to be shortened roughly correctly.
It was built from scratch by kind of "reverse engineering" the French language and the way it can be shortened up based on phonetics.


## Contributing

If for some reason you would like to enhance the glossary, feel free to do a pull request containing updates within the glossary and tests covering the conversion changes you enabled.
