const glossary = require(`./glossary.json`);




/* MAIN FUNCTION */
const frenchToSms = (input) => {
  if (!input) {
    throw Error("Please provide an input text: frenchToSms('bonjour')");
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
  output = replaceAnywhere(output);
  output = replaceStartOfWords(output);
  output = replaceEndOfWords(output);
  output = replaceEndOfWordsFollowedByASpace(output);

  // Clean the output text
  output = putPunctuationBackInPlace(output);
  output = removeLeftAndRightSpaces(output);

  return output;
};




/* REGULAR EXPRESSIONS */
const startOfWord = (characters) => new RegExp(`${characters}( |-)`, 'g');
const anywhere    = (characters) => new RegExp(characters, 'g');
const endOfWord   = (characters) => new RegExp(`( |-)${characters}`, 'g');
const wholeWord   = (characters) => new RegExp(`( |-)${characters}( |-)`, 'g');



/* MODIFICATIONS PREVENTION SYSTEM */
const modificationsDisabled = [];

const disableModification = (hash, input) => {
    modificationsDisabled.push({
        input,
        hash
    });
};

const enableModification = (disabledModificationIndex) => {
    modificationsDisabled.splice(disabledModificationIndex, 1);
};

const getHash = () => {
    const modificationNumber = modificationsDisabled.length + 1;
    return `!!!!!!FRENCH!TO!SMS!REPLACEMENT!${modificationNumber}`;
};




/* ACTIONS */
const ACTION_TYPE = {
    REPLACE: 'replace',
    DISABLE_MODIFICATION: 'disable_modification',
    ENABLE_MODIFICATION: 'enable_modification',
};




/* REPLACEMENT FUNCTIONS */
const performWholeWordReplacement = (text, { input, output }) => text.replace(wholeWord(input), ` ${output} `);

const performStartOfWordsReplacement = (text, { type, input, output }) => {
    switch (type) {
        default:
        case ACTION_TYPE.REPLACE:
            return text.replace(endOfWord(input), ` ${output}`);
        case ACTION_TYPE.DISABLE_MODIFICATION:
            const hash = getHash();
            disableModification(hash, input);
            return text.replace(endOfWord(input), ` ${hash}`);
        case ACTION_TYPE.ENABLE_MODIFICATION:
            const disabledModificationIndex = modificationsDisabled.findIndex(modification => modification.input === input);
            if (disabledModificationIndex > -1) {
                const { hash } = modificationsDisabled[disabledModificationIndex];
                enableModification(disabledModificationIndex);
                return text.replace(endOfWord(hash), ` ${input}`);
            };
            return text;
    }
};

const performAnywhereReplacement = (text, { type, input, output }) => {
    switch (type) {
        default:
        case ACTION_TYPE.REPLACE:
            return text.replace(anywhere(input), output);
        case ACTION_TYPE.DISABLE_MODIFICATION:
            const hash = getHash();
            disableModification(hash, input);
            return text.replace(anywhere(input), hash);
        case ACTION_TYPE.ENABLE_MODIFICATION:
            const disabledModificationIndex = modificationsDisabled.findIndex(modification => modification.input === input);
            if (disabledModificationIndex > -1) {
                const { hash } = modificationsDisabled[disabledModificationIndex];
                enableModification(disabledModificationIndex);
                return text.replace(anywhere(hash), input);
            };
            return text;
    }
};

const performEndOfWordsFollowedByASpaceReplacement = (text, { type, input, output }) => {
    switch (type) {
        default:
        case ACTION_TYPE.REPLACE:
            return text.replace(startOfWord(input), output);
        case ACTION_TYPE.DISABLE_MODIFICATION:
            const hash = getHash();
            disableModification(hash, `${input} `);
            return text.replace(startOfWord(input), `${hash} `);
        case ACTION_TYPE.ENABLE_MODIFICATION:
            const disabledModificationIndex = modificationsDisabled.findIndex(modification => modification.input === `${input} `);
            if (disabledModificationIndex > -1) {
                const { hash } = modificationsDisabled[disabledModificationIndex];
                enableModification(disabledModificationIndex);
                return text.replace(startOfWord(hash), `${input} `);
            };
            return text;
    }
};

const performEndOfWordsReplacement = (text, { type, input, output }) => {
    switch (type) {
        default:
        case ACTION_TYPE.REPLACE:
            return text.replace(startOfWord(input), `${output} `);
        case ACTION_TYPE.DISABLE_MODIFICATION:
            const hash = getHash();
            disableModification(hash, input);
            return text.replace(startOfWord(input), `${hash} `);
        case ACTION_TYPE.ENABLE_MODIFICATION:
            const disabledModificationIndex = modificationsDisabled.findIndex(modification => modification.input === input);
            if (disabledModificationIndex > -1) {
                const { hash } = modificationsDisabled[disabledModificationIndex];
                enableModification(disabledModificationIndex);
                return text.replace(anywhere(hash), `${input} `);
            };
            return text;
    }
};

const replaceWholeWords   = (text) => glossary.wholeWords.reduce(performWholeWordReplacement, text);
const replaceAnywhere     = (text) => glossary.anywhere.reduce(performAnywhereReplacement, text);
const replaceStartOfWords = (text) => glossary.startOfWords.reduce(performStartOfWordsReplacement, text);
const replaceEndOfWords   = (text) => glossary.endOfWords.reduce(performEndOfWordsReplacement, text);
const replaceEndOfWordsFollowedByASpace = (text) => glossary.endOfWordsFollowedByASpace.reduce(performEndOfWordsFollowedByASpaceReplacement, text);




/* UTILS FUNCTIONS */
const addSpacesLeftAndRight = (text) => {
    return `  ${text}  `;
};

const removeLeftAndRightSpaces = (text) => {
    return text.trim();
};

const removeAccents = (text) => {
    text = text.replace(anywhere('î'), 'i');
    text = text.replace(anywhere('ô'), 'o');
    text = text.replace(anywhere('à'), 'a');
    text = text.replace(anywhere('â'), 'a');
    text = text.replace(anywhere('É'), 'é');
    text = text.replace(anywhere('Î'), 'i');

    return text;
};

const addSpaceBeforePunctuation = (text) => {
    text = text.replace(/\./g, ' .');
    text = text.replace(/\,/g, ' ,');
    text = text.replace(/\?/g, ' ?');
    text = text.replace(/\!/g, ' !');
    text = text.replace(/\)/g, ' )');
    text = text.replace(/\(/g, '( ');

    return text;
};

const putPunctuationBackInPlace = (text) => {
    text = text.replace(/ \./g, '.');
    text = text.replace(/ \,/g, ',');
    text = text.replace(/  \?/g, '?');
    text = text.replace(/  \!/g, '!');
    text = text.replace(/ \?/g, '?');
    text = text.replace(/ \!/g, '!');
    text = text.replace(/ \)/g, ')');
    text = text.replace(/\( /g, '(');

    return text;
};

const toLowerCase = (text) => {
    return text.toLowerCase();
};

const standardizeApostrophes = (text) => {
    return text.replace(anywhere('’'), '\'');
};

module.exports = frenchToSms;
