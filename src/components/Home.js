import React, {Component} from 'react';
import db from '../firebaseconfig';
import Roles from './Roles';

const moment = require('moment');
const firebase = require('firebase/app');

var usersC = db.collection('users');
var dateC = db.collection('general').doc('lastUpdated');

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

          var doc = querySnapshot.docs[0];
          var current = doc.data().points;
          doc.ref.update({
              points: current + 1
          });

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
              <td><button className="btn" type="submit" onClick={() => {addPoint(p.name)}}>Finshed Chore</button></td>
            </tr>
            )}
        </tbody>
      </table>
    );
  }


class Home extends Component {
    constructor(props) {
      super(props);
      this.state = {
        roles: [
          { name: 'Counter Commander',
            description: 'Keep counters and table clean and wipe stovetop if needed.'
          },
          { name: 'Dish Deputy',
            description: "Make sure Billy's are doing their dishes and keeping sink clear. No need to do other's dishes."
          },
          { name: 'Garbage Governor',
            description: 'Take out garbage and help Recycling Ranger.'
          },
          { name: 'Living Room Lieutenant',
            description: 'Militantly enforce a clean living room table.'
          },
          { name: 'Recycling Ranger',
            description: 'Take out recycling and help Garbage Governor.'
          },
          { name: 'Sweeping Sergeant',
            description: 'Sweep kitchen when needed.'
          }
        ],
        people: []
      };

      dateC.get()
        .then(doc => {
          var dbDate = moment("01/01/1970 00:00:00","DD/MM/YYYY HH:mm:ss").seconds(doc.data().date.seconds);
          var ms = moment().diff(dbDate);
          var offset = Math.floor(moment.duration(ms)._data.days/7);
          if (offset > 0) {
            let newDate = firebase.firestore.Timestamp.fromDate( new Date(dbDate.add(offset, 'w').format('YYYY-MM-DDTHH:mm:ss')))
            doc.ref.update({'date': newDate});
            // increment role ID once
            usersC.orderBy('points', 'desc').get()
              .then(snapshot => {
                snapshot.forEach(doc => {
                  var newID = (doc.data().role + 1) % 6;
                  doc.ref.update({'role': newID});
                });
              })
              .catch(err => {
                console.log('Error getting role document', err);
              });
            //realtime update people array
            usersC.onSnapshot(querySnapshot => {
              var newArray = [];
              querySnapshot.forEach(userDoc => {
                newArray.push(userDoc.data());
                this.setState({people:newArray});
              });
            }, err => {
              console.log(`Encountered error: ${err}`);
            });

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
            });
          }
      })
      .catch(err => {
        console.log('Error getting date document', err);
      })
    }
    render() {
      return (
        <div>
          <div className="sticky">
              <h1 className="title">Chore Wars</h1>
          </div>
          <div className="home">
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
        </div>
      );
    }
  }

  export default Home;
