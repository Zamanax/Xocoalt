import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Switch,
  Redirect
} from "react-router-dom";
import clsx from "clsx";

import {
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  Typography,
  CssBaseline
} from "@material-ui/core";
import {
  makeStyles,
  createMuiTheme,
  ThemeProvider
} from "@material-ui/core/styles";

import { Fade } from "react-reveal";

import HomeIcon from "@material-ui/icons/Home";
import BarChartIcon from "@material-ui/icons/BarChart";
import MapIcon from "@material-ui/icons/Map";
import SettingsIcon from "@material-ui/icons/Settings";
import ChevronLeftIcon from "@material-ui/icons/ChevronLeft";
import ChevronRightIcon from "@material-ui/icons/ChevronRight";
import ExitToAppIcon from "@material-ui/icons/ExitToApp";

import DashBoard from "./components/DashBoard";
import Home from "./components/Home";

import * as firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";

import ListItemLink from "./components/ListItemLink";

const firebaseConfig = {
  apiKey: "AIzaSyD7-UB8z5eI4NqdTKk06U4QLCagAu4Z3fQ",
  authDomain: "xocoalt-e94d3.firebaseapp.com",
  databaseURL: "https://xocoalt-e94d3.firebaseio.com",
  projectId: "xocoalt-e94d3",
  storageBucket: "xocoalt-e94d3.appspot.com",
  messagingSenderId: "1087340054105",
  appId: "1:1087340054105:web:5d3179367a76e340bd9348",
  measurementId: "G-GT09MEM2G2"
};

const drawerWidth = 240;

const useStyles = makeStyles(theme => ({
  root: {
    display: "flex",
    height: "100%"
  },
  main: {
    display: "flex",
    overflow: "hidden",
    flexDirection: "column",
    alignItems: "center",
    height: "100%",
    marginLeft: theme.spacing(7) + 1,
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen
    })
  },
  mainShift: {
    marginLeft: theme.spacing(11) + 1 + drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen
    })
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
    whiteSpace: "nowrap"
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
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(3)
  },
  title: {
    marginTop: 40,
    textAlign: "center"
  }
}));

const theme = createMuiTheme({
  palette: {
    primary: {
      main: "#2f2f2f"
    },
    secondary: {
      main: "#fff"
    },
    background: {
      default: "#2f2f2f"
    }
  }
});

export default function App() {
  if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
  }
  const classes = useStyles();

  const [values, setValues] = React.useState({
    login: "",
    password: "",
    showPassword: false,
    user: false,
    fetching: false
  });

  const [cards, setCards] = React.useState({
    list: [],
    fetching: false
  });

  const [open, setOpen] = React.useState(false);

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
    // if (firebase.auth().currentUser !== null) {
    //   db.collection("users")
    //             .doc("4GYEMfS0bfNm8zAqBgN5")
    //             .get()
    //             .then(snap => {
    //               const val = snap.data()[firebase.auth().currentUser.email];
    //               setValues({ ...values, user: val });
    //               createSubjects(values.user, cards, setCards);
    //             });
    // }

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router className={classes.root}>
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
              <ListItemLink
                key={text}
                icon={
                  [
                    <HomeIcon />,
                    <BarChartIcon />,
                    <MapIcon />,
                    <SettingsIcon />
                  ][index]
                }
                to={"/" + (text === "Home" ? "" : text)}
                primary={text}
              ></ListItemLink>
            ))}
            <ListItemLink
              icon={<ExitToAppIcon />}
              to="/"
              primary="Log out"
              onClick={() => {
                firebase.auth().signOut();
                setValues({
                  login: "",
                  password: "",
                  showPassword: false,
                  user: false,
                  fetching: false
                });
              }}
            ></ListItemLink>
          </List>
        </Drawer>
        <main
          className={clsx(classes.main, {
            [classes.mainShift]: open
          })}
        >
          <Typography variant="h2" className={classes.title} color="secondary">
            XOCOALT
          </Typography>
          <Switch>
            <Route path="/DashBoard">
              {values.login !== "" ? <DashBoard /> : <Redirect to="/" />}
            </Route>
            <Route path="/Settings">
              <h1>Hi !</h1>
            </Route>
            <Route path="/">
              <Fade duration={2000}>
                <Home values={[values, setValues]} cards={[cards, setCards]} />
              </Fade>
            </Route>
          </Switch>
        </main>
      </Router>
    </ThemeProvider>
  );
}
