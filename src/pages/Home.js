import React from 'react';
import '../App.css';
import Grid from '@material-ui/core/Grid'
import PropTypes from 'prop-types'
import { makeStyles, useTheme } from '@material-ui/core/styles'
import Tabs from '@material-ui/core/Tabs'
import Tab from '@material-ui/core/Tab'
import Typography from '@material-ui/core/Typography'
import Box from '@material-ui/core/Box'
import AppBar from '@material-ui/core/AppBar'
import SwipeableViews from 'react-swipeable-views'

import Switch from '@material-ui/core/Switch';
import Fade from '@material-ui/core/Fade';
import FormControlLabel from '@material-ui/core/FormControlLabel';

import SpaceXSearch from '../components/SpaceXSearch';
import SpaceXList from '../components/SpaceXList';
import Rockets from '../components/Rockets'
import About from '../components/About'
import Stats from '../components/Stats'


function TabPanel (props) {
  const { children, value, index, ...other } = props

  return (
    <Typography
      component="div"
      role="tabpanel"
      hidden={value !== index}
      id={`full-width-tabpanel-${index}`}
      aria-labelledby={`full-width-tab-${index}`}
      {...other}
    >
      <Box p={3}>{children}</Box>
    </Typography>
  )
}

// Props typechecking
TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired
}

function a11yProps (index) {
  return {
    id: `full-width-tab-${index}`,
    'aria-controls': `full-width-tabpanel-${index}`
  }
}

const useStyles = makeStyles(theme => ({
  root: {
    width: '100%'
  }
}))

export default function Home() {
  const [value, setValue] = React.useState(0)
  const [checked, setChecked] = React.useState(false);
  const classes = useStyles()
  const theme = useTheme()

  // Switching tabs
  const handleChange = (event, newValue) => {
    setValue(newValue)
  }

  const handleCheck = () => {
    setChecked((prev) => !prev);
  };

  var missionsTab;

  if (!checked) {
    missionsTab = 
      <Grid item>
        <SpaceXList/>
      </Grid>
  } else {
    missionsTab = 
      <Grid item xl={3} lg={7} sm={7} xs={12} md={7}>
        <SpaceXSearch/>
      </Grid>
  }

  return (
    <div className={classes.root}>
      <AppBar position="static" style={{ background: "#424242", width:"100%" }}>
        <Tabs 
        value={value}
        onChange={handleChange}
        indicatorColor="secondary"
        textColor="white"
        variant="fullWidth"
        aria-label="staff-action-tabs"
        >
          <Tab label="Missions" {...a11yProps(0)} />
          <Tab label="Rockets" {...a11yProps(1)} />
          <Tab label="Stats" {...a11yProps(2)} />
          <Tab label="About" {...a11yProps(3)} />
        </Tabs>
      </AppBar>

      <SwipeableViews axis={theme.direction === 'rtl' ? 'x-reverse' : 'x'} index={value} disabled>
        {/* Contents of Tab 1: Missions */}   
        <TabPanel value={value} index={0}>
          <FormControlLabel
            control={<Switch checked={checked} onChange={handleCheck} />}
            label="List / Filter Missions"
          />
          <Grid justify="center" alignItems="center" container spacing={6}> 
            {missionsTab}
          </Grid> 
        </TabPanel>


        {/* Contents of Tab 2: Rockets */}
        <TabPanel value={value} index={1}>
          <Grid justify="center" alignItems="center" container spacing={6}>
            <Grid item xl={3} lg={7} sm={7} xs={12} md={7}>
              <Rockets/>
            </Grid>
          </Grid>
        </TabPanel>

        {/* Contents of Tab 3: Stats */}
        <TabPanel value={value} index={2}>
          <Stats/>
        </TabPanel>

        {/* Contents of Tab 4: About */}
        <TabPanel value={value} index={3}>
          <About/>
        </TabPanel>
      </SwipeableViews>
    </div>
  );
}
