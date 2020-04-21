import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import GithubCorner from 'react-github-corner'

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    flexGrow: 1,
  },
}));

export default function Nav() {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <AppBar position="static" style={{ background: "#212121" }}>
        <Toolbar>
          <Typography variant="h7" className={classes.title}>
            SpaceX Launch and Mission Viewer
          </Typography>
          <GithubCorner
          bannerColor="#333333"
          size={65}
          href="https://github.com/PiotrRut/SpaceX-Launches" 
          />
        </Toolbar>
      </AppBar>
    </div>
  );
}