import logo from './questionmark4.png';
import './App.css';
import { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';

import Admin from './Admin.js'; // Import the Admin component



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

function ButtonChange({onclick}) {

  return (
    <button onClick={onclick}>
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

function Home() {

  const [WrittenText,ChangeWrittenText] = useState("")
  const [Conversation,ChangeConversation] = useState([])
  const [animationDuration,ChangeAnimationDuration] = useState(20.0)
  const [GuessCounter, ChangeGuessCounter] = useState(0)
  // const [LoadingState, ChangeLoadingState] = useState("")
  const [LongList,ChangeLongList] = useState(["one","two","three"])


  function handleTextChange(event) {
    ChangeWrittenText(event.target.value)
  }

  //ChangeLongList
  //TODO UPDATE THE GUESS WORD

  function handlebuttonclick() {
    console.log("clicked");
  
    fetch("http://localhost:5000/getwordandlist")  // Fetch data from the Flask app running on port 5000
      .then(response => {
        console.log("fetching");
        return response.json();  // Parse the response as JSON
      })
      .then(data => {
        ChangeLongList(data.wordlist);
        console.log("new word updated!");
      });
  }

  async function handleKeyPress(event){
    if (event.key === 'Enter') {
      ChangeWrittenText("")

      const newText = new TextAndScore(WrittenText);
      await newText.calculateScore2(LongList);

      const newConversation = [...Conversation, newText];
      ChangeConversation(newConversation)

      const NewGuessCounter = GuessCounter + 1
      ChangeGuessCounter(NewGuessCounter)

      const newAnimationDuration = animationDuration - 1.0

      if (animationDuration > 1) {
        ChangeAnimationDuration(newAnimationDuration)
      }

    } else if (animationDuration <= 1 && animationDuration > 0.2) {  

      const newAnimationDuration = animationDuration - 0.1
      ChangeAnimationDuration(newAnimationDuration)
    }

  }


  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" style={{ animationDuration: `${animationDuration}s` }} />
        <h2>
          Guess the word? 
        </h2>
        <Link to="/admin">admin</Link>
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


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home/>} />
        <Route path="/admin" element={<Admin/>} />
      </Routes>
    </Router>
  );
}


export default App;
