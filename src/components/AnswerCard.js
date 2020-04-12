import React from "react";

import {makeStyles, Typography} from "@material-ui/core"

const useStyles = makeStyles(theme => ({
    rectangle: {
        borderRadius: 5,
        width: "33%,",
        display: "flex",
        flexDirection: "column",
    }
}))

export default function AnswerCard(props) {
    const classes = useStyles()
    const { question, goodAnswer, answer } = props;

    return <div className={classes.rectangle}>
        <Typography>{goodAnswer}</Typography>
        <Typography>{question}</Typography>
        <Typography>{answer}</Typography>
    </div>
}