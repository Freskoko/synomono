import logo from './questionmark4.png';
import './App.css';
import { useState } from 'react';
import textfile from './savedwordsforSong.txt'

function getColor(value) {
  let hue;
  if (value === 0) {
    hue = 120; // very green
  } else if (value === 70000) {
    hue = 0; // red
  } else if (value < 500) {
    hue = 120; // green
  } else {
    value = Math.max(500, Math.min(70000, value)); // ensure value is between 500 and 70000
    hue = (1 - (value - 500) / 69500) * 50; // calculate hue between green and red
  }
  const color = `hsl(${hue}, 80%, 50%)`;
  return { backgroundColor: color };
}

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
      {TextItems.sort((a, b) => a.score - b.score).map((ItemText, index) => ( //sort by score 
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

async function readTextFile(file) {
  const response = await fetch(file);
  const text = await response.text();
  return text.split('\n');
}

function ButtonChange({onclick}) {

  return (
    <button onPointerEnter={onclick}>
      Load words
    </button> 
  )
}

class TextAndScore {
  constructor(text) {
    this.text = text;
    this.score = null;
  }

  async calculateScore2(LongList) {

    const val = LongList.indexOf(this.text)
    const longint = 70000
    
    if (val < 0) {
      this.score = longint
    }

    else{
      this.score = val
    }
    }
}

function App() {

  const [WrittenText,ChangeWrittenText] = useState("")
  const [Conversation,ChangeConversation] = useState([])
  const [animationDuration,ChangeAnimationDuration] = useState(20)
  const [GuessCounter, ChangeGuessCounter] = useState(0)
  // const [LoadingState, ChangeLoadingState] = useState("")
  const [LongList,ChangeLongList] = useState(["one","two","three"])


  function handleTextChange(event) {
    ChangeWrittenText(event.target.value)
  }

  async function handlebuttonclick() {
    fetch(textfile)
    .then((response) => response.text())
    .then((textContent) => {
      const lines = textContent.replaceAll("\r","").split("\n") 
      ChangeLongList(lines)

      console.log(lines.length)
      console.log(lines)
    })

  }

  async function handleKeyPress(event){
    if (event.key === 'Enter') {
      ChangeWrittenText("")

      const newText = new TextAndScore(WrittenText);
      await newText.calculateScore2(LongList);
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
        <div>
        <ButtonChange onclick = {handlebuttonclick}/>
        </div>
        <p> 
          Guesses = {GuessCounter}
        </p>
        <Searchbar value = {WrittenText} onChange = {handleTextChange} onKeyDown = {handleKeyPress}/>
        <TextConversation TextItems={Conversation} />

        <p>
          
        </p>

      </header>
    </div>
  );
}

export default App;
