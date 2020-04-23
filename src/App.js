import React from 'react';
import './App.css';
import Nav from './components/Nav'
import Home from './pages/Home'


export default function App() {
  return (
    <div className="App">
        <Nav/>
        <Home/>
    </div>
  );
}
