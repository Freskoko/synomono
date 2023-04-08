import logo from './questionmark4.png';
import './App.css';
import { useState, useEffect } from 'react';
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

//TODO
function Overlay({ onClose, onWordClick  }) {

  const [AllWords,ChangeAllWords] = useState([])

  useEffect(() => {
    fetch("http://localhost:5000/getallwordsid")
      .then((response) => {
        console.log("fetching");
        return response.json();
      })
      .then((data) => {
        ChangeAllWords(data.wordlist);
        console.log("AllWords");
      });
  }, []);

  function HandleButtonClickChangeLongList(id) {
    fetch("http://localhost:5000/getsimilarwordsfromid", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ word_id: id }),
    }).then((response) => {
      console.log("fetching getsimilarwordsfromid");
      return response.json();
    })
    .then((data) => {
      // Call the onWordClick prop to update the LongList state in the Home component
      onWordClick(data.wordlist);
      console.log("AllWords");
    });
  }

// ... rest of the Overlay component



  return (
    <div className="overlay">
      <div className="overlay-content">
        <h2>Available Words</h2>
        <ul>
          {AllWords.map((word, index) => (
            <li 
              key={index}>
              
              <button onClick={() => HandleButtonClickChangeLongList(word)}>{word}</button>
            
            </li>
          ))}
        </ul>
        <button onClick={onClose}>Close</button>
      </div>
    </div>
  );
}

function Home() {

  const [WrittenText,ChangeWrittenText] = useState("")
  const [Conversation,ChangeConversation] = useState([])
  const [animationDuration,ChangeAnimationDuration] = useState(20.0)
  const [GuessCounter, ChangeGuessCounter] = useState(0)
  const [LongList,ChangeLongList] = useState(["one","two","three"])
  const [answerToQuestion,setanswerToQuestion] = useState("answer")

  const [showOverlay, setShowOverlay] = useState(false);

  function toggleOverlay() {
    setShowOverlay(!showOverlay);
  }


  function handleWordClick(word) {
    ChangeLongList(word);
  }


  function handleTextChange(event) {
    ChangeWrittenText(event.target.value)
  }

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

  function GuessedSearchbar({ setanswerToQuestion }) {
    const [Guessed, setGuessed] = useState("Ask a question about the word");
  
    function handleChange(event) {
      setGuessed(event.target.value);
      // console.log(Guessed)
    }

    async function HandleGuessChange(event){
      if (event.key === 'Enter') {

        console.log(Guessed)

        try {
          const response = await fetch('http://localhost:5000/answerquestion', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ question:Guessed, word:LongList[0] }),

          });
    
          const data = await response.json();
    
          if (response.status === 200) {
            console.log('Asked question, got this back:', data);
            setanswerToQuestion(data.answer)
          } else {
            console.error('Error asking question got this back:', data);
          }
        } catch (error) {
          console.error('Error sending request:', error);
        }
        
        setGuessed("is the word ")
      }
    }
  
    return (
      <input
        className="searchbarTopLong"
        type="text"
        value={Guessed}
        onChange={handleChange}
        onKeyDown={HandleGuessChange}
      />
    );
  }


  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" style={{ animationDuration: `${animationDuration}s` }} />
        {showOverlay && (
          <Overlay onClose={toggleOverlay} words={LongList} onWordClick={handleWordClick} />
        )}
        
        <h2>
          Guess the word? 
        </h2>
        <button onClick={toggleOverlay}>Show Available Words</button>
        {/* Searchbar({value,onChange,onKeyDown}) */}
        <div className="sidebar">
          <GuessedSearchbar setanswerToQuestion = {setanswerToQuestion}/>
          <p>{ answerToQuestion }</p>
        </div>

        {/* <Link to="/admin">admin</Link> */}
        <div>
        <ButtonChange onclick = {handlebuttonclick}/>
        </div>
        <div className = "sidebarguesses"> 
          <p> 
            Guesses = {GuessCounter}
          </p>
        </div>
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
