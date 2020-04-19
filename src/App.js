import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Switch,
  Redirect,
} from "react-router-dom";
import clsx from "clsx";

import { CssBaseline, CircularProgress, Snackbar } from "@material-ui/core";
import {
  makeStyles,
  createMuiTheme,
  ThemeProvider,
} from "@material-ui/core/styles";
import MuiAlert from "@material-ui/lab/Alert";

import { Fade } from "react-reveal";

import DashBoard from "./components/DashBoard";
import Home from "./components/Home";
import Sidebar from "./components/Sidebar";
import Exercise from "./components/Exercise";

import * as firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";

import { createSubjects } from "./model/utils";
import Settings from "./components/Settings";
import Account from "./components/Account";
import Header from "./components/Header";

const firebaseConfig = {
  apiKey: "AIzaSyD7-UB8z5eI4NqdTKk06U4QLCagAu4Z3fQ",
  authDomain: "xocoalt-e94d3.firebaseapp.com",
  databaseURL: "https://xocoalt-e94d3.firebaseio.com",
  projectId: "xocoalt-e94d3",
  storageBucket: "xocoalt-e94d3.appspot.com",
  messagingSenderId: "1087340054105",
  appId: "1:1087340054105:web:5d3179367a76e340bd9348",
  measurementId: "G-GT09MEM2G2",
};

const drawerWidth = 240;

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    height: "100%",
  },
  main: {
    display: "flex",
    overflowX: "hidden",
    overflowY: "auto",
    scrollbarWidth: "thin",
    scrollbarColor: "auto",
    flexDirection: "column",
    height: "100%",
    marginLeft: theme.spacing(7) + 1,
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  mainShift: {
    marginLeft: theme.spacing(11) + 1 + drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
  },
}));

export default function App() {
  const classes = useStyles();
  if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
  }
  const db = firebase.firestore();

  const [theme, setTheme] = React.useState(
    createMuiTheme(
      localStorage.getItem("theme") !== null
        ? JSON.parse(localStorage.getItem("theme"))
        : {
            palette: {
              primary: {
                main: "#5E7880",
              },
              secondary: {
                main: "#BDF0FF",
              },
              background: {
                default: "#386F80",
              },
            },
          }
    )
  );

  const [values, setValues] = React.useState({
    login: "",
    password: "",
    showPassword: false,
    user: false,
    fetching: false,
  });

  const [cards, setCards] = React.useState({
    list: [],
    fetching: false,
  });

  const [open, setOpen] = React.useState(false);

  const [openDialog, setOpenDialog] = React.useState(false);

  const [openLesson, setOpenLesson] = React.useState({
    type: "",
    chap: "",
  });

  const [authInit, setAuthInit] = React.useState(true);

  const [err, setError] = React.useState({
    name: false,
    password: false,
    reason: "",
  });

  const [openAlert, setOpenAlert] = React.useState(false);

  const handleCloseAlert = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setOpenAlert(false);
  };

  if (authInit) {
    firebase.auth().onAuthStateChanged((user) => {
      setAuthInit(false);
      if (user) {
        db.collection("users")
          .doc(user.email)
          .get()
          .then((snap) => {
            const val = snap.data();
            createSubjects(val, cards, setCards, setOpenDialog, setOpenLesson);
            setValues({ ...values, user: val });
          });
      }
    });
  }

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router className={classes.root}>
        <Sidebar
          open={open}
          setOpen={setOpen}
          setValues={setValues}
          authInit={authInit}
        />
        {authInit ? (
          <CircularProgress
            style={{ marginLeft: "50%", marginTop: "22.5%" }}
            color="secondary"
          />
        ) : (
          <main
            className={clsx(classes.main, {
              [classes.mainShift]: open,
            })}
          >
            <Header user={values.user} />
            <Switch>
              <Route path="/Account">
                {firebase.auth().currentUser ? (
                  <Account user={[values, setValues]} />
                ) : (
                  <Redirect to="/" />
                )}
              </Route>
              <Route path="/DashBoard">
                {firebase.auth().currentUser ? (
                  <DashBoard />
                ) : (
                  <Redirect to="/" />
                )}
              </Route>
              <Route path="/Settings">
                <Fade duration={1000}>
                  <Settings user={values.user} theme={setTheme} />
                </Fade>
              </Route>
              <Route path="/:lang/:subject/:chapter">
                <Exercise user={values.user} />
              </Route>
              <Route path="/">
                <Home
                  values={[values, setValues]}
                  cards={[cards, setCards]}
                  auth={authInit}
                  err={[err, setError]}
                  setOpenAlert={setOpenAlert}
                  openDialog={[openDialog, setOpenDialog]}
                  openLesson={openLesson}
                />
              </Route>
            </Switch>
            <Snackbar
              open={openAlert}
              autoHideDuration={6000}
              onClose={handleCloseAlert}
              anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
            >
              <MuiAlert
                elevation={6}
                variant="filled"
                onClose={handleCloseAlert}
                severity="error"
              >
                {err.reason}
              </MuiAlert>
            </Snackbar>
          </main>
        )}
      </Router>
    </ThemeProvider>
  );
}
