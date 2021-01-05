import React from "react";
import {
  AppBar,
  Toolbar,
  Button,
  Typography,
  IconButton,
} from "@material-ui/core";
import { withRouter, useHistory } from "react-router";
import { FaNetworkWired } from "react-icons/fa";
import { makeStyles } from "@material-ui/core/styles";

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

const Header = ({ isLogged, signOut, match }) => {
  const classes = useStyles();
  const history = useHistory();
  return (
    <div>
      <AppBar position="static" style={{ backgroundColor: "#a900b0" }}>
        <Toolbar>
          <IconButton
            edge="start"
            className={classes.menuButton}
            color="inherit"
            aria-label="menu"
            onClick={() => history.push("/")}
          >
            <FaNetworkWired />
          </IconButton>
          <Typography variant="h6" className={classes.title}>
            FLOWAPP
          </Typography>
          {isLogged && (<Button
            type="button"
            onClick={signOut}
            color="inherit"
          >
            Logout
          </Button>)}
        </Toolbar>
      </AppBar>
    </div>
  );
};

export default withRouter(Header);
