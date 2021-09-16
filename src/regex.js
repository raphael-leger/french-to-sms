const startOfWord = (characters) => new RegExp(`${characters}( |-)`, 'g');
const anywhere    = (characters) => new RegExp(characters, 'g');
const endOfWord   = (characters) => new RegExp(`( |-)${characters}`, 'g');
const wholeWord   = (characters) => new RegExp(`( |-)${characters}( |-)`, 'g');

module.exports = { startOfWord, anywhere, endOfWord, wholeWord };
