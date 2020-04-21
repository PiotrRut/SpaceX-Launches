import React from 'react';
import './App.css';
import Nav from './components/Nav'
import { Typography } from '@material-ui/core';
import Button from "@material-ui/core/Button";
import GitHubIcon from '@material-ui/icons/GitHub';
import SpaceX from './components/SpaceX';
import Grid from '@material-ui/core/Grid'
import SpaceXSearch from './components/SpaceXSearch';


function App() {
  return (
    <div className="App">
        <Nav/>
        <Grid justify="center" container spacing={10}>
          <Grid item>
              <SpaceX/>
          </Grid>
          <Grid item>
              <SpaceXSearch/>
          </Grid>
        </Grid> 
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
