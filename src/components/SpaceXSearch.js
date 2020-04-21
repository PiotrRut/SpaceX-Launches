import React from "react"
import Grid from "@material-ui/core/Grid"
import axios from "axios"
import '../App.css'
import moment from 'moment'

import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import TextField from '@material-ui/core/TextField';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/styles';
import Autocomplete from '@material-ui/lab/Autocomplete';
import Paper from '@material-ui/core/Paper'

const styles = theme => ({
  root: {
    color: "white",
    width: '100%'
  },
  input: {
    color: "white"
  },
  cssLabel: {
    color : 'gray'
  },
  paper: { // set colour of the paper dropdown
    backgroundColor: '#212121',
    color: 'white'
  },
  clearIndicator: { // set colour of the clear button
    color: 'white'
  },
  popupIndicator: { // set colour of the dropdown button
    color: 'white'
  },
  noOptions: { // set colour to the text when there are no options returned from search
    color: 'white'
  },
});

// Search functionality for displaying information about any mission searched by the user
class SpaceXSearch extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      allLaunches: [{}],
      selected: '',
      itemSelected: false,
    }
  }

  // Get all launches and add to local array
  componentDidMount() {
    axios
      .get(`https://api.spacexdata.com/v3/launches/`)
      .then(res => {
        this.setState({ allLaunches: res.data })
        console.log(this.state.allLaunches)
      })
      .catch(error => console.error(error))
  }

  // Handle the input from the search box and update state to the currently selected mission
  handleInput = (e) => {
    this.setState({selected: e.target.textContent })
  }

  render() {
    const { classes } = this.props;
    {/* Filter the array to only return the details about the currently selected mission */}
    {/* Launches with unconfirmed date (quarterly or yearly precision) will be marked as such */}
    const selectedLaunch = this.state.allLaunches.filter(launch => launch.mission_name === this.state.selected)
            .map(launch => ( 
              launch.tentative_max_precision === 'quarter' || launch.tentative_max_precision === 'year' ?
                  <p style={{ color: '#d32f2f'}}>
                    {launch.details ? launch.details : 'No details provided'}
                    <br/> <br/>
                    Launch: TBC (NET {launch.launch_year})
                  </p>
                  :
                  <p>
                    {/* Add the mission badge at the top of the results */}
                    {launch.links.mission_patch_small && <img alt='patch' style={{ maxWidth: '80px', justifyContent: 'center'}} src={launch.links.mission_patch_small}/>}
                    <br/> <br/>
                    {launch.details ? launch.details : 'No details provided yet'}
                    <br/> <br/>
                    Launch: {moment(launch.launch_date_utc).format('D MMM YYYY, h:mm:ss A')} UTC
                    <br/>
                    Launch site: {launch.launch_site.site_name_long}
                  </p>                            
             ))
    return (
      <div className={classes.root}>
        <br/>
            <p>Filter missions (completed or upcoming)</p>
            <Autocomplete
              id="combo-box-demo"
              classes={classes}
              onChange={this.handleInput}
              options={this.state.allLaunches}
              getOptionLabel={(option) => option.mission_name}
              style={{maxWidth: '400px'}}
              renderInput={(params) =>
                <TextField
                  {...params}
                  className={classes.root}
                  id="standard-basic"
                  label="Start typing the mission name..."
                  style={{maxWidth: '400px'}}
                  InputProps={{
                    ...params.InputProps,
                    className: classes.input
                  }}
                  InputLabelProps={{
                    classes: {
                      root: classes.cssLabel,
                    },
                  }}
                />   
              }
            />
            { selectedLaunch.length > 0
            &&
            <Paper elevation={3} style={{ background: '#212121', padding: '20px', marginTop: '10px', maxWidth: '360px'}}>
             {selectedLaunch} 
            </Paper>
            }
      </div>
    )
  }
}

SpaceXSearch.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles) (SpaceXSearch);