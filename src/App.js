import React from 'react';
import './App.css';
import Nav from './components/Nav'
import { Typography } from '@material-ui/core';
import Button from "@material-ui/core/Button";
import GitHubIcon from '@material-ui/icons/GitHub';
import SpaceXList from './components/SpaceXList';
import Grid from '@material-ui/core/Grid'
import SpaceXSearch from './components/SpaceXSearch';



function App() {
  return (
    <div className="App">
        <Nav/>
        <Grid justify="center" align-content="center" container spacing={10}>
          <Grid item className="List">
              <SpaceXList/>
          </Grid>
          <Grid item className="Search">
              <SpaceXSearch/>
          </Grid>
        </Grid> 
        <br/> <br/>
        <p>
          This site is not affiliated with <a href="http://spacex.com">SpaceX</a>.
          API by <a href="https://github.com/r-spacex/SpaceX-API">r-spacex.</a>
        </p>
    </div>
  );
}

export default App;
