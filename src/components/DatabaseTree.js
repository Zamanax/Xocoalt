import React from "react";
import { makeStyles, CircularProgress, Typography } from "@material-ui/core";
import { TreeView, TreeItem } from "@material-ui/lab";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import ChevronRightIcon from "@material-ui/icons/ChevronRight";

import * as firebase from "firebase/app";
import "firebase/firestore";
import { grey } from "@material-ui/core/colors";

const useStyles = makeStyles(theme => ({
  root: {
    margin: 30,
    width: 400,
    overflow: "scroll",
    scrollbarWidth: "none",
    maxHeight: 400,
    color: theme.palette.secondary.main
  },
  rootTree: {
    "&$selected": {
      backgroundColor: grey[500]
    }
  },
  selected: {}
}));

export default function DatabaseTree() {
  const classes = useStyles();
  const db = firebase.firestore();
  const [fetching, setFetching] = React.useState(true);
  const [expanded, setExpanded] = React.useState([]);
  const [selected, setSelected] = React.useState("");
  const [treeItems, setTreeItems] = React.useState([]);
  let i = -1;

  const handleToggle = (event, nodeIds) => {
    setExpanded(nodeIds);
  };

  const handleSelect = (event, nodeIds) => {
    if (event.target.textContent) {
      setSelected(event.target.textContent);
    }
  };

  const getTreeItemsFromData = treeItems => {
    return Object.keys(treeItems).map(treeItemData => {
      i++;
      return (
        <TreeItem
          key={i}
          nodeId={i.toString()}
          label={treeItemData}
          classes={{ root: classes.rootTree, selected: classes.selected }}
          children={
            typeof treeItems[treeItemData] === "object" ? (
              getTreeItemsFromData(treeItems[treeItemData])
            ) : typeof treeItems[treeItemData] === "string" ? (
              <TreeItem
                key={i++}
                nodeId={i.toString()}
                label={treeItems[treeItemData]}
              />
            ) : (
              undefined
            )
          }
        />
      );
    });
  };

  if (fetching) {
    setFetching(false);
    db.collection("sources")
      .doc("english")
      .get()
      .then(snap => {
        setTreeItems(getTreeItemsFromData(snap.data()));
      });
  }

  return treeItems.length !== 0 ? (
    <div>
      <TreeView
        className={classes.root}
        defaultCollapseIcon={<ExpandMoreIcon />}
        defaultExpandIcon={<ChevronRightIcon />}
        expanded={expanded}
        selected={selected}
        onNodeToggle={handleToggle}
        onNodeSelect={handleSelect}
      >
        {treeItems}
      </TreeView>
      <Typography variant="h4" color="secondary">{selected}</Typography>
    </div>
  ) : (
    <CircularProgress color="secondary" />
  );
}
