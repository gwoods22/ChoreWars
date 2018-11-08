import React, {Component} from 'react';
import firebaseRef from './firebaseconfig';

const db = firebaseRef.firestore();

let moment = require('moment');

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
  
class Home extends Component {
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

  export default Home;