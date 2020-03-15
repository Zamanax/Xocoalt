import React from "react";
import { useParams } from "react-router-dom";
import { Typography, makeStyles } from "@material-ui/core";
import { useQuery } from "../model/utils";

const useStyles = makeStyles(theme => ({
    
}))

export default function Exercise(props) {
    const classes = useStyles();

    const { user } = props;
    const { lang, subject, chapter } = useParams();
    const id = useQuery().get("id");

    return (
        <div>
            <Typography color="secondary">lang = {lang}</Typography>
            <Typography color="secondary">subject = {subject}</Typography>
            <Typography color="secondary">chapter = {chapter}</Typography>
            <Typography color="secondary">id = {id}</Typography>
        </div>
    )
}