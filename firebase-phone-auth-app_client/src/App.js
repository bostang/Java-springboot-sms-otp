import React from 'react';
import './App.css'; // You can keep or remove this
import PhoneAuth from './PhoneAuth';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>Firebase Phone Auth Demo</h1>
      </header>
      <main>
        <PhoneAuth />
      </main>
    </div>
  );
}

export default App;