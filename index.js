'use strict';

function frenchToSms(input) {
    let output = input;

    output = toLowerCase(output);
    output = addSpacesLeftAndRight(output);
    output = standardizeApostrophes(output);
    output = addSpaceBeforePunctuation(output);
    output = removeAccents(output);

    output = replaceNumbers(output);
    output = addSpaceBeforeHyphens(output);

    output = replaceWords(output);

    output = putPunctuationBackInPlace(output);
    output = removeSpacesLeftAndRight(output);

    return output;
}

function replaceNumbers(output) {
    output = output.replace(new RegExp(' dix-sept ', 'g'), ' 17 ');
    output = output.replace(new RegExp(' dix-huit ', 'g'), ' 18 ');
    output = output.replace(new RegExp(' dix-neuf ', 'g'), ' 19 ');
    output = output.replace(new RegExp(' soixante-dix ', 'g'), ' 70 ');
    output = output.replace(new RegExp(' quatre-vingt ', 'g'), ' 80 ');
    output = output.replace(new RegExp(' quatre-vingt-dix ', 'g'), ' 90 ');

    output = output.replace(new RegExp(' zéro ', 'g'), ' 0 ');
    output = output.replace(new RegExp(' un ', 'g'), ' 1 ');
    output = output.replace(new RegExp(' deux ', 'g'), ' 2 ');
    output = output.replace(new RegExp(' trois ', 'g'), ' 3 ');
    output = output.replace(new RegExp(' quatre ', 'g'), ' 4 ');
    output = output.replace(new RegExp(' cinq ', 'g'), ' 5 ');
    output = output.replace(new RegExp(' six ', 'g'), ' 6 ');
    output = output.replace(new RegExp(' sept ', 'g'), ' 7 ');
    output = output.replace(new RegExp(' huit ', 'g'), ' 8 ');
    output = output.replace(new RegExp(' neuf ', 'g'), ' 9 ');
    output = output.replace(new RegExp(' dix ', 'g'), ' 10 ');
    output = output.replace(new RegExp(' onze ', 'g'), ' 11 ');
    output = output.replace(new RegExp(' douze ', 'g'), ' 12 ');
    output = output.replace(new RegExp(' treize ', 'g'), ' 13 ');
    output = output.replace(new RegExp(' quatorze ', 'g'), ' 14 ');
    output = output.replace(new RegExp(' quinze ', 'g'), ' 15 ');
    output = output.replace(new RegExp(' seize ', 'g'), ' 16 ');
    output = output.replace(new RegExp(' vingt ', 'g'), ' 20 ');
    output = output.replace(new RegExp(' trente ', 'g'), ' 30 ');
    output = output.replace(new RegExp(' quarante ', 'g'), ' 40 ');
    output = output.replace(new RegExp(' cinquante ', 'g'), ' 50 ');
    output = output.replace(new RegExp(' soixante ', 'g'), ' 60 ');

    return output;
}

function replaceWords(output) {
    output = output.replace(new RegExp(' coucou ', 'g'), ' cc ');
    output = output.replace(new RegExp(' bonjour ', 'g'), ' bjr ');

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
    output = output.replace(new RegExp('É', 'g'), 'é');
    output = output.replace(new RegExp('Î', 'g'), 'i');

    return output;
}

function addSpaceBeforeHyphens(output) {
    return output.replace(/\-/g, ' -');
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