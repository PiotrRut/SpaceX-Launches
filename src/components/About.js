import React from 'react';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button'
import GitHubIcon from '@material-ui/icons/GitHub';
import LanguageIcon from '@material-ui/icons/Language';

class About extends React.Component {
  render() {
    return (
      <div className="About">
        <Typography variant="h4">About</Typography>
        <br/>
        <Typography paragraph>
          This website was made for educational and fan purposes, and has no affiliation with&nbsp; 
          <a href="https://spacex.com">
            SpaceX.
          </a>
          &nbsp;
        </Typography>
        <Typography paragraph>
          The API used to gather information on this website is made by Jake Meyer, and can be found&nbsp;
          <a href="https://github.com/r-spacex/SpaceX-API">
          here.
          </a>
        </Typography>
        <Typography paragraph>All assets are accessed from and the property of SpaceX.</Typography>
        <Button style={{color: 'white'}} href="https://github.com/PiotrRut" startIcon={<GitHubIcon/>}>My Github</Button>
        <Button style={{color: 'white'}} href="https://prutkowski.tech" startIcon={<LanguageIcon/>}>My Website</Button>
      </div>
    );
  }
}


export default About;
