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

const styles = theme => ({
  root: {
    color: "white"
  },
  input: {
    color: "white"
  },
  cssLabel: {
    color : 'gray'
  },
});

class SpaceX extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      launches: [{}],
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
  }

  render() {
    const { classes } = this.props;
    if (this.state.launches === null) return null;
    return (
      <div>
        <br/>
        <Grid justify="center" container spacing={10}>
          <Grid item>
            <p>Launch schedule for the next 10 launches</p>
            { this.state.launches.filter(flight => (flight.flight_number <= this.state.launches[0].flight_number + 10))
              .map(flight => (
              <ExpansionPanel style={{width: '700px', backgroundColor: '#212121'}}>
                <ExpansionPanelSummary
                  expandIcon={<ExpandMoreIcon style={{ color: 'white' }} />}
                  aria-controls="panel1a-content"
                  id="panel1a-header"
                >
                  <Typography>
                    <i>{flight.mission_name}</i> - {moment(flight.launch_date_utc).format('D MMM YYYY')} 
                    </Typography>
                </ExpansionPanelSummary>
                <ExpansionPanelDetails style={{textAlign: 'left'}}>
                  {flight.details 
                  ? 
                  <Typography>
                    Rocket: {flight.rocket.rocket_name}
                    <br/> <br/>
                    {flight.details}
                  </Typography> 
                  : 
                  <Typography>
                    Rocket: {flight.rocket.rocket_name}
                    <br/> <br/>
                    No details available / TBA
                  </Typography>
                  }
                </ExpansionPanelDetails>
              </ExpansionPanel>
            ))
            }
          </Grid>
          <Grid item>
            <p>Search for a mission</p>
          <TextField
             className={classes.root}
             id="standard-basic"
             label="Mission name or date"
             style={{width: '220px'}}
             InputProps={{
              className: classes.input
             }}
             InputLabelProps={{
              classes: {
                root: classes.cssLabel,
              },
            }}
             />
          </Grid>
        </Grid>
      </div>
    )
  }
}

SpaceX.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles) (SpaceX);