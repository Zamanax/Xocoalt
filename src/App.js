import React from 'react';
import { Router, Route, Switch } from "react-router-dom"
import Sidebar from "./Sidebar"

function App() {
  return (
    <div className="App">
      <header className="App-header">
		  <Sidebar></Sidebar>
	    {/* <Router>
        <Switch>
          <Route path="/">
            <h1>Hi!</h1>
          </Route>
        </Switch>
    	</Router> */}
      </header>
    </div>
  );
}

export default App;
