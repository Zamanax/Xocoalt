import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import clsx from "clsx";

import { Drawer, List, ListItem, ListItemText, ListItemIcon, Typography, CssBaseline } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";


import HomeIcon from "@material-ui/icons/Home";
import BarChartIcon from "@material-ui/icons/BarChart";
import MapIcon from "@material-ui/icons/Map";
import SettingsIcon from "@material-ui/icons/Settings";
import ChevronLeftIcon from "@material-ui/icons/ChevronLeft";
import ChevronRightIcon from "@material-ui/icons/ChevronRight";

const drawerWidth = 240;

const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
  },
  main: {
    marginLeft : 75,
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  mainShift: {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
    whiteSpace: 'nowrap',
  },
  drawerOpen: {
    width: drawerWidth,
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  drawerClose: {
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    overflowX: 'hidden',
    [theme.breakpoints.up('sm')]: {
      width: theme.spacing(9) + 1,
    },
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
  },
}));

export default function App() {
  const classes = useStyles();

  const [open, setOpen] = React.useState(false);
  const icons = [<HomeIcon />, <BarChartIcon />, <MapIcon />, <SettingsIcon />];

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  const handleDrawer = () => {
    if (open) {
      handleDrawerClose();
    } else {
      handleDrawerOpen();
    }
  };

  return (
    <Router className={classes.root}>
      <CssBaseline/>
      <Drawer
      variant="permanent"
      className={clsx(classes.drawer, {
        [classes.drawerOpen]: open,
        [classes.drawerClose]: !open
      })}
      classes={{
        paper: clsx({
          [classes.drawerOpen]: open,
          [classes.drawerClose]: !open
        })
      }}
    >
      <List>
        <ListItem button onClick={handleDrawer}>
          <ListItemIcon>
            {open ? <ChevronLeftIcon /> : <ChevronRightIcon />}
          </ListItemIcon>
        </ListItem>
        {["Home", "DashBoard", "Map", "Settings"].map((text, index) => (
          <ListItem
            button
            onClick={() => {
              window.location.pathname = "/" + (text === "Home" ? "" : text);
            }}
            key={text}
          >
            <ListItemIcon> {icons[index]} </ListItemIcon>
            <ListItemText primary={text} />
          </ListItem>
        ))}
      </List>
    </Drawer>
      <main className={clsx(classes.main, {
          [classes.mainShift]: open,
      })}>
        <Switch>
          <Route path="/DashBoard">
            <Typography paragraph>
              What a beautiful dashboard.
            </Typography>
          </Route>
          <Route path="/">
            <Typography paragraph>
              empty dumpty sat on the wall, empty dumty fell from the wall.
            </Typography>
          </Route>
        </Switch>
      </main>
    </Router>
  );
}
