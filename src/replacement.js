const { startOfWord, anywhere, endOfWord, wholeWord } = require('./regex.js');
const { ACTION_TYPE } = require('./actions.js');

const actionsToPerformAnywhere = require('./glossary/anywhere.json');
const actionsToPerformAtTheEndOfWords = require('./glossary/endOfWords.json');
const actionsToPerformAtTheStartOfWords = require('./glossary/startOfWords.json');
const actionsToPerformForWholeWords = require('./glossary/wholeWords.json');
const actionsToPerformAtTheEndOfWordsFollowedByASpace = require('./glossary/endOfWordsFollowedByASpace.json');




/* MODIFICATIONS PREVENTION SYSTEM */
const disabledModifications = [];

const disableModification = (input) => {
  const hash = getHash();

  disabledModifications.push({
    input,
    hash
  });

  return hash;
};

const enableModification = (disabledModificationIndex) => {
  disabledModifications.splice(disabledModificationIndex, 1);
};

const getHash = () => {
  const modificationNumber = disabledModifications.length + 1;
  return `!!!!!!FRENCH!TO!SMS!REPLACEMENT!${modificationNumber}`;
};




/* REPLACEMENT FUNCTIONS */
const performWholeWordReplacement = (text, action) => text.replace(wholeWord(action.input), ` ${action.output} `);

const performStartOfWordsReplacement = (text, action) => {
  switch (action.type) {
    default:
    case ACTION_TYPE.REPLACE:
      return text.replace(endOfWord(action.input), ` ${action.output}`);
    case ACTION_TYPE.DISABLE_MODIFICATION:
      const hash = disableModification(action.input);
      return text.replace(endOfWord(action.input), ` ${hash}`);
    case ACTION_TYPE.ENABLE_MODIFICATION:
      const disabledModificationIndex = disabledModifications.findIndex(modification => modification.input === action.input);
      if (disabledModificationIndex > -1) {
        const { hash } = disabledModifications[disabledModificationIndex];
        enableModification(disabledModificationIndex);
        return text.replace(endOfWord(hash), ` ${action.input}`);
      };
      return text;
  }
};

const performAnywhereReplacement = (text, action) => {
  switch (action.type) {
    default:
    case ACTION_TYPE.REPLACE:
      return text.replace(anywhere(action.input), action.output);
    case ACTION_TYPE.DISABLE_MODIFICATION:
      const hash = disableModification(action.input);
      return text.replace(anywhere(action.input), hash);
    case ACTION_TYPE.ENABLE_MODIFICATION:
      const disabledModificationIndex = disabledModifications.findIndex(modification => modification.input === action.input);
      if (disabledModificationIndex > -1) {
        const { hash } = disabledModifications[disabledModificationIndex];
        enableModification(disabledModificationIndex);
        return text.replace(anywhere(hash), action.input);
      };
      return text;
  }
};

const performEndOfWordsFollowedByASpaceReplacement = (text, action) => {
  switch (action.type) {
    default:
    case ACTION_TYPE.REPLACE:
      return text.replace(startOfWord(action.input), action.output);
    case ACTION_TYPE.DISABLE_MODIFICATION:
      const hash = disableModification(`${action.input} `);
      return text.replace(startOfWord(action.input), `${hash} `);
    case ACTION_TYPE.ENABLE_MODIFICATION:
      const disabledModificationIndex = disabledModifications.findIndex(modification => modification.input === `${action.input} `);
      if (disabledModificationIndex > -1) {
        const { hash } = disabledModifications[disabledModificationIndex];
        enableModification(disabledModificationIndex);
        return text.replace(startOfWord(hash), `${action.input} `);
      };
      return text;
  }
};

const performEndOfWordsReplacement = (text, action) => {
  switch (action.type) {
    default:
    case ACTION_TYPE.REPLACE:
      return text.replace(startOfWord(action.input), `${action.output} `);
    case ACTION_TYPE.DISABLE_MODIFICATION:
      const hash = disableModification(action.input);
      return text.replace(startOfWord(action.input), `${hash} `);
    case ACTION_TYPE.ENABLE_MODIFICATION:
      const disabledModificationIndex = disabledModifications.findIndex(modification => modification.input === action.input);
      if (disabledModificationIndex > -1) {
        const { hash } = disabledModifications[disabledModificationIndex];
        enableModification(disabledModificationIndex);
        return text.replace(anywhere(hash), `${action.input} `);
      };
      return text;
  }
};

const replaceWholeWords   = (text) => actionsToPerformForWholeWords.reduce(performWholeWordReplacement, text);
const replaceAnywhere     = (text) => actionsToPerformAnywhere.reduce(performAnywhereReplacement, text);
const replaceStartOfWords = (text) => actionsToPerformAtTheStartOfWords.reduce(performStartOfWordsReplacement, text);
const replaceEndOfWords   = (text) => actionsToPerformAtTheEndOfWords.reduce(performEndOfWordsReplacement, text);
const replaceEndOfWordsFollowedByASpace = (text) => actionsToPerformAtTheEndOfWordsFollowedByASpace.reduce(performEndOfWordsFollowedByASpaceReplacement, text);




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

module.exports = {
  toLowerCase,
  addSpacesLeftAndRight,
  standardizeApostrophes,
  addSpaceBeforePunctuation,
  removeAccents,
  replaceWholeWords,
  replaceAnywhere,
  replaceStartOfWords,
  replaceEndOfWords,
  replaceEndOfWordsFollowedByASpace,
  putPunctuationBackInPlace,
  removeLeftAndRightSpaces
};
