import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { debounce } from 'lodash';

const SearchComponent = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [error, setError] = useState(null);
  const [history, setHistory] = useState([]);

  const debouncedSearch = useCallback(
    debounce(async (searchQuery) => {
      try {
        setLoading(true);
        const response = await axios.get(`/api/search?q=${searchQuery}`);
        // sanitize api inputs  query value is sanitized before sending 
        // it prevents the  injection attacks
        setResults(response.data);
      } catch {
      }    // the catch block in debouncedSearch is empty. you should  set the error or consolelog 
           // the  error to help the  debugging
    }, 300),
    [] // debounce search has an empty  dependency array but it uses setLoading and setResults
       // adding  that to the  dependency array will ensure  proper behaviour 
  );

  useEffect(() => {
    const savedHistory = localStorage.getItem('searchHistory');
    if (savedHistory) {
      setHistory(JSON.parse(savedHistory));
    }
  }, []);

  useEffect(() => {
    if (selectedItem) {
      const element = document.getElementById('selected-item');//direct dom manipulation and setting
      // innerhtml not  the correct way of react declarative  nature// instead  conditionally render 
      element.innerHTML = selectedItem.description;
    }
  }, [selectedItem]);

  useEffect(() => {
    const handleResize = () => {
      console.log(window.innerWidth);
    }; // for  the resize event listener ,consider  cleaning  up the event listener in
       //  in a return statement

    window.addEventListener('resize', handleResize);
  }, []); // a throttle mechanism  can be  used  for optimizing the code

  const handleSearch = (event) => {
    const value = event.target.value;
    setQuery(value);
    debouncedSearch(value);
  };  //we can memoize the  function using usememo

  const handleSelect = (item) => {
    setSelectedItem(item);
    setHistory([...history, item]);
    localStorage.setItem('searchHistory', JSON.stringify(history));
  }; // Avoid directly using the  current history state in the localStorage.setItem. use the
     // updated state

  return (
    <div className="search-container">
      <input
        type="text"
        value={query}
        onChange={handleSearch}
        placeholder="Search..."
      />

      <div className="results">
        {results.map(item => (
          // add key props to the map to avoid rendering issues
          
          <div 
            className="result-item"
            onClick={() => handleSelect(item)}
          >  
           
            <img src={item.thumbnail} className="thumbnail" />   
                        
            <div className="details">
              <h3>{item.title}</h3>
              <p>{item.subtitle}</p>
            </div>
          </div>
        ))}
      
      </div>
    
      {selectedItem && (
        <div id="selected-item" className="selected" />
      )}

      <div className="history">
        <h4>Search History</h4>
        {history.map(item => (
          <div className="history-item">
            {item.title}
          </div> // add key props to the map to avoid rendering issues
        ))}
      </div>
    </div>
  );
};

export default SearchComponent;

// coding structure  comments
// the api calls can be  structured  and can be done  from different  page
//  memoize the  expensive calculations when using result or history using use memo
//display the error to the user  when an error occurs
// images  can be  lazy loaded
// loading state   can be  given 
//avoid  inline event handlers
