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

const styles = theme => ({
  root: {
    color: "white",
    width: '100%',
  },
  input: {
    color: "white"
  },
  cssLabel: {
    color : 'gray'
  },
});

class SpaceXList extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      launches: [{}],
      allLaunches: [{}],
      selected: '',
      itemSelected: false,
    }
  }

  componentDidMount() {
    axios
      .get(`https://api.spacexdata.com/v3/launches/upcoming`)
      .then(res => {
        this.setState({ launches: res.data })
        console.log(this.state.launches)
      })
      .catch(error => console.error(error))

    axios
      .get(`https://api.spacexdata.com/v3/launches/`)
      .then(res => {
        this.setState({ allLaunches: res.data })
        console.log(this.state.allLaunches)
      })
      .catch(error => console.error(error))
  }


  handleInput = (e) => {
    this.setState({ allLaunches: e.target.value })
  }

  render() {
    const { classes } = this.props;
    if (this.state.launches === null) return null;
    return (
      <div className={classes.root}>
        <br/>
            <Typography paragraph>Launch schedule for the next 10 launches</Typography>
            {/* Filter the array to only return the next ten launches, and display their details inside the panel */}
            { this.state.launches.filter(flight => (flight.flight_number <= this.state.launches[0].flight_number + 9))
              .map(flight => (
              <ExpansionPanel style={{ maxWidth: '700px', backgroundColor: '#212121', marginLeft: '5px', marginRight: '5px'}}>
                <ExpansionPanelSummary
                  expandIcon={<ExpandMoreIcon style={{ color: 'white' }} />}
                  aria-controls="panel1a-content"
                  id="panel1a-header"
                >
                  {/* Launches with unconfirmed date (quarterly or yearly precision) will be marked as such */}
                  {flight.tentative_max_precision === 'quarter' || flight.tentative_max_precision === 'year' ?
                  <Typography style={{ color: '#d32f2f'}}>
                    <i>{flight.mission_name}</i> - Date: TBC (NET {flight.launch_year})
                  </Typography> 
                  :
                  <Typography>
                    <i>{flight.mission_name}</i> - {moment(flight.launch_date_utc).format('D MMM YYYY')} 
                  </Typography>                                
                  }
                </ExpansionPanelSummary>
                <ExpansionPanelDetails style={{textAlign: 'left'}}>
                  {flight.details 
                  ? 
                  <Typography>
                    Rocket: {flight.rocket.rocket_name}
                    <br/> <br/>
                    {flight.details}
                    <br/> <br/>
                    Launch: {moment(flight.launch_date_utc).format('D MMM YYYY, h:mm:ss A')} UTC
                    <br/>
                    Launching from {flight.launch_site.site_name_long}
                    <br/>
                    {flight.links.reddit_campaign && <a href={flight.links.reddit_campaign}>Reddit thread</a>}
                  </Typography> 
                  : 
                  <Typography>
                    Rocket: {flight.rocket.rocket_name}
                    <br/> <br/>
                    No details provided yet
                  </Typography>
                  }
                </ExpansionPanelDetails>
              </ExpansionPanel>
            ))
            }
      </div>
    )
  }
}

SpaceXList.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles) (SpaceXList);