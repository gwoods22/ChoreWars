import React, { Component } from 'react';
import './App.css';
import SideBar from './sidebar';
import {
  Route,
  HashRouter
} from "react-router-dom";
import Home from "./Home";
import EventLog from "./EventLog";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    return (
      <div>
        <HashRouter>
          <div>
            <SideBar/>
            <div id="page-wrapper">
              <Route exact path="/" component={Home}></Route>
              <Route path="/eventlog" component={EventLog}></Route>
            </div>
          </div>
        </HashRouter>
      </div>
    );
  }
}

export default App;
