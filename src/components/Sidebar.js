import React from "react";
import {
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  makeStyles
} from "@material-ui/core";
import HomeIcon from "@material-ui/icons/Home";
import TimeLineIcon from "@material-ui/icons/Timeline"
import MapIcon from "@material-ui/icons/Map";
import SettingsIcon from "@material-ui/icons/Settings";
import ChevronLeftIcon from "@material-ui/icons/ChevronLeft";
import ChevronRightIcon from "@material-ui/icons/ChevronRight";
import ExitToAppIcon from "@material-ui/icons/ExitToApp";
import ListItemLink from "./ListItemLink";
import clsx from "clsx";

import * as firebase from "firebase/app";
import "firebase/auth";

const drawerWidth = 240;

const useStyles = makeStyles(theme => ({
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
    whiteSpace: "nowrap",
    background: theme.palette.secondary.main,
  },
  drawerOpen: {
    width: drawerWidth,
    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen
    })
  },
  drawerClose: {
    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen
    }),
    overflowX: "hidden",
    width: theme.spacing(7) + 1
  }
}));

export default function Sidebar(props) {
  const { open, setOpen, setValues, authInit } = props;
  const classes = useStyles();

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
    <Drawer
      variant="permanent"
      className={clsx(classes.drawer, {
        [classes.drawerOpen]: open,
        [classes.drawerClose]: !open
      })}
      classes={{
        paper: clsx(classes.drawer,{ 
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
          <ListItemLink
            key={text}
            icon={
              [<HomeIcon />, <TimeLineIcon />, <MapIcon />, <SettingsIcon />][
                index
              ]
            }
            to={"/" + (text === "Home" ? "" : text)}
            primary={text}
          />
        ))}
        <ListItemLink
          icon={<ExitToAppIcon />}
          to="/"
          primary="Log out"
          disabled={authInit || !firebase.auth().currentUser}
          onClick={() => {
            firebase
              .auth()
              .signOut()
              .then(() => {
                setValues({
                  login: "",
                  password: "",
                  showPassword: false,
                  user: false,
                  fetching: false
                });
              });
          }}
        />
      </List>
    </Drawer>
  );
}
