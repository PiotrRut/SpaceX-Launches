import React from "react"
import Grid from "@material-ui/core/Grid"
import axios from "axios"
import '../App.css'
import moment from 'moment'
import Dialog from '@material-ui/core/Dialog'
import DialogTitle from '@material-ui/core/DialogTitle'
import DialogContent from '@material-ui/core/DialogContent'
import Button from '@material-ui/core/Button'
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/styles';
import Autocomplete from '@material-ui/lab/Autocomplete';
import Paper from '@material-ui/core/Paper'
import RedditIcon from '@material-ui/icons/Reddit';
import YouTubeIcon from '@material-ui/icons/YouTube';
import IconButton from '@material-ui/core/IconButton'

import falcon9 from '../assets/falcon9.png'
import falcon1 from '../assets/falcon1.png'
import falconHeavy from '../assets/falconHeavy.png'


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
      dialogOpen: false,
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

  // Opening the info dialog
  openDialog = () => {
    this.setState({ dialogOpen: true })
  }
  // Closing the info dialog
  closeDialog = () => {
    this.setState({ dialogOpen: false })
  }

  render() {
    const { classes } = this.props;
    {/* Filter the array to only return the details about the currently selected mission */}
    {/* Launches with unconfirmed date (quarterly or yearly precision) will be marked as such */}
    const selectedLaunch = 
    this.state.allLaunches.filter(launch => launch.mission_name === this.state.selected)
      .map(launch => ( 
        launch.tentative_max_precision === 'quarter' || launch.tentative_max_precision === 'year' ?
          <p style={{ color: '#d32f2f'}}>
            {launch.details ? launch.details : 'No details provided for this launch'}
            <br/> <br/>
            Launch: TBC (NET {launch.launch_year})
          </p>
          :
          <p>
            {/* Add the mission badge at the top of the results */}
            {launch.links.mission_patch_small && <img alt='patch' style={{ maxWidth: '80px', justifyContent: 'center', marginBottom: '8px'}} src={launch.links.mission_patch_small}/>}
            <br/>

            {/* If landing has failed and fell in the water */}
            {(!launch.upcoming && launch.rocket.first_stage.cores[0].landing_type === 'Ocean' && !launch.rocket.first_stage.cores[0].land_success) &&
              <p style={{color: '#d32f2f'}}>
                Water Landing - Failed
              </p>
            }
            {/* If landing has failed */}                  
            {(!launch.upcoming && !launch.rocket.first_stage.cores[0].land_success && launch.rocket.first_stage.cores[0].landing_type === 'ASDS') && 
              <p style={{color: '#d32f2f'}}>
                Landing Failed
              </p>
            }
            {/* If launch has failed */}
            {(!launch.upcoming && !launch.launch_success) && 
              <p style={{color: '#d32f2f'}}>
                Launch Failed
              </p>
            }
            {/* If landing has been successfull and fell in the water */}
            {(!launch.upcoming && launch.rocket.first_stage.cores[0].land_success && launch.rocket.first_stage.cores[0].landing_type === 'Ocean') && 
              <p style={{color: '#1976d2'}}>
                Water Landing - Successful
              </p>
            }
            {/* If landing has been sucessfull */}
            {(!launch.upcoming && launch.rocket.first_stage.cores[0].land_success && launch.rocket.first_stage.cores[0].landing_type !== 'Ocean') && 
              <p style={{color: '#388e3c'}}>
                Landing Successful
              </p>
            }

            {launch.details ? launch.details : 'No details provided for this launch'}
            <br/> <br/> 
            Launch: {moment(launch.launch_date_utc).format('D MMM YYYY, h:mm:ss A')} UTC
            <br/>
            Launch site: {launch.launch_site.site_name_long}
          </p>                            
      ))
    return (
      <div className={classes.root}>
        <br/>
        <Typography paragraph>Filter missions (completed and future) &nbsp;</Typography>
        <Autocomplete
          id="combo-box-demo"
          classes={classes}
          onChange={this.handleInput}
          options={this.state.allLaunches}
          getOptionLabel={(option) => option.mission_name}
          clearOnEscape
          style={{maxWidth: '420px'}}
          renderInput={(params) =>
            <TextField
              {...params}
              className={classes.root}
              id="standard-basic"
              label="Start typing the mission name..."
              style={{maxWidth: '420px'}}
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
        <Paper elevation={3} style={{ background: '#212121', padding: '20px', marginTop: '10px', maxWidth: '380px'}}>
          {selectedLaunch} 
          <Button variant="outlined" onClick={this.openDialog} color="primary">More info</Button>
        </Paper>
        }

        {/* Information dialog for the currently selected misson ("More info" button) */}
        <Dialog
        open={this.state.dialogOpen}
        onClose={this.closeDialog}
        aria-labelledby="form-dialog-title"
        classes={classes}
        fullWidth
        maxWidth="sm"
        >
          <DialogTitle id="form-dialog-title">{this.state.selected} - Mission Information</DialogTitle>
          <DialogContent>
            { this.state.allLaunches.filter(launch => launch.mission_name === this.state.selected)
            .map(launch => ( 
              <div>
                <Grid container spacing={6}> 

                  {/* Rocket images for mission info dialog */}
                  <Grid item>
                    {launch.rocket.rocket_id === 'falcon9' && <img alt='falcon9' style={{ maxWidth: '22px', justifyContent: 'left'}} src={falcon9}/>}
                    {launch.rocket.rocket_id === 'falconheavy' && <img alt='falconHeavy' style={{ maxWidth: '53px', justifyContent: 'left'}} src={falconHeavy}/>}
                    {launch.rocket.rocket_id === 'falcon1' && <img alt='falcon1' style={{ maxWidth: '25px', justifyContent: 'left'}} src={falcon1}/>}
                  </Grid>

                  {/* More information about the currently selected mission */}
                  <Grid item>
                    {launch.links.mission_patch_small && <img alt='patch' style={{ maxWidth: '70px', marginBottom: '20px'}} src={launch.links.mission_patch_small}/>}
                    <Typography>{moment(launch.launch_date_utc).format('D MMM YYYY, h:mm A')} UTC</Typography>
                    <Typography>Site: {launch.launch_site.site_name}</Typography>

                    {/* Was the launch/landing successfull? */}
                    {launch.rocket.first_stage.cores[0].land_success && <Typography style={{color: 'green'}}>Landed</Typography>}
                    {(!launch.upcoming && !launch.rocket.first_stage.cores[0].land_success && launch.rocket.first_stage.cores[0].landing_intent) && <Typography style={{color: 'red'}}>Landing Failed</Typography>}
                    {(!launch.upcoming && !launch.launch_success) && <Typography style={{color: 'red'}}>Launch Failed</Typography>}
                    {launch.upcoming && <Typography style={{color: '#1976d2'}}>Upcoming Mission</Typography>}
                    <br/>

                    {/* Links */}
                    <IconButton style={{color:'white', marginLeft:'-13px'}} href={launch.links.reddit_campaign}>
                      <RedditIcon/>
                    </IconButton>
                    <IconButton style={{color:'white'}} href={launch.links.video_link}>
                      <YouTubeIcon/>
                    </IconButton>
                  </Grid>

                  {/* Information about the payload and the rocket */}
                  <Grid item>
                    <Typography>
                      Rocket:&nbsp;
                        {launch.rocket.rocket_name}&nbsp;
                        {launch.rocket.rocket_type}&nbsp;
                        {launch.rocket.first_stage.cores[0].block && `B${launch.rocket.first_stage.cores[0].block}`}
                    </Typography>
                    <Typography>Booster: {launch.rocket.first_stage.cores[0].core_serial}</Typography>
                    <Typography>No. of flights at launch: {launch.rocket.first_stage.cores[0].flight}</Typography>
                    {
                    launch.rocket.first_stage.cores[0].landing_intent ?
                    <Typography>Landing intended: YES</Typography> :
                    <Typography>Landing intended: NO</Typography>
                    }
                    {
                      launch.rocket.first_stage.cores[0].reused ?
                      <Typography>Reused: YES</Typography> :
                      <Typography>Reused: NO</Typography>
                    }
                    <br/>
                    <Typography>Payload: {launch.rocket.second_stage.payloads[0].payload_type}</Typography>
                    {
                      launch.rocket.second_stage.payloads[0].payload_mass_kg && 
                      <Typography>Mass: {launch.rocket.second_stage.payloads[0].payload_mass_kg}kg</Typography>
                    }
                    <Typography>Orbit: {launch.rocket.second_stage.payloads[0].orbit}</Typography>
                    <Typography>Customer: {launch.rocket.second_stage.payloads[0].customers[0]}</Typography>
                  </Grid>
                </Grid>
              </div>
            ))
            }
          </DialogContent>
        </Dialog>
      </div>
    )
  }
}

SpaceXSearch.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles) (SpaceXSearch);