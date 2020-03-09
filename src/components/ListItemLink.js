import React from "react";

import { Link as RouterLink } from "react-router-dom";

import { ListItem, ListItemIcon, ListItemText } from "@material-ui/core";

export default function ListItemLink(props) {
    const { icon, primary, to, key, onClick} = props;
  
    const renderLink = React.useMemo(
      () => React.forwardRef((itemProps, ref) => <RouterLink to={to} ref={ref} {...itemProps} />),
      [to],
    );
  
    return (
        <ListItem button component={renderLink} key={key} onClick={onClick}>
            {icon ? <ListItemIcon>{icon}</ListItemIcon> : null}
            <ListItemText primary={primary} />
        </ListItem>
    );
  }