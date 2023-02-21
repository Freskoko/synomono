const natural = require('natural');
var wordnet = new natural.WordNet();

const word1 = 'happy';
const word2 = 'joyful';
const synsets1 = wordnet.lookup(word1);
const synsets2 = wordnet.lookup(word2);

console.log(synsets1)
console.log(synsets2)

const similarity = wordnet.wuPalmerSimilarity(synsets1[0], synsets2[0]);

console.log(`The similarity between "${word1}" and "${word2}" is ${similarity}`);