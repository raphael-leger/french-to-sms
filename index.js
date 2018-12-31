'use strict';

const frenchLanguageData = require('./language-data/FR_fr.json');

function frenchToSms(input) {
    let output = input;

    output = toLowerCase(output);
    output = addSpacesLeftAndRight(output);
    output = standardizeApostrophes(output);
    output = addSpaceBeforePunctuation(output);
    output = removeAccents(output);
    output = replaceExactWords(output);
    output = replaceWordsContaining(output);
    output = replaceWordsStartingWith(output);
    output = replaceWordsEndingWith(output);
    output = replaceWordsWithATrailingLetter(output);
    output = putPunctuationBackInPlace(output);
    output = removeSpacesLeftAndRight(output);

    return output;
}

function replaceExactWords(output) {
    frenchLanguageData.exactWords.forEach(word => {
        for (let wordInput in word) {
            const wordOutput = word[wordInput];
            output = output.replace(new RegExp(`( |-)${wordInput}( |-)`, 'g'), ` ${wordOutput} `);
        }
    });

    return output;
}

function replaceWordsWithATrailingLetter(output) {
    frenchLanguageData.wordsWithATrailingLetter.forEach(word => {
        for (let wordInput in word) {
            const wordOutput = word[wordInput];
            output = output.replace(new RegExp(`${wordInput}( |-)`, 'g'), wordOutput);
        }
    });

    return output;
}

function replaceWordsStartingWith(output) {
    frenchLanguageData.wordsStartingWith.forEach(word => {
        for (let wordInput in word) {
            const wordOutput = word[wordInput];
            output = output.replace(new RegExp(`( |-)${wordInput}`, 'g'), ` ${wordOutput}`);
        }
    });

    return output;
}

function replaceWordsContaining(output) {
    frenchLanguageData.wordsContaining.forEach(word => {
        for (let wordInput in word) {
            const wordOutput = word[wordInput];
            output = output.replace(new RegExp(wordInput, 'g'), wordOutput);
        }
    });

    return output;
}

function replaceWordsEndingWith(output) {
    frenchLanguageData.wordsEndingWith.forEach(word => {
        for (let wordInput in word) {
            const wordOutput = word[wordInput];
            output = output.replace(new RegExp(`${wordInput}( |-)`, 'g'), `${wordOutput} `);
        }
    });

    return output;
}

function removeSpacesLeftAndRight(output) {
    return output.trim();
}

function putPunctuationBackInPlace(output) {
    output = output.replace(/ \./g, '.');
    output = output.replace(/ \,/g, ',');
    output = output.replace(/ \?/g, '?');
    output = output.replace(/ \!/g, '!');
    output = output.replace(/  \?/g, ' ?');
    output = output.replace(/  \!/g, ' !');
    output = output.replace(/ \)/g, ')');
    output = output.replace(/\( /g, '(');

    return output;
}

function removeAccents(output) {
    output = output.replace(new RegExp('î', 'g'), 'i');
    output = output.replace(new RegExp('ô', 'g'), 'o');
    output = output.replace(new RegExp('à', 'g'), 'a');
    output = output.replace(new RegExp('â', 'g'), 'a');
    output = output.replace(new RegExp('É', 'g'), 'é');
    output = output.replace(new RegExp('Î', 'g'), 'i');

    return output;
}

function addSpaceBeforePunctuation(output) {
    output = output.replace(/\./g, ' .');
    output = output.replace(/\,/g, ' ,');
    output = output.replace(/\?/g, ' ?');
    output = output.replace(/\!/g, ' !');
    output = output.replace(/\)/g, ' )');
    output = output.replace(/\(/g, '( ');

    return output;
}

function addSpacesLeftAndRight(output) {
    return `  ${output}  `;
}

function toLowerCase(output) {
    return output.toLowerCase();
}

function standardizeApostrophes(output) {
    return output.replace(new RegExp('’', 'g'), '\'');
}

module.exports = frenchToSms;