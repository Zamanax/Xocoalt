import React, { useState } from "react";

import { Typography } from "@material-ui/core";

import * as firebase from "firebase/app";
import "firebase/firestore";

export default function SubjectPage({ lang, subject }) {
  const [infos, setInfos] = useState([]);

  const db = firebase.firestore();

  if (infos.length === 0 && subject !== undefined) {
    db.collection("sources")
      .doc("english")
      .collection("exercises")
      .doc(lang)
      .get()
      .then((snap) => {
        setInfos(snap.data()[subject]);
      });
  }

  return (
    <div>
      <Typography>{lang}</Typography>
      <Typography>{subject}</Typography>
    </div>
  );
}
