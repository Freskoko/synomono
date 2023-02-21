import logo from './questionmark4.png';
import './App.css';
import { useState } from 'react';
const tf = require('@tensorflow/tfjs');
const use = require('@tensorflow-models/universal-sentence-encoder');

async function CloseNess(wordGoal, wordGuess) {
  const model = await use.load();
  const embeddings = (await model.embed([wordGoal, wordGuess])).unstack();
  const numGuess = tf.losses.cosineDistance(embeddings[0], embeddings[1], 0);
  const result = await numGuess.array();
  return result;
}

function getColor(value) {
  value = Math.abs(value-100)
  const hue = (1 - value / 100) * 120;
  const color = `hsl(${hue}, 80%, 50%)`;
  return { backgroundColor: color };
}

const GoalWord = "tree"

function Searchbar({value,onChange,onKeyDown}) {
      
  return(
    <input
    class = "searchbarTop" 
    type="text"
    value={value}
    onChange={onChange}
    onKeyDown={onKeyDown}
    />
    );
}

function TextConversation({TextItems}) {

  return (
    <ol class="Convo">
      {TextItems.sort((a, b) => b.score - a.score).map((ItemText, index) => ( //sort by score 
        <li key={index}>
          <div class="container" style={getColor(ItemText.score)}>
            <div class="left">{ItemText.text}</div>
            <div class="right">{ItemText.score}</div>
          </div>
        </li>
      ))}
    </ol>
  );
}

class TextAndScore {
  constructor(text) {
    this.text = text;
    this.score = null;
  }

  async calculateScore() {
    const score = await CloseNess(GoalWord, this.text);
    this.score = Math.abs((score*100) - 100).toFixed(2);
  }
}

function App() {

  const [WrittenText,ChangeWrittenText] = useState("")
  const [Conversation,ChangeConversation] = useState([])
  const [animationDuration,ChangeAnimationDuration] = useState(20)
  const [GuessCounter, ChangeGuessCounter] = useState(0)
  const [LoadingState, ChangeLoadingState] = useState("")
  
  function handleTextChange(event) {
    ChangeWrittenText(event.target.value)
  }

  async function handleKeyPress(event){
    if (event.key === 'Enter') {
      ChangeWrittenText("")

      const newText = new TextAndScore(WrittenText);
      await newText.calculateScore();
      const newConversation = [...Conversation, newText];

      ChangeConversation(newConversation)

      const newAnimationDuration = animationDuration - 1
      if (newAnimationDuration != 0) {

        ChangeAnimationDuration(newAnimationDuration)
        const NewGuessCounter = GuessCounter + 1
        ChangeGuessCounter(NewGuessCounter)
      }
    }
  }


  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" style={{ animationDuration: `${animationDuration}s` }} />
        <h2>
          Guess the word?
        </h2>
        <p> 
          Guesses = {GuessCounter}
        </p>
        <Searchbar value = {WrittenText} onChange = {handleTextChange} onKeyDown = {handleKeyPress}/>
        <TextConversation TextItems={Conversation} />

      </header>
    </div>
  );
}

export default App;

