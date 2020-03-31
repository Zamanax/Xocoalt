import React from "react";
import {
  makeStyles,
  CircularProgress,
  Typography,
  FormGroup,
  FormControlLabel,
  Switch,
  Button
} from "@material-ui/core";
import { TreeView, TreeItem } from "@material-ui/lab";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import ChevronRightIcon from "@material-ui/icons/ChevronRight";
import WarningIcon from "@material-ui/icons/Warning";

import * as firebase from "firebase/app";
import "firebase/firestore";
import { grey } from "@material-ui/core/colors";

const useStyles = makeStyles(theme => ({
  root: {
    width: 400,
    overflow: "scroll",
    scrollbarWidth: "none",
    maxHeight: 300,
    color: theme.palette.secondary.main
  },
  rootTree: {
    "&$selected": {
      backgroundColor: grey[500]
    }
  },
  selected: {},
  formControl: {
    margin: 20,
    display: "flex",
    flexDirection: "row"
  }
}));

export default function DatabaseTree() {
  const classes = useStyles();
  const db = firebase.firestore();
  const reader = new FileReader();
  const [fetching, setFetching] = React.useState(true);
  const [exercise, setExercise] = React.useState(false);
  const [erase, setErase] = React.useState(false);
  const [expanded, setExpanded] = React.useState([]);
  const [selected, setSelected] = React.useState([]);
  const [treeItems, setTreeItems] = React.useState([]);
  const [file, setFile] = React.useState(null);
  const [idMap, setIdMap] = React.useState({});
  const [data, setData] = React.useState({});
  let map = {};
  let i = -1;

  const handleToggle = (event, nodeIds) => {
    setExpanded(nodeIds);
  };

  const handleSelect = (event, nodeId) => {
    setSelected(idMap[nodeId]);
  };

  const handleFileSelect = e => {
    setFile(e.target.files[0]);
  };

  const richBuilder = (toAdd, path) => {
    if (path === undefined) {
      path = selected;
    }
    if (path.length !== 0) {
      const [, ...rest] = path;
      return { [path[0]]: richBuilder(toAdd, rest) };
    } else {
      return toAdd;
    }
  };
  const isObject = item => {
    return item && typeof item === "object" && !Array.isArray(item);
  };

  const mergeDeep = (target, ...sources) => {
    if (!sources.length) return target;
    const source = sources.shift();

    if (isObject(target) && isObject(source)) {
      for (const key in source) {
        if (isObject(source[key])) {
          if (!target[key]) Object.assign(target, { [key]: {} });
          mergeDeep(target[key], source[key]);
        } else {
          Object.assign(target, { [key]: source[key] });
        }
      }
    }

    return mergeDeep(target, ...sources);
  };

  const sendData = () => {
    reader.readAsText(file, "UTF-8");
    reader.onloadend = e => {
      const toUpload = mergeDeep(data, richBuilder(JSON.parse(e.target.result)));
      if (!exercise) {
        db.collection("sources")
          .doc("english")
          .set(toUpload, { merge: !erase });
      } else {
        db.collection("sources")
          .doc("english")
          .collection("exercises")
          .doc("french")
          .set(toUpload, { merge: !erase });
      }
      setFetching(true);
      setExpanded([]);
      setSelected([]);
      loadTree();
    };
  };

  const getChild = (item, path, treeItemData) => {
    if (typeof item === "object") {
      return getTreeItemsFromData(item, [...path, treeItemData]);
    } else if (typeof item === "string") {
      map[i++] = [...path, treeItemData];
      return <TreeItem key={i} nodeId={i.toString()} label={item} />;
    } else {
      return undefined;
    }
  };

  const getTreeItemsFromData = (treeItems, path) => {
    if (path === undefined) {
      path = [];
    }
    return Object.keys(treeItems).map(treeItemData => {
      i++;
      map[i] = [...path, treeItemData];
      return (
        <TreeItem
          key={i}
          nodeId={i.toString()}
          label={treeItemData}
          classes={{ root: classes.rootTree, selected: classes.selected }}
          children={getChild(treeItems[treeItemData], path, treeItemData)}
        />
      );
    });
  };

  const loadTree = () => {
    if (fetching) {
      setFetching(false);
      if (!exercise) {
        db.collection("sources")
          .doc("english")
          .get()
          .then(snap => {
            const newData = snap.data()
            setTreeItems(getTreeItemsFromData(newData));
            setData(newData)
            setIdMap(map);
          });
      } else {
        db.collection("sources")
          .doc("english")
          .collection("exercises")
          .doc("french")
          .get()
          .then(snap => {
            const newData = snap.data()
            setTreeItems(getTreeItemsFromData(newData));
            setData(newData)
            setIdMap(map);
          });
      }
    }
  };

  loadTree();

  return treeItems.length !== 0 ? (
    <div>
      <FormGroup className={classes.formControl}>
        <FormControlLabel
          control={
            <Switch
              checked={exercise}
              onChange={() => {
                setExercise(!exercise);
                setFetching(true);
                setExpanded([]);
                setSelected([]);
                loadTree();
              }}
              name="checkedA"
            />
          }
          label={
            <Typography color="secondary" variant="h5">
              Exercise
            </Typography>
          }
        />
        <FormControlLabel
          control={
            <Switch
              checked={erase}
              onChange={() => {
                setErase(!erase);
              }}
              name="checkedB"
            />
          }
          label={
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center"
              }}
            >
              <WarningIcon
                color="secondary"
                style={{ marginLeft: -5, marginRight: 5 }}
              />
              <Typography color="secondary" variant="h5">
                ERASE
              </Typography>
            </div>
          }
        />
      </FormGroup>
      <TreeView
        className={classes.root}
        defaultCollapseIcon={<ExpandMoreIcon />}
        defaultExpandIcon={<ChevronRightIcon />}
        expanded={expanded}
        onNodeToggle={handleToggle}
        onNodeSelect={handleSelect}
      >
        {treeItems}
      </TreeView>
      <Typography variant="h4" color="secondary">
        {selected[selected.length - 1]}
      </Typography>

      <div style={{ margin: 10 }}>
        <input
          type="file"
          accept="application/JSON"
          id="uploadButton"
          style={{ display: "none" }}
          onChange={handleFileSelect}
        />
        <label htmlFor="uploadButton" style={{ margin: 15 }}>
          <Button variant="contained" component="span">
            Choose File
          </Button>
        </label>
        <Typography variant="h5" color="secondary" style={{ margin: 10 }}>
          {file !== null ? file.name : ""}
        </Typography>
        <Button variant="contained" onClick={sendData}>
          Upload
        </Button>
      </div>
    </div>
  ) : (
    <CircularProgress color="secondary" />
  );
}
