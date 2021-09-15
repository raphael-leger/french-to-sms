const glossary = require(`./glossary.json`);




/* MAIN FUNCTION */
const frenchToSms = (input) => {
  if (!input) {
    throw Error("[frenchToSms] Please provide an input text: frenchToSms('bonjour')");
  }

  let output = input;

  // Clean the input text
  output = toLowerCase(output);
  output = addSpacesLeftAndRight(output);
  output = standardizeApostrophes(output);
  output = addSpaceBeforePunctuation(output);
  output = removeAccents(output);

  // Perform replacements based on the glossary
  output = replaceWholeWords(output);
  output = replaceWordsContaining(output);
  output = replaceWordsStartingWith(output);
  output = replaceWordsEndingWith(output);
  output = replaceWordsWithATrailingLetter(output);

  // Clean the output text
  output = putPunctuationBackInPlace(output);
  output = removeSpacesLeftAndRight(output);

  return output;
};




/* REGULAR EXPRESSIONS */
const startOfWord = (characters) => new RegExp(`${characters}( |-)`, 'g');
const anywhere    = (characters) => new RegExp(characters, 'g');
const endOfWord   = (characters) => new RegExp(`( |-)${characters}`, 'g');
const wholeWord   = (characters) => new RegExp(`( |-)${characters}( |-)`, 'g');



/* MODIFICATIONS PREVENTION SYSTEM */
const modificationsPrevented = [];

const addToModificationsPrevented = (modificationsPrevented, preventionString, input) => {
    modificationsPrevented.push({
        input,
        preventionString
    });
};

const removeFromModificationsPrevented = (preventionIndex) => {
    modificationsPrevented.splice(preventionIndex, 1);
};

const getNextPreventionString = (modificationsPrevented) => {
    const preventionNumber = modificationsPrevented.length + 1;
    return `!!!!!!FRENCH!TO!SMS!REPLACEMENT!${preventionNumber}`;
};




/* ACTIONS */
const ACTION_TYPE = {
    REPLACE_NOW: 'replace_now',
    PREVENT_MODIFICATION: 'prevent_modification',
    ENABLE_MODIFICATION: 'enable_modification',
};




/* REPLACEMENT FUNCTIONS */
const performWholeWordReplacement = (output, action) => output.replace(wholeWord(action.input), ` ${action.output} `);

const performWordStartingWithReplacement = (output, action) => {
    switch (action.type) {
        default:
        case ACTION_TYPE.REPLACE_NOW:
            return output.replace(endOfWord(action.input), ` ${action.output}`);
        case ACTION_TYPE.PREVENT_MODIFICATION:
            const preventionString = getNextPreventionString(modificationsPrevented);
            addToModificationsPrevented(modificationsPrevented, preventionString, action.input);
            return output.replace(endOfWord(action.input), ` ${preventionString}`);
        case ACTION_TYPE.ENABLE_MODIFICATION:
            const preventionIndex = modificationsPrevented.findIndex(prevention => prevention.input === action.input);
            if (preventionIndex > -1) {
                const preventionString = modificationsPrevented[preventionIndex].preventionString;
                removeFromModificationsPrevented(preventionIndex);
                return output.replace(endOfWord(preventionString), ` ${action.input}`);
            };
            return output;
    }
};

const performWordContainingReplacement = (output, action) => {
    switch (action.type) {
        default:
        case ACTION_TYPE.REPLACE_NOW:
            return output.replace(anywhere(action.input), action.output);
        case ACTION_TYPE.PREVENT_MODIFICATION:
            const preventionString = getNextPreventionString(modificationsPrevented);
            addToModificationsPrevented(modificationsPrevented, preventionString, action.input);
            return output.replace(anywhere(action.input), preventionString);
        case ACTION_TYPE.ENABLE_MODIFICATION:
            const preventionIndex = modificationsPrevented.findIndex(prevention => prevention.input === action.input);
            if (preventionIndex > -1) {
                const preventionString = modificationsPrevented[preventionIndex].preventionString;
                removeFromModificationsPrevented(preventionIndex);
                return output.replace(anywhere(preventionString), action.input);
            };
            return output;
    }
};

