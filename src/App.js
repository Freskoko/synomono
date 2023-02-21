import logo from './questionmark4.png';
import './App.css';
import { useState } from 'react';


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
          <div class="container">
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
    this.text = text
    
    const score = Math.floor(Math.random() * (1000 - 100) + 100) / 1000;
    this.score = score
  }
}


function App() {

  const [WrittenText,ChangeWrittenText] = useState("")
  const [Conversation,ChangeConversation] = useState([])
  const [animationDuration,ChangeAnimationDuration] = useState(20)
  
  function handleTextChange(event) {
    ChangeWrittenText(event.target.value)
  }

  function handleKeyPress(event){
    if (event.key === 'Enter') {
      ChangeWrittenText("")

      const newText = new TextAndScore(WrittenText)
      const newConversation = [...Conversation, newText]

      ChangeConversation(newConversation)


      const newAnimationDuration = animationDuration - 1
      if (newAnimationDuration != 0) {

        ChangeAnimationDuration(newAnimationDuration)
      }

    }
  }


  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" style={{ animationDuration: `${animationDuration}s` }} />
        <h1>
          Guess the word?!
        </h1>
        <Searchbar value = {WrittenText} onChange = {handleTextChange} onKeyDown = {handleKeyPress}/>
        <TextConversation TextItems={Conversation} />

      </header>
    </div>
  );
}

export default App;

