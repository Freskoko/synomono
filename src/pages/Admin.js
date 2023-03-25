import React from 'react';
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

function ListAllWords({ itemstorender }){

      return (
        <div>
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

function RenderButton({ renderFunc }){

    function handleClickRender() {
        console.log("clicked");
    
        fetch("http://localhost:5000/longlist")  // Fetch data from the Flask app running on port 5000
        .then(response => {
            console.log("fetching");
            return response.json();  // Parse the response as JSON
        })
        .then(data => {
            renderFunc(data.listofwords.slice(0,20));
            console.log("new word updated!");
        });
    }

    return(
        <button onClick={handleClickRender}>
            Click me to render items
        </button>
    )
 }

  

function Admin() {

    const [allItems, changeAllItems ] =  useState([])

    return (
        <div>
            <h2>Admin page</h2>
            <Searchbar/>
            <RenderButton renderFunc = {changeAllItems}/>
            <ListAllWords itemstorender={allItems}/>
            
        </div>
    );
    }

export default Admin;
  