import React, { Component } from 'react';
import Event from './Event';
import db from '../firebaseconfig';

class EventLog extends Component {
	constructor(props) {
		super(props);
		this.state = {
			events: [],
		};
		let identifier = 0;
		let temp = [];

		db.collection('eventLogData')
			.orderBy('date')
			.onSnapshot((querySnapshot) => {
				querySnapshot.docChanges().forEach((change) => {
					let newEvent = change.doc.data();
					newEvent.id = identifier;
					identifier++;
					function NewEvent(event) {
						return event === newEvent;
					}
					if (change.type === 'added' && !this.state.events.find(NewEvent)) {
						temp = this.state.events;
						temp.unshift(newEvent);

						//keep event log to 10 events
						if (this.state.events.length > 10) {
							this.state.events.pop();
						}
						this.setState({ events: temp });
					}
				});
			});
		this.state.events.forEach((element) => {
			console.log(element.user);
		});
	}

	render() {
		return (
			<div className="event-log-container">
				<div className="event-sticky">
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
				<div className="eventlog-table">
					{this.state.events.map((e) => (
						<Event
							key={e.id}
							user={e.name}
							chore={e.chore}
							date={e.date}
						></Event>
					))}
					<br />
					<br />
					<span>
						<em>
							Note: An unknown chore indicates that the point was entered using
							the web interface.
						</em>
					</span>
				</div>
			</div>
		);
	}
}

export default EventLog;
