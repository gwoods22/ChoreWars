import React, { Component } from 'react';
let moment = require('moment');

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

export default Event;