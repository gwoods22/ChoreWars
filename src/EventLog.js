import React, { Component } from 'react';
import Event from './Event'
import firebaseRef from './firebaseconfig';

const db = firebaseRef.firestore();

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

  export default EventLog;