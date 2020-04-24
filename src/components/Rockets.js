import React from 'react';
import Typography from '@material-ui/core/Typography';
import axios from 'axios'
import Grid from '@material-ui/core/Grid'
import Button from '@material-ui/core/Button'
import { withStyles } from '@material-ui/styles';
import Dialog from '@material-ui/core/Dialog'
import DialogTitle from '@material-ui/core/DialogTitle'
import DialogContent from '@material-ui/core/DialogContent'
import PropTypes from 'prop-types';
import moment from 'moment'

import falcon9 from '../assets/falcon9.png'
import falcon1 from '../assets/falcon1.png'
import falconHeavy from '../assets/falconHeavy.png'
import starship from '../assets/starship.png'
import starship2 from '../assets/starship2.png'
import starship3 from '../assets/starship3.png'

const styles = theme => ({
  paper: { // set colour of the paper dialog
    backgroundColor: '#212121',
    color: 'white'
  }
});

class Rockets extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      rockets: [{}],
      selectedRocket: '',
      selRockName: '',
      dialogOpen: false
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
    return (
      <div className="About">
        <Typography variant="h5" style={{marginBottom: '5px'}}>SpaceX Rockets</Typography>
        <Typography>
          Below are the planned and retired rockets, as well as current lineup (not to scale)
        </Typography>
        <br/>
        <Grid container justify="center" direction="row" alignItems="flex-end" spacing={2}>
          {
            this.state.rockets.map(rocket => (
              <Grid item sm={2} xs={3}> 
                {rocket.rocket_id === 'falcon1' && <img alt='falcon1' style={{ maxWidth: '22px', justifyContent: 'bottom'}} src={falcon1}/>}
                {rocket.rocket_id === 'falcon9' && <img alt='falcon9' style={{ maxWidth: '23px', justifyContent: 'bottom'}} src={falcon9}/>}
                {rocket.rocket_id === 'falconheavy' && <img alt='falconheavy' style={{ maxHeight: '310px', justifyContent: 'bottom'}} src={falconHeavy}/>}
                {rocket.rocket_id === 'starship' && <img alt='starship' style={{ maxHeight: '430px', justifyContent: 'bottom'}} src={starship3}/>}
                <Typography>{rocket.rocket_name}</Typography>
                {rocket.active && <Typography style={{color: 'green'}}>ACTIVE</Typography>}
                {(!rocket.active && rocket.success_rate_pct > 0) && <Typography style={{color: 'red'}}>RETIRED</Typography>}
                {(!rocket.active && rocket.success_rate_pct === 0) && <Typography style={{color: '#1976d2'}}>PLANNED</Typography>}
                <Button 
                  size="small"
                  style={{color:'white'}}
                  key={rocket.rocket_id} 
                  onClick={() => { this.setState({ selectedRocket: rocket.rocket_id, selRockName: rocket.rocket_name}, () => { this.openDialog()})} }
                >
                  Info
                </Button>
              </Grid>
            ))
          }
        </Grid>


        {/* Information dialog for the currently selected rocket ("More info" button) */}
        <Dialog
        open={this.state.dialogOpen}
        onClose={this.closeDialog}
        aria-labelledby="form-dialog-title"
        classes={classes}
        fullWidth
        scroll="body"
        maxWidth="sm"
        >
          <DialogContent style={{ overflow: "hidden"}}>
            { this.state.rockets.filter(rocket => rocket.rocket_id === this.state.selectedRocket)
            .map(rocket => ( 
              <div>
                <Grid container spacing={7}> 

                  {/* Rocket images for rocket info dialog */}
                  <Grid item>
                    {rocket.rocket_id === 'falcon9' && <img alt='falcon9' style={{ maxWidth: '22px', justifyContent: 'left'}} src={falcon9}/>}
                    {rocket.rocket_id === 'falconheavy' && <img alt='falconHeavy' style={{ maxWidth: '55px', justifyContent: 'left'}} src={falconHeavy}/>}
                    {rocket.rocket_id === 'falcon1' && <img alt='falcon1' style={{ maxWidth: '28px', justifyContent: 'left'}} src={falcon1}/>}
                    {rocket.rocket_id === 'starship' && <img alt='falcon1' style={{ maxHeight: '300px', justifyContent: 'left'}} src={starship3}/>}
                  </Grid>

                  {/* More information about the currently selected rocket */}
                  <Grid item>
                    <Typography variant="h5">{rocket.rocket_name}</Typography>
                    {rocket.active && <Typography style={{color: 'green'}}>Active</Typography>}
                    {(!rocket.active && rocket.success_rate_pct > 0) && <Typography style={{color: 'red'}}>Retired</Typography>}
                    {(!rocket.active && rocket.success_rate_pct === 0) && <Typography style={{color: '#1976d2'}}>Planned</Typography>}
                    <br/>
                    <Typography>First flight: {moment(rocket.first_flight).format('D MMM YYYY')}</Typography>
                    <Typography>Height: {rocket.height.meters}m / {rocket.height.feet}ft </Typography>
                    <Typography>Mass: {rocket.mass.kg}kg / {rocket.mass.lb}lbs</Typography>
                    <Typography>№ of stages: {rocket.stages}</Typography>
                    <Typography>Cost p/ launch: ${rocket.cost_per_launch}</Typography>
                    <br/>
                    <Typography><a href={rocket.wikipedia}>Wikipedia article</a></Typography>
                  </Grid>

                  {/* Information about the payload and engines */}
                  <Grid item>
                    <Typography>Payloads weights:</Typography>
                    <br/>
                    {rocket.payload_weights.map(pl => (
                      <Typography>{`${pl.id}`.toUpperCase()}: {pl.kg}kg</Typography>
                    ))}
                    <br/>
                    <Typography>Engines: {rocket.engines.number}</Typography>
                    <Typography>Eng. type: {`${rocket.engines.type}`.charAt(0).toUpperCase() + `${rocket.engines.type}`.slice(1)}</Typography>
                    <Typography>Thrust: {rocket.engines.thrust_sea_level.kN}kN</Typography>
                    <Typography>Landing legs: {rocket.landing_legs.number}</Typography>
                    {rocket.success_rate_pct > 0 && <Typography>Success rate: {rocket.success_rate_pct}%</Typography>}
                  </Grid>

                </Grid>
              </div>
            ))
            }
          </DialogContent>
        </Dialog>
      </div>
    );
  }
}

Rockets.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles) (Rockets);