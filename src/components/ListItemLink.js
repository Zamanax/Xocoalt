import React from "react";

import { Link as RouterLink } from "react-router-dom";

import { ListItem, ListItemIcon, ListItemText } from "@material-ui/core";

export default function ListItemLink(props) {
    const { icon, primary, to, onClick, disabled } = props;
  
    const renderLink = React.useMemo(
      () => React.forwardRef((itemProps, ref) => <RouterLink to={to} ref={ref} {...itemProps} />),
      [to],
    );
  
    return (
        <ListItem button component={renderLink} onClick={onClick} disabled={disabled}>
            {icon ? <ListItemIcon>{icon}</ListItemIcon> : null}
            <ListItemText primary={primary} />
        </ListItem>
    );
  }