import React, { Component } from 'react';
import './App.css';

var moment = require('moment');

const firebase = require('firebase/app');
// Required for side-effects
require("firebase/firestore");

firebase.initializeApp({
  apiKey: "AIzaSyAlWvWD1ISY8c2_QOCZ7H_Spj9GlpiolP4",
  authDomain: "emersonchores.firebaseapp.com",
  projectId: "emersonchores"
});

// Initialize Cloud Firestore through Firebase
const db = firebase.firestore();
const settings = { timestampsInSnapshots: true};
db.settings(settings);

var usersC = db.collection('users');

var dateC = db.collection('general').doc('lastUpdated');


function Leaderboard(props) {
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
          </tr>
          )}
      </tbody>
    </table>
  );
}


function Roles(props) {
  return (
    <table className="roles">
      <tbody>
        {props.people.map(p =>
          <tr key={p.id}>
            <td>ROLL</td>
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
      people: [],
      lastUpdated: '',
      offset: ''
    };

    dateC.get()
      .then(doc => {
        var dbDate = moment(`${doc.data().date} 00:00:00`,"DD/MM/YYYY HH:mm:ss");
        var ms = moment().diff(dbDate);
        var offset = Math.floor(moment.duration(ms)._data.days/7);
        if (offset > 0) {
          doc.ref.update({'date': dbDate.add(offset, 'w').format("DD/MM/YYYY")});
          //new week, inc by offset
        }
      })


    usersC.orderBy('points', 'desc').get()
      .then(snapshot => {
        snapshot.forEach(doc => {
          var newArray = this.state.people.slice();
          newArray.push(doc.data());
          this.setState({people:newArray})
        });
      })
      .catch(err => {
        console.log('Error getting documents', err);
      });
  }
  render() {
    return (
      <div className="header">
        <h1>Title</h1>
        <div className="row">
          <div className="left">
            <h2>Leaderboard</h2>
            <Leaderboard people={this.state.people} />
          </div>
          <div className="right">
            <h2>Roles</h2>
            <Roles people={this.state.people}/>
          </div>
        </div>
      </div>
    )
  }
}

export default Header;
