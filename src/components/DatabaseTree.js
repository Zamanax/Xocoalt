import React from "react";
import { makeStyles } from "@material-ui/core";
import { TreeView, TreeItem } from "@material-ui/lab";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import ChevronRightIcon from "@material-ui/icons/ChevronRight";

import * as firebase from "firebase/app";
import "firebase/firestore";

const useStyles = makeStyles({
  root: {
    margin: 30,
    width: 400,
    overflow: "scroll",
    scrollbarWidth: "none",
  }
});

export default function DatabaseTree() {
  const classes = useStyles();
  const db = firebase.firestore();
  const [fetching, setFetching] = React.useState(true);
  const [expanded, setExpanded] = React.useState([]);
  const [selected, setSelected] = React.useState([]);
  const [treeItems, setTreeItems] = React.useState([]);
  let i = -1;

  const handleToggle = (event, nodeIds) => {
    setExpanded(nodeIds);
  };

  const handleSelect = (event, nodeIds) => {
    setSelected(nodeIds);
  };

  const getTreeItemsFromData = treeItems => {
    return Object.keys(treeItems).map((treeItemData) => {
      i++
      return (
        <TreeItem
          key={i}
          nodeId={i.toString()}
          label={treeItemData}
          children={typeof treeItems[treeItemData] === "object"
              ? getTreeItemsFromData(treeItems[treeItemData])
            : typeof treeItems[treeItemData] === "string" ? <TreeItem key={i++} nodeId={i.toString()} label={treeItems[treeItemData]} /> : undefined
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

  return (
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
  );
}
