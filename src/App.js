import React from 'react';
import logo from './logo.svg';
import './App.css';
import useToast from './uses/useToast'

function App() {
  const toast = useToast()
  return (
    <div className="App">
      <header className="App-header">
        {/* <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a> */}
      </header>
      <button onClick={() => {
        toast.show('hello', 1000)
      }}>test</button>
    </div>
  );
}

export default App;