const performWordWithTrailingLetterReplacement = (output, action) => {
    switch (action.type) {
        default:
        case ACTION_TYPE.REPLACE_NOW:
            return output.replace(startOfWord(action.input), action.output);
        case ACTION_TYPE.PREVENT_MODIFICATION:
            const preventionString = getNextPreventionString(modificationsPrevented);
            addToModificationsPrevented(modificationsPrevented, preventionString, `${action.input} `);
            return output.replace(startOfWord(action.input), `${preventionString} `);
        case ACTION_TYPE.ENABLE_MODIFICATION:
            const preventionIndex = modificationsPrevented.findIndex(prevention => prevention.input === `${action.input} `);
            if (preventionIndex > -1) {
                const preventionString = modificationsPrevented[preventionIndex].preventionString;
                removeFromModificationsPrevented(preventionIndex);
                return output.replace(startOfWord(preventionString), `${action.input} `);
            };
            return output;
    }
};

const performWordEndingWithReplacement = (output, action) => {
    switch (action.type) {
        default:
        case ACTION_TYPE.REPLACE_NOW:
            return output.replace(startOfWord(action.input), `${action.output} `);
        case ACTION_TYPE.PREVENT_MODIFICATION:
            const preventionString = getNextPreventionString(modificationsPrevented);
            addToModificationsPrevented(modificationsPrevented, preventionString, action.input);
            return output.replace(startOfWord(action.input), `${preventionString} `);
        case ACTION_TYPE.ENABLE_MODIFICATION:
            const preventionIndex = modificationsPrevented.findIndex(prevention => prevention.input === action.input);
            if (preventionIndex > -1) {
                const preventionString = modificationsPrevented[preventionIndex].preventionString;
                removeFromModificationsPrevented(preventionIndex);
                return output.replace(anywhere(preventionString), `${action.input} `);
            };
            return output;
    }
};

const replaceWholeWords = (output) => glossary.wholeWords.reduce(performWholeWordReplacement, output);
const replaceWordsWithATrailingLetter = (output) => glossary.wordsWithATrailingLetter.reduce(performWordWithTrailingLetterReplacement, output);
const replaceWordsStartingWith = (output) => glossary.wordsStartingWith.reduce(performWordStartingWithReplacement, output);
const replaceWordsContaining = (output) => glossary.wordsContaining.reduce(performWordContainingReplacement, output);
const replaceWordsEndingWith = (output) => glossary.wordsEndingWith.reduce(performWordEndingWithReplacement, output);




/* UTILS FUNCTIONS */
const removeSpacesLeftAndRight = (output) => {
    return output.trim();
};

const putPunctuationBackInPlace = (output) => {
    output = output.replace(/ \./g, '.');
    output = output.replace(/ \,/g, ',');
    output = output.replace(/ \?/g, '?');
    output = output.replace(/ \!/g, '!');
    output = output.replace(/  \?/g, ' ?');
    output = output.replace(/  \!/g, ' !');
    output = output.replace(/ \)/g, ')');
    output = output.replace(/\( /g, '(');

    return output;
};

const removeAccents = (output) => {
    output = output.replace(anywhere('î'), 'i');
    output = output.replace(anywhere('ô'), 'o');
    output = output.replace(anywhere('à'), 'a');
    output = output.replace(anywhere('â'), 'a');
    output = output.replace(anywhere('É'), 'é');
    output = output.replace(anywhere('Î'), 'i');

    return output;
};

const addSpaceBeforePunctuation = (output) => {
    output = output.replace(/\./g, ' .');
    output = output.replace(/\,/g, ' ,');
    output = output.replace(/\?/g, ' ?');
    output = output.replace(/\!/g, ' !');
    output = output.replace(/\)/g, ' )');
    output = output.replace(/\(/g, '( ');

    return output;
};

const addSpacesLeftAndRight = (output) => {
    return `  ${output}  `;
};

const toLowerCase = (output) => {
    return output.toLowerCase();
};

const standardizeApostrophes = (output) => {
    return output.replace(anywhere('’'), '\'');
};

module.exports = frenchToSms;
