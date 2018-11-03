import React, { Component } from 'react';
import './App.css';


function Leaderboard(props) {
  return (
    <table class="leaderboard">
      <tr>
        <th>Rank</th>
        <th>Score</th>
        <th>Name</th>
      </tr>
      {props.people.map(p =>
        <tr>
          <td>{p.rank}</td>
          <td>{p.score}</td>
          <td>{p.name}</td>
        </tr>
      )}
    </table>
  );
}


function Roles(props) {
  return (
    <table class="roles">
      {props.people.map(p =>
        <tr>
          <td>{p.role}</td>
          <td>{p.name}</td>
        </tr>
      )}
    </table>
  );
}

class Header extends Component {
  constructor(props) {
    super(props);
    this.state = {
      board: [
        { rank: 1,
          name: "Graeme",
          score: 4
        },
        { rank: 2,
          name: "Lucas",
          score: 2
        },
        { rank: 3,
          name: "Jack",
          score: 1
        },
        { rank: 4,
          name: "Andre",
          score: 0
        }],
        roleOrder: [
          { name: "Graeme",
            role: "Counters"
           },
          { name: "Lucas",
            role: "Dishes"
           },
          { name: "Jack",
            role: "Floors"
           },
          { name: "Andre",
            role: "Garbage"
           }]
    };
  }
  render() {
    return (
      <div className="header">
        <h1>Title</h1>
        <div class="row">
          <div class="left">
            <h2>Leaderboard</h2>
            <Leaderboard people={this.state.board} />
          </div>
          <div class="right">
            <h2>Jobs</h2>
            <Roles people={this.state.roleOrder}/>
          </div>
        </div>
      </div>
    );
  }
}

export default Header;



// const firebase = require("firebase");
// // Required for side-effects
// require("firebase/firestore");

// firebase.initializeApp({
//   apiKey: '### FIREBASE API KEY ###',
//   authDomain: '### FIREBASE AUTH DOMAIN ###',
//   projectId: '### CLOUD FIRESTORE PROJECT ID ###'
// });

// // Initialize Cloud Firestore through Firebase
// var db = firebase.firestore();

// // Disable deprecated features
// db.settings({
//   timestampsInSnapshots: true
// });
