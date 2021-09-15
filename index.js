const glossary = require(`./glossary.json`);




/* MAIN FUNCTION */
const frenchToSms = (input) => {
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
};




/* REGULAR EXPRESSIONS */
const startOfWord = (characters) => new RegExp(`${characters}( |-)`, 'g');
const anywhere    = (characters) => new RegExp(characters, 'g');
const endOfWord   = (characters) => new RegExp(`( |-)${characters}`, 'g');
const exactWord   = (characters) => new RegExp(`( |-)${characters}( |-)`, 'g');



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




/* REPLACEMENT FUNCTIONS */
const replaceExactWords = (output) => {
    glossary.exactWords.forEach(word => {
        output = output.replace(exactWord(word.input), ` ${word.output} `);
    });

    return output;
};

const replaceWordsWithATrailingLetter = (output) => {
    glossary.wordsWithATrailingLetter.forEach(action => {
        if (action.type === 'replace_now') {
            output = output.replace(startOfWord(action.input), action.output);
        } else if (action.type === 'prevent_modification') {
            const preventionString = getNextPreventionString(modificationsPrevented);
            addToModificationsPrevented(modificationsPrevented, preventionString, `${action.input} `);
            output = output.replace(startOfWord(action.input), `${preventionString} `);
        } else if (action.type === 'enable_modification') {
            const preventionIndex = modificationsPrevented.findIndex(prevention => prevention.input === action.input);
            if (preventionIndex > -1) {
                const preventionString = modificationsPrevented[preventionIndex].preventionString;
                removeFromModificationsPrevented(preventionIndex);
                output = output.replace(startOfWord(preventionString), action.input);
            };
        }
    });

    return output;
};

const replaceWordsStartingWith = (output) => {
    glossary.wordsStartingWith.forEach(action => {
        if (action.type === 'replace_now') {
            output = output.replace(endOfWord(action.input), ` ${action.output}`);
        } else if (action.type === 'prevent_modification') {
            const preventionString = getNextPreventionString(modificationsPrevented);
            addToModificationsPrevented(modificationsPrevented, preventionString, action.input);
            output = output.replace(endOfWord(action.input), ` ${preventionString}`);
        } else if (action.type === 'enable_modification') {
            const preventionIndex = modificationsPrevented.findIndex(prevention => prevention.input === action.input);
            if (preventionIndex > -1) {
                const preventionString = modificationsPrevented[preventionIndex].preventionString;
                removeFromModificationsPrevented(preventionIndex);
                output = output.replace(endOfWord(preventionString), ` ${action.input}`);
            };
        }
    });

    return output;
};

const replaceWordsContaining = (output) => {
    glossary.wordsContaining.forEach(action => {
        if (action.type === 'replace_now') {
            output = output.replace(anywhere(action.input), action.output);
        } else if (action.type === 'prevent_modification') {
            const preventionString = getNextPreventionString(modificationsPrevented);
            addToModificationsPrevented(modificationsPrevented, preventionString, action.input);
            output = output.replace(anywhere(action.input), preventionString);
        } else if (action.type === 'enable_modification') {
            const preventionIndex = modificationsPrevented.findIndex(prevention => prevention.input === action.input);
            if (preventionIndex > -1) {
                const preventionString = modificationsPrevented[preventionIndex].preventionString;
                removeFromModificationsPrevented(preventionIndex);
                output = output.replace(anywhere(preventionString), action.input);
            };
        }
    });

    return output;
};

const replaceWordsEndingWith = (output) => {
    glossary.wordsEndingWith.forEach(action => {
        if (action.type === 'replace_now') {
            output = output.replace(startOfWord(action.input), `${action.output} `);
        } else if (action.type === 'prevent_modification') {
            const preventionString = getNextPreventionString(modificationsPrevented);
            addToModificationsPrevented(modificationsPrevented, preventionString, action.input);
            output = output.replace(startOfWord(action.input), `${preventionString} `);
        } else if (action.type === 'enable_modification') {
            const preventionIndex = modificationsPrevented.findIndex(prevention => prevention.input === action.input);
            if (preventionIndex > -1) {
                const preventionString = modificationsPrevented[preventionIndex].preventionString;
                removeFromModificationsPrevented(preventionIndex);
                output = output.replace(anywhere(preventionString), `${action.input} `);
            };
        }
    });

    return output;
};




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
