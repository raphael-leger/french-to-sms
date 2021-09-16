const { startOfWord, anywhere, endOfWord, wholeWord } = require('./regex.js');
const { disableModification, enableModification } = require('./modification.js');
const { ACTION_TYPE } = require('./actions.js');

const actionsToPerformAnywhere = require('./glossary/anywhere.json');
const actionsToPerformAtTheEndOfWords = require('./glossary/endOfWords.json');
const actionsToPerformAtTheStartOfWords = require('./glossary/startOfWords.json');
const actionsToPerformForWholeWords = require('./glossary/wholeWords.json');
const actionsToPerformAtTheEndOfWordsFollowedByASpace = require('./glossary/endOfWordsFollowedByASpace.json');


const performWholeWordReplacement = (text, action) => text.replace(wholeWord(action.input), ` ${action.output} `);

const performAnywhereReplacement = (text, action) => {
  switch (action.type) {
    default:
    case ACTION_TYPE.REPLACE:
      return text.replace(anywhere(action.input), action.output);
    case ACTION_TYPE.DISABLE_MODIFICATION:
      return text.replace(anywhere(action.input), disableModification(action.input));
    case ACTION_TYPE.ENABLE_MODIFICATION:
      return text.replace(anywhere(enableModification(action.input)), action.input);
  }
};

const performStartOfWordsReplacement = (text, action) => {
  switch (action.type) {
    default:
    case ACTION_TYPE.REPLACE:
      return text.replace(startOfWord(action.input), ` ${action.output}`);
    case ACTION_TYPE.DISABLE_MODIFICATION:
      return text.replace(startOfWord(action.input), ` ${disableModification(action.input)}`);
    case ACTION_TYPE.ENABLE_MODIFICATION:
      return text.replace(startOfWord(enableModification(action.input)), ` ${action.input}`);
  }
};

const performEndOfWordsReplacement = (text, action) => {
  switch (action.type) {
    default:
    case ACTION_TYPE.REPLACE:
      return text.replace(endOfWord(action.input), `${action.output} `);
    case ACTION_TYPE.DISABLE_MODIFICATION:
      return text.replace(endOfWord(action.input), `${disableModification(action.input)} `);
    case ACTION_TYPE.ENABLE_MODIFICATION:
      return text.replace(endOfWord(enableModification(action.input)), `${action.input} `);
  }
};

const performEndOfWordsFollowedByASpaceReplacement = (text, action) => {
  switch (action.type) {
    default:
    case ACTION_TYPE.REPLACE:
      return text.replace(endOfWord(action.input), action.output);
    case ACTION_TYPE.DISABLE_MODIFICATION:
      return text.replace(endOfWord(action.input), `${disableModification(`${action.input} `)} `);
    case ACTION_TYPE.ENABLE_MODIFICATION:
      return text.replace(endOfWord(enableModification(`${action.input} `)), `${action.input} `);
  }
};

const replaceWholeWords   = (text) => actionsToPerformForWholeWords.reduce(performWholeWordReplacement, text);
const replaceAnywhere     = (text) => actionsToPerformAnywhere.reduce(performAnywhereReplacement, text);
const replaceStartOfWords = (text) => actionsToPerformAtTheStartOfWords.reduce(performStartOfWordsReplacement, text);
const replaceEndOfWords   = (text) => actionsToPerformAtTheEndOfWords.reduce(performEndOfWordsReplacement, text);
const replaceEndOfWordsFollowedByASpace = (text) => actionsToPerformAtTheEndOfWordsFollowedByASpace.reduce(performEndOfWordsFollowedByASpaceReplacement, text);

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
