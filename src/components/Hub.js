import React from "react";
import { useHistory } from "react-router";
import {
  makeStyles,
  Typography,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@material-ui/core";

import { capitalizeFirstLetter } from "../model/utils";

const useStyles = makeStyles((theme) => ({
  hub: {
    width: "100%",
    height: "100%",
  },
  header: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    height: 110,
    margin: "0 7.5% 0 7.5%",
  },
  cardContainer: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-evenly",
    height: "calc(80% - 110px)",
  },
}));

export default function Hub(props) {
  const classes = useStyles();
  const history = useHistory();

  const { values, cards } = props;
  const [openDialog, setOpenDialog] = props.openDialog;
  const openLesson = props.openLesson;

  const defaultLanguage =
    values.user.languages !== undefined
      ? Object.keys(values.user.languages)[0]
      : "french";

  let currentChap = undefined;
  try {
    currentChap = values.user.languages[defaultLanguage][openLesson.type].current;
  } catch {}

  const chooseSubject = (remove) => {
    const defaultSourceLanguage =
      values.user.languages !== undefined
        ? Object.keys(values.user.languages)[0]
        : "english";
    const defaultDestLanguage =
      values.user.languages !== undefined
        ? Object.keys(values.user.languages[defaultSourceLanguage])[0]
        : "french";
    if (localStorage.getItem("results") && remove) {
      localStorage.removeItem("results");
    }
    history.push(
      "/" +
        defaultSourceLanguage.slice(0, 2) +
        defaultDestLanguage.slice(0, 2) +
        "/" +
        openLesson.type +
        "/" +
        (currentChap !== undefined ? currentChap : openLesson.chapters[0].title)
    );
  };

  const handleDialogCloseCancel = () => {
    setOpenDialog(false);
  };
  const handleDialogCloseConfirm = () => {
    setOpenDialog(false);
    chooseSubject(true);
  };

  return (
    <div className={classes.hub}>
      <div className={classes.header}>
        <Typography variant="h3" color="secondary">
          {capitalizeFirstLetter(
            values.user.languages !== undefined
              ? Object.keys(values.user.languages)[0]
              : "french"
          )}
        </Typography>
      </div>
      <div className={classes.cardContainer}>{cards.list}</div>
      {localStorage.results !== undefined && (
        <Button variant="contained" onClick={()=>{chooseSubject(false)}}>Resume</Button>
      )}
      <Dialog open={openDialog} onClose={handleDialogCloseCancel}>
        <DialogTitle>Register</DialogTitle>
        <DialogContent>
          <DialogContentText>
            If you confirm, all data about the previous exercise you did not
            finish will be lost.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogCloseCancel} color="primary">
            Cancel
          </Button>
          <Button onClick={handleDialogCloseConfirm} color="primary" autoFocus>
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
