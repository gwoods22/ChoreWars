import React, { Component } from 'react';
import './App.css';
import hiddenKey from './api.js';
import SideBar from './sidebar';
import {
  Route,
  HashRouter
} from "react-router-dom";

var moment = require('moment');

const firebase = require('firebase/app');
// Required for side-effects
require("firebase/firestore");



firebase.initializeApp({
  apiKey: hiddenKey,
  authDomain: "emersonchores.firebaseapp.com",
  projectId: "emersonchores"
});

// Initialize Cloud Firestore through Firebase
const db = firebase.firestore();
const settings = {timestampsInSnapshots: true};
db.settings(settings);

var usersC = db.collection('users');

var dateC = db.collection('general').doc('lastUpdated');

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
              <Route exact path="/" component={Header}></Route>
              <Route path="/eventlog" component={EventLog}></Route>
            </div>
          </div>
        </HashRouter>
      </div>
    );
  }
}


function Leaderboard(props) {
  props.people.sort(function compare(a, b) {
    if (a.points < b.points) return 1;
    if (a.points > b.points) return -1;
    return 0;
  })
  let data;
  function addPoint(user) {
    db.collection("users").where("name", "==", user)
    .get()
    .then(function(querySnapshot) {
        //console.log("check1");
        var doc = querySnapshot.docs[0];
        var current = doc.data().points;
        doc.ref.update({
            points: current + 1
        });
        
        //console.log("Check3");
    })
    .catch(function(error) {
        console.log("Error getting documents from users: ", error);
    }).then(function() {
        let date = moment().utc();
        date = parseInt(date.format("YYYYMMDDHHmmss"));
        data = {
          name: user,
          chore: "unknown",
          date: date
        };
    })
    .then(function () {
        db.collection("eventLogData").add(data);
    })
    .catch(function(error) {
        console.error("Error adding document to eventLogData: ", error);
    });
  }
  return (
    <table className="leaderboard">
      <tbody>
        <tr>
          <th>Rank</th>
          <th>Score</th>
          <th>Name</th>
        </tr>
        { props.people.map( (p, index) =>
          <tr key={p.id}>
            <td>{index + 1}</td>
            <td>{p.points}</td>
            <td>{p.name}</td>
            <td><button className="btn btn-1 btn-1a" type="submit" onClick={() => {addPoint(p.name)}}>Finshed Chore</button></td>
          </tr>
          )}
      </tbody>
    </table>
  );
}


// ROLE IDs
// 0 = Counters
// 1 = Sweeping
// 2 = Living Room
// 3 = Garbage
function Roles(props) {
  //sorted by role not points
  props.people.sort(function compare(a, b) {
    if (a.role < b.role) return -1;
    if (a.role > b.role) return  1;
    return 0;
  })
  return (
    <table className="roles">
      <tbody>
        {props.people.map(p =>
          <tr key={p.id}>
            <td>{props.roles[p.role]}</td>
            <td>{p.name}</td>
          </tr>
        )}
      </tbody>
    </table>
  );
}

class Header extends Component {
  constructor(props) {
    super(props);
    this.state = {
      roles: [
        'Counter Commander',
        'Sweeping Sergeant',
        'Living Room Lieutenant',
        'Garbage Governor',
        'Recycling Ranger',
        'Dish Deputy'
      ],
      people: [],
    };

    dateC.get()
      .then(doc => {
        var dbDate = moment(`${doc.data().date} 00:00:00`,"DD/MM/YYYY HH:mm:ss");
        var ms = moment().diff(dbDate);
        var offset = Math.floor(moment.duration(ms)._data.days/7);
        if (offset > 0) {
          doc.ref.update({'date': dbDate.add(offset, 'w').format("DD/MM/YYYY")});

          //increment role ID and get people
          // usersC.orderBy('points', 'desc').get()
          //   .then(snapshot => {
          //     snapshot.forEach(doc => {
          //       var newID = (doc.data().role + 1) % 4;
          //       doc.ref.update({'role': newID});
          //       var newArray = this.state.people.slice();
          //       newArray.push(doc.data());
          //       this.setState({people:newArray})
          //     });
          //   })
          //   .catch(err => {
          //     console.log('Error getting role document', err);
          //   });

          usersC.onSnapshot(querySnapshot => {
            var newArray = [];
            querySnapshot.forEach(doc => {
              var newID = (doc.data().role + 1) % 4;
              doc.ref.update({'role': newID});
              newArray.push(doc.data());
              this.setState({people:newArray})
            });
          }, err => {
            console.log(`Encountered error: ${err}`);
          })

        } else {
          //just get people
          usersC.onSnapshot(querySnapshot => {
            var newArray = [];
            querySnapshot.forEach(doc => {
              newArray.push(doc.data());
              this.setState({people:newArray})
            });
          }, err => {
            console.log(`Encountered error: ${err}`);
          })
        }
    })
    .catch(err => {
      console.log('Error getting date document', err);
    });

  }
  render() {
    return (
      <div className="header">
        <h1 className="title">Chore Wars</h1>
        <div className="row">
          <div className="left">
            <h2>Leaderboard</h2>
            <Leaderboard people={this.state.people} />
          </div>
          <div className="right">
            <h2>Roles</h2>
            <Roles people={this.state.people} roles={this.state.roles}/>
          </div>
        </div>
      </div>
    )
  }
}

class Event extends Component {
  constructor(props) {
    super(props);
    let momentDate = moment(props.date.toString(), "YYYYMMDDHHmmss").subtract(5, "hours");
    let formattedDate = momentDate.format("MM/DD/YYYY HH:mm:ss");
    this.state = {
      user: props.name,
      chore: props.chore,
      date: formattedDate
    };
  }
  render() {
    return(
        <div className="event-log-content">
          <div className="event-prop">
            { this.props.user }
          </div>
          <div className="event-prop">
            { this.props.chore }
          </div>
          <div className="event-prop">
            { this.state.date }
          </div>
        </div>
    );
  };
}

class EventLog extends Component {
  constructor(props) {
    super(props);
    this.state = {
      events: []
    };
    let identifier = 0;
    let temp = [];

    db.collection('eventLogData').orderBy("date")
    .onSnapshot(querySnapshot => {
        querySnapshot.docChanges().forEach(change => {
          let newEvent = change.doc.data();
          newEvent.id = identifier;
          identifier = identifier + 1;
          function NewEvent(event) {
            return event === newEvent;
          }
          if(change.type === "added" && !this.state.events.find(NewEvent)) {
            temp = this.state.events;
            temp.unshift(newEvent);
            // if(this.state.events.length > 5) { //keep event log to 5 events
            //   this.state.events.pop();
            // }
            this.setState({events: temp});
          }
        });
    });
    this.state.events.forEach(element => {
      console.log(element.user);
    });
  }

  render() {
    return (
      <div className="event-log-container">
        <div>
          <h2 className="title">Event Log</h2>
        </div>
        <div className="event-log-head">
            <div className="event-prop">
              <strong>Name</strong>
            </div>
            <div className="event-prop">
              <strong>Chore</strong>
            </div>
            <div className="event-prop">
              <strong>Date</strong>
            </div>
        </div>
        <div>

        {this.state.events.map(e =>
          <Event key={e.id} user={e.name} chore={e.chore} date={e.date}>
          </Event>
        )}

        </div>
      </div>
    );
  };
}

export default App;
