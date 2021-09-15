const glossary = require(`./glossary.json`);

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
    glossary.exactWords.forEach(word => {
        output = output.replace(new RegExp(`( |-)${word.input}( |-)`, 'g'), ` ${word.output} `);
    });

    return output;
}

function replaceWordsWithATrailingLetter(output) {
    const modificationsPrevented = [];

    glossary.wordsWithATrailingLetter.forEach(action => {
        if (action.type === 'replace_now') {
            output = output.replace(new RegExp(`${action.input}( |-)`, 'g'), action.output);
        } else if (action.type === 'prevent_modification') {
            const preventionString = getPreventionString(modificationsPrevented);
            modificationsPrevented.push({
                input: `${action.input} `,
                preventionString
            });
            output = output.replace(new RegExp(`${action.input}( |-)`, 'g'), `${preventionString} `);
        } else if (action.type === 'enable_modification') {
            const preventionIndex = modificationsPrevented.findIndex(prevention => prevention.input === action.input);
            if (preventionIndex > -1) {
                const preventionString = modificationsPrevented[preventionIndex].preventionString;
                modificationsPrevented.splice(preventionIndex, 1);
                output = output.replace(new RegExp(`${preventionString}( |-)`, 'g'), action.input);
            };
        }
    });

    return output;
}

function replaceWordsStartingWith(output) {
    const modificationsPrevented = [];

    glossary.wordsStartingWith.forEach(action => {
        if (action.type === 'replace_now') {
            output = output.replace(new RegExp(`( |-)${action.input}`, 'g'), ` ${action.output}`);
        } else if (action.type === 'prevent_modification') {
            const preventionString = getPreventionString(modificationsPrevented);
            modificationsPrevented.push({
                input: action.input,
                preventionString
            });
            output = output.replace(new RegExp(`( |-)${action.input}`, 'g'), ` ${preventionString}`);
        } else if (action.type === 'enable_modification') {
            const preventionIndex = modificationsPrevented.findIndex(prevention => prevention.input === action.input);
            if (preventionIndex > -1) {
                const preventionString = modificationsPrevented[preventionIndex].preventionString;
                modificationsPrevented.splice(preventionIndex, 1);
                output = output.replace(new RegExp(`( |-)${preventionString}`, 'g'), ` ${action.input}`);
            };
        }
    });

    return output;
}

function replaceWordsContaining(output) {
    const modificationsPrevented = [];

    glossary.wordsContaining.forEach(action => {
        if (action.type === 'replace_now') {
            output = output.replace(new RegExp(action.input, 'g'), action.output);
        } else if (action.type === 'prevent_modification') {
            const preventionString = getPreventionString(modificationsPrevented);
            modificationsPrevented.push({
                input: action.input,
                preventionString
            });
            output = output.replace(new RegExp(action.input, 'g'), preventionString);
        } else if (action.type === 'enable_modification') {
            const preventionIndex = modificationsPrevented.findIndex(prevention => prevention.input === action.input);
            if (preventionIndex > -1) {
                const preventionString = modificationsPrevented[preventionIndex].preventionString;
                modificationsPrevented.splice(preventionIndex, 1);
                output = output.replace(new RegExp(preventionString, 'g'), action.input);
            };
        }
    });

    return output;
}

function replaceWordsEndingWith(output) {
    const modificationsPrevented = [];

    glossary.wordsEndingWith.forEach(action => {
        if (action.type === 'replace_now') {
            output = output.replace(new RegExp(`${action.input}( |-)`, 'g'), `${action.output} `);
        } else if (action.type === 'prevent_modification') {
            const preventionString = getPreventionString(modificationsPrevented);
            modificationsPrevented.push({
                input: action.input,
                preventionString
            });
            output = output.replace(new RegExp(`${action.input}( |-)`, 'g'), `${preventionString} `);
        } else if (action.type === 'enable_modification') {
            const preventionIndex = modificationsPrevented.findIndex(prevention => prevention.input === action.input);
            if (preventionIndex > -1) {
                const preventionString = modificationsPrevented[preventionIndex].preventionString;
                modificationsPrevented.splice(preventionIndex, 1);
                output = output.replace(new RegExp(preventionString, 'g'), `${action.input} `);
            };
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

function getPreventionString(modificationsPrevented) {
    const preventionNumber = modificationsPrevented.length + 1;
    return `REPLACEMENT_${preventionNumber}`;
}

module.exports = frenchToSms;
