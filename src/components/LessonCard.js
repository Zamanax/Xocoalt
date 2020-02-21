import React from "react";
import { Typography } from "@material-ui/core";

export default function LessonCard(props) {

    return (
        <div>
            <div>
                <h2>Common Words</h2>
            </div>
            <div>
                <Typography>
                    {props.type}
                </Typography>
                <Typography>
                    {props.user.language[props.type].progression}
                </Typography>
            </div>
        </div>
    )
}