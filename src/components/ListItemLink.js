import React from "react";

import { Link as RouterLink } from "react-router-dom";

import { ListItem, ListItemIcon, ListItemText, makeStyles } from "@material-ui/core";

const useStyles = makeStyles(theme => ({
  root: {
    transition: "transform .3s",
    "&:hover": {
      transform: "scale(1.1)",
    }
  }
}))

export default function ListItemLink(props) {
  const classes = useStyles()
    const { icon, primary, to, onClick, disabled } = props;
  
    const renderLink = React.useMemo(
      () => React.forwardRef((itemProps, ref) => <RouterLink to={to} ref={ref} {...itemProps} />),
      [to],
    );
  
    return (
        <ListItem button component={renderLink} onClick={onClick} disabled={disabled} className={classes.root}>
            {icon ? <ListItemIcon>{icon}</ListItemIcon> : null}
            <ListItemText primary={primary} />
        </ListItem>
    );
  }