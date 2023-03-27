import React from 'react';
import { useState } from 'react';

function Searchbar({ changeword }) {
  const [value, setValue] = useState('');

  function onChange(e) {
    setValue(e.target.value);
  }

  function onKeyDown(e) {
    if (e.key == "Enter") {
      changeword(value);
      console.log(value)
    }
  }

  return (
    <input
      className="searchbarTop"
      type="text"
      value={value}
      onChange={onChange}
      onKeyDown={onKeyDown}
    />
  );
}

function ListAllWords({ mainword, itemstorender }){

      return (
        <div>
          <p>
            { mainword }
          </p>
          All items:
          <ul>
            {itemstorender.map((item, index) => (
              <li key={index.toString()}>
                {item}
              </li>
            ))}
          </ul>
        </div>
      );
    }

function RenderButton({ renderFunc , changemainword}){

    function handleClickRender() {
        console.log("clicked");
    
        fetch("http://localhost:5000/getwordandlist")  // Fetch data from the Flask app running on port 5000
        .then(response => {
            console.log("fetching");
            return response.json();  // Parse the response as JSON
        })
        .then(data => {
            renderFunc(data.wordlist.slice(0,20));
            changemainword(data.randomword)
            console.log("new word updated!");
        });
    }

    return(
        <button onClick={handleClickRender}>
            Click me to render items
        </button>
    )
}


function DeleteButton(){

  function handleDeleteClick() {
      console.log("clicked");
  
      fetch("http://localhost:5000/cleardb")  // Fetch data from the Flask app running on port 5000
      .then(response => {
          console.log("clearing");
          return response.text()
      })
      .then(data => {
          console.log(data);
      });
  }

  return(
      <button onClick={handleDeleteClick}>
          DELETE ALL DB
      </button>
  )
}

function SendRequest({ word }) {
  const addWord = async () => {

    try {
      const response = await fetch('http://localhost:5000/addword', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ word }),
      });

      const data = await response.json();

      if (response.status === 201) {
        console.log('Word and similar words added successfully:', data);
      } else {
        console.error('Error adding word and similar words:', data);
      }
    } catch (error) {
      console.error('Error sending request:', error);
    }
  };

  return (
    <div className="App">
      <button onClick={addWord}>Add Word and Similar Words</button>
    </div>
  );
}


function Admin() {

    const [allItems, changeAllItems ] =  useState([])
    const [textboxword, changetextboxword] = useState("")
    const [mainword, changemainword] = useState("")

    return (
        <div>
          <DeleteButton/>
            <h2>Admin page</h2>
            
            <Searchbar changeword = {changetextboxword}/>
            <SendRequest word={textboxword}/>
            
            <RenderButton renderFunc = {changeAllItems} changemainword = {changemainword}/>
            <ListAllWords mainword = {mainword} itemstorender={allItems}/>
            
            
        </div>
    );
    }

export default Admin;
  