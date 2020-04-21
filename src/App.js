import React from 'react';
import './App.css';
import Nav from './components/Nav'
import { Typography } from '@material-ui/core';
import Button from "@material-ui/core/Button";
import GitHubIcon from '@material-ui/icons/GitHub';
import SpaceX from './components/SpaceX';


function App() {
  return (
    <div className="App">
        <Nav/>
        <SpaceX/>
        <br/>
        <Button href={"https://github.com/PiotrRut/SpaceX-Launches"}
          startIcon={<GitHubIcon/>}
          style={{color: 'white'}}>
            GitHub Repo
        </Button>
    </div>
  );
}

export default App;
