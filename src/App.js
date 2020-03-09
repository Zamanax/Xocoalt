import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Switch,
  Redirect
} from "react-router-dom";
import clsx from "clsx";

import {
  Typography,
  CssBaseline
} from "@material-ui/core";
import {
  makeStyles,
  createMuiTheme,
  ThemeProvider
} from "@material-ui/core/styles";

import { Fade } from "react-reveal";

import DashBoard from "./components/DashBoard";
import Home from "./components/Home";
import Sidebar from "./components/Sidebar";

import * as firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";

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
  content: {
    flexGrow: 1,
    padding: theme.spacing(3)
  },
  title: {
    margin: 20,
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

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router className={classes.root}>
        <Sidebar open={open} setOpen={setOpen} setValues={setValues}/>
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
              {firebase.auth().currentUser ? <DashBoard /> : <Redirect to="/" />}
            </Route>
            <Route path="/Settings">
              <h1>Hi !</h1>
            </Route>
            <Route path="/">
              <Fade duration={1000}>
                <Home values={[values, setValues]} cards={[cards, setCards]} />
              </Fade>
            </Route>
          </Switch>
        </main>
      </Router>
    </ThemeProvider>
  );
}
