import React from 'react';
import Typography from '@material-ui/core/Typography';
import axios from 'axios'
import Grid from '@material-ui/core/Grid'
import IconButton from '@material-ui/core/IconButton';
import { withStyles } from '@material-ui/styles';
import PropTypes from 'prop-types';
import moment from 'moment'
import Paper from '@material-ui/core/Paper'

import SwipeableViews from 'react-swipeable-views';
import { bindKeyboard } from 'react-swipeable-views-utils';
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos';
import ArrowForwardIosIcon from '@material-ui/icons/ArrowForwardIos';

import falcon9 from '../assets/falcon9.png'
import falcon1 from '../assets/falcon1.png'
import falconHeavy from '../assets/falconHeavy.png'
import starship3 from '../assets/starship3.png'

const styles = theme => ({
  root: { // set colour of the paper dialog
    backgroundColor: '#212121',
    color: 'white',
    width: '80vh',
    padding: '20px',
    margin: 'auto',
  }
});

const BindKeyboardSwipeableViews = bindKeyboard(SwipeableViews)

class Rockets extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      rockets: [],
      launches: [],
      selectedRocket: '',
      selRockName: '',
      dialogOpen: false,
      index: 0
    }
  }

  // Get list of all the rockets and append to array
  componentDidMount() {
    axios
      .get(`https://api.spacexdata.com/v3/rockets`)
      .then(res => {
        this.setState({ rockets: res.data })
      })
      .catch(error => console.error(error))

    axios
      .get(`https://api.spacexdata.com/v3/launches/past`)
      .then(res => {
        this.setState({ launches: res.data })
        console.log(this.state.launches)
      })
      .catch(error => console.error(error))
  }

  // Increment the index by one with each button press to show next rocket
  handleChangeForward = () => {
    this.setState(prevState => {
      return {index: prevState.index + 1}
   })
   if (this.state.index > 2) {
     this.setState({
       index: 0
     })
   }
  };

  // Decrement the index by one with each button press to show previous rocket
  handleChangeBack = () => {
    this.setState(prevState => {
      return {index: prevState.index - 1}
   })
   if (this.state.index < 1) {
     this.setState({
       index: 3
     })
   }
  };

  // Change rockets on index change
  handleChangeIndex = index => {
    this.setState({
      index,
    });
  };

  render() {
    let f9Launches = 0
    let fHeavyLaunches = 0
    let f1Launches = 0
    const { classes } = this.props;

    // Compute number of Falcon 9 launches
    this.state.launches.forEach(launch => {
      if (launch.flight_number >= 1 && launch.rocket.rocket_id === 'falcon9') {
        f9Launches += 1;
      }
    })

    // Compute number of Falcon Heavy launches
    this.state.launches.forEach(launch => {
      if (launch.flight_number >= 1 && launch.rocket.rocket_id === 'falconheavy') {
        fHeavyLaunches += 1;
      }
    })

    // Compute number of Falcon 1 launches
    this.state.launches.forEach(launch => {
      if (launch.flight_number >= 1 && launch.rocket.rocket_id === 'falcon1') {
        f1Launches += 1;
      }
    })

    return (
      <div className="Rockets">
        <Typography variant="h5" style={{marginBottom: '5px'}}>SpaceX Rockets</Typography>
        <Typography>
          Below are the planned and retired rockets, as well as current lineup!
        </Typography>
        <IconButton onClick={this.handleChangeBack} style={{color: 'white'}}><ArrowBackIosIcon/></IconButton>
          <IconButton onClick={this.handleChangeForward} style={{color: 'white'}}><ArrowForwardIosIcon/></IconButton>
        <br/>
          <SwipeableViews index={this.state.index} onChangeIndex={this.handleChangeIndex}>
          {
            this.state.rockets.map(rocket => (
              <Paper classes={classes}>
              <Grid container spacing={7}>

              {/* Rocket images */}
              <Grid item>
              {rocket.rocket_id === 'falcon9' && <img alt='falcon9' style={{ maxWidth: '22px', justifyContent: 'left'}} src={falcon9}/>}
              {rocket.rocket_id === 'falconheavy' && <img alt='falconHeavy' style={{ maxWidth: '55px', justifyContent: 'left'}} src={falconHeavy}/>}
              {rocket.rocket_id === 'falcon1' && <img alt='falcon1' style={{ maxWidth: '28px', justifyContent: 'left'}} src={falcon1}/>}
              {rocket.rocket_id === 'starship' && <img alt='falcon1' style={{ maxHeight: '300px', justifyContent: 'left'}} src={starship3}/>}
              </Grid>
              
              {/* Some information about the rocket */}
              <Grid item >
              <Typography align="left" variant="h4">{rocket.rocket_name}</Typography>
              {rocket.active && <Typography align="left" style={{color: 'green'}}>Active</Typography>}
              {(!rocket.active && rocket.success_rate_pct > 0) && <Typography align="left" style={{color: 'red'}}>Retired</Typography>}
              {(!rocket.active && rocket.success_rate_pct === 0) && <Typography align="left" style={{color: '#1976d2'}}>Planned</Typography>}
              <br/>
              <Typography align="left">First flight: {moment(rocket.first_flight).format('D MMM YYYY')}</Typography>
              <Typography align="left">Height: {rocket.height.meters}m / {rocket.height.feet}ft </Typography>
              <Typography align="left">Mass: {rocket.mass.kg}kg / {rocket.mass.lb}lbs</Typography>
              <Typography align="left">№ of stages: {rocket.stages}</Typography>
              <Typography align="left">Cost per launch: ${rocket.cost_per_launch}</Typography>

              {/* Number of launches of each rocket (excluding Amos-6 for F9) */}
              {
                rocket.rocket_id === "falcon1" ? <Typography align="left">№ of launches: {f1Launches}</Typography>
                : rocket.rocket_id === "falcon9" ? <Typography align="left">№ of launches: {f9Launches - 1}</Typography>
                : rocket.rocket_id === "falconheavy" ? <Typography align="left">№ of launches: {fHeavyLaunches}</Typography>
                : null
              }
              <br/>
              <Typography align="left"><a href={rocket.wikipedia}>Wikipedia article</a></Typography>
              </Grid>

              {/* Information about the payload and engines */}
              <Grid item>
                <Typography align="left">Engines: {rocket.engines.number}</Typography>
                <Typography align="left">Eng. type: {`${rocket.engines.type}`.charAt(0).toUpperCase() + `${rocket.engines.type}`.slice(1)}</Typography>
                <Typography align="left">Thrust: {rocket.engines.thrust_sea_level.kN}kN</Typography>
                <Typography align="left">Landing legs: {rocket.landing_legs.number}</Typography>
                {rocket.success_rate_pct > 0 && <Typography align="left">Success rate: {rocket.success_rate_pct}%</Typography>}
                <br/>
                <Typography align="left"><b>Payload limits:</b></Typography>
                {rocket.payload_weights.map(pl => (
                  <Typography align="left">{`${pl.id}`.toUpperCase()}: {pl.kg}kg</Typography>
                ))}
              </Grid>
              </Grid>
              </Paper>
            ))
          }
          </SwipeableViews>
      </div>
    );
  }
}

Rockets.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles) (Rockets);