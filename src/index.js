const {
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
} = require('./replacement.js');


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

module.exports = frenchToSms;
