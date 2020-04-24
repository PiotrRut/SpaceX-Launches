import React from 'react';
import Typography from '@material-ui/core/Typography';
import axios from 'axios'
import Paper from '@material-ui/core/Paper'
import Grid from '@material-ui/core/Grid'

class Stats extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      launches: [{}]
    }
  }

  // Get all launches and add to local array
  componentDidMount() {
    axios
      .get(`https://api.spacexdata.com/v3/launches/past`)
      .then(res => {
        this.setState({ launches: res.data })
        console.log(this.state.launches)
      })
      .catch(error => console.error(error))
  }

  render() {
    let landedMissions = 0
    let f9Launches = 0
    let fHeavyLaunches = 0

    // Computer number of Starlink satellites in space
    const starlink =
    this.state.launches.filter(
      launch => launch.flight_number >= 1 ? launch.rocket.second_stage.payloads[0].payload_id.includes("Starlink") : null)
    
    // Compute number of successful landings on a landing vehicle
    const landSuccess =
    this.state.launches.filter(
      launch => launch.launch_success ? launch.rocket.first_stage.cores[0].landing_type : null) 

    landSuccess.forEach(launch => {
      launch.rocket.first_stage.cores.forEach(core => {
        if (core.land_success && core.landing_type !== 'Ocean') {
          landedMissions += 1;
        }
      })
    })

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


    return (
      <div className="About">
        <Grid container justify="center" spacing={3}>

          {/* Starlink satellites in space (assuming 60 satellites per launch) */}
          <Grid item>
            <Paper elevation={3} style={{ width: '50vh', height: '16vh', padding: '15px', background: '#212121', margin: '15px', alignText: 'center'}}>
            <Typography variant="h5">
              № of Starlink satellites in space:
            </Typography>
            <br/>
            <Typography variant="h3"> <span role="img" aria-label="satellite">🛰</span> {starlink.length * 60}</Typography>
            </Paper>
          </Grid>

          {/* All launches in total (excluding Amos-6 which never launched due to launch pad explosion) */}
          <Grid item>
            <Paper elevation={3} style={{ width: '50vh', height: '16vh', padding: '15px', background: '#212121', margin: '15px', alignText: 'center'}}>
            <Typography variant="h5">
              № of launches in total:
            </Typography>
            <Typography paragraph>
              (excluding Amos-6)
            </Typography>
            <Typography variant="h3"> <span role="img" aria-label="satellite">🚀</span> {this.state.launches.length -1 } </Typography>
            </Paper>
          </Grid>

          {/* All successful landings in total */}
          <Grid item>
            <Paper elevation={3} style={{ width: '50vh', height: '16vh', padding: '15px', background: '#212121', margin: '15px', alignText: 'center'}}>
            <Typography variant="h5">
              № of successful landings:
            </Typography>
            <br/>
            <Typography variant="h3"> <span role="img" aria-label="satellite">✅</span> {landedMissions}</Typography>
            </Paper>
          </Grid>

          {/* All Falcon 9 launches in total (excluding Amos-6 which never launched due to launch pad explosion) */}
          <Grid item>
            <Paper elevation={3} style={{ width: '50vh', height: '16vh', padding: '15px', background: '#212121', margin: '15px', alignText: 'center'}}>
            <Typography variant="h5">
              № Falcon9 launches:
            </Typography>
            <br/>
            <Typography variant="h3"> <span role="img" aria-label="satellite">🚀</span> {f9Launches -1}</Typography>
            </Paper>
          </Grid>

          {/* All Falcon Heavy launches in total  */}
          <Grid item>
            <Paper elevation={3} style={{ width: '50vh', height: '16vh', padding: '15px', background: '#212121', margin: '15px', alignText: 'center'}}>
            <Typography variant="h5">
              № Falcon Heavy launches:
            </Typography>
            <br/>
            <Typography variant="h3"> <span role="img" aria-label="satellite">🚀</span> {fHeavyLaunches}</Typography>
            </Paper>
          </Grid>

        </Grid>
      </div>
    );
  }
}


export default Stats;