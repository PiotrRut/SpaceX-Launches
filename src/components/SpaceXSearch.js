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
    color: "white"
  },
  input: {
    color: "white"
  },
  cssLabel: {
    color : 'gray'
  },
});

class SpaceXSearch extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      allLaunches: [{}],
      selected: '',
      itemSelected: false,
    }
  }

  componentDidMount() {
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
    return (
      <div>
        <br/>
            <p>Search for a mission (completed or upcoming)</p>
            <Autocomplete
              id="combo-box-demo"
              onChange={this.handleInput}
              options={this.state.allLaunches}
              getOptionLabel={(option) => option.mission_name}
              style={{ width: 300 }}
              renderInput={(params) =>
                <TextField
                  {...params}
                  className={classes.root}
                  id="standard-basic"
                  label="Mission name or date"
                  style={{width: '220px'}}
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
      </div>
    )
  }
}

SpaceXSearch.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles) (SpaceXSearch);