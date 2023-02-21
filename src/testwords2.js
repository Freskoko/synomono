const tf = require('@tensorflow/tfjs');
const use = require('@tensorflow-models/universal-sentence-encoder');

async function CloseNess(wordGoal, wordGuess) {
  const model = await use.load();
  const embeddings = (await model.embed([wordGoal, wordGuess])).unstack();
  const numGuess = tf.losses.cosineDistance(embeddings[0], embeddings[1], 0);
  const result = await numGuess.array();
  return result;
}

(async () => {
    response = (await CloseNess("interesting","paint"));
    console.log(response)
})();

