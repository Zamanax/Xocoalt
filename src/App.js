import React from 'react';
import { BrowserRouter as Router, Route, Switch } from "react-router-dom"
import Sidebar from "./components/Sidebar"

function App() {
  return (
	    <Router>
		  <Sidebar></Sidebar>
        <Switch>
          <Route path="/Home">
            <h1>Hi!</h1>
            <h1>Hi!</h1>
            <h1>Hi!</h1>
            <h1>Hi!</h1>
            <p>Test</p>
          </Route>
        </Switch>
    	</Router>
  );
}

export default App;
