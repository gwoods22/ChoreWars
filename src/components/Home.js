import React, { Component } from 'react';
import db from '../firebaseconfig';
import Roles from './Roles';
import Leaderboard from './Leaderboard';

const moment = require('moment');
const firebase = require('firebase/app');

var usersC = db.collection('users');
var dateC = db.collection('general').doc('lastUpdated');

class Home extends Component {
	constructor(props) {
		super(props);
		this.state = {
			roles: [
				{
					name: 'Counter Commander',
					description:
						'Keep counters and table clean and wipe stovetop if needed.',
				},
				{
					name: 'Dish Deputy',
					description:
						"Make sure Billy's are doing their dishes and keeping sink clear. No need to do other's dishes.",
				},
				{
					name: 'Garbage Governor',
					description: 'Take out garbage with help from the Garbage Governor.',
				},
				{
					name: 'Recycling Ranger',
					description: 'Take out garbage with help from the Recycling Ranger.',
				},
				{
					name: 'Living Room Lieutenant',
					description: 'Militantly enforce a clean living room table.',
				},
				{
					name: 'Sweeping Sergeant',
					description: 'Sweep kitchen when needed.',
				},
			],
			people: [],
		};

		dateC
			.get()
			.then((doc) => {
				var dbDate = moment(doc.data().date.toDate());
				var days = moment().diff(dbDate, 'days');

				if (days > 6) {
					let newDate = firebase.firestore.Timestamp.fromDate(
						new Date(
							dbDate
								.add(Math.floor(days / 7), 'w')
								.format('YYYY-MM-DDTHH:mm:ss')
						)
					);
					doc.ref.update({ date: newDate });
					// increment role ID once
					usersC
						.orderBy('points', 'desc')
						.get()
						.then((snapshot) => {
							snapshot.forEach((doc) => {
								var newID = (doc.data().role - 1) % 6;
								doc.ref.update({ role: newID });
							});
						})
						.catch((err) => {
							console.log('Error getting role document', err);
						});
					//realtime update people array
					usersC.onSnapshot(
						(querySnapshot) => {
							var newArray = [];
							querySnapshot.forEach((userDoc) => {
								newArray.push(userDoc.data());
								this.setState({ people: newArray });
							});
						},
						(err) => {
							console.log(`Encountered error: ${err}`);
						}
					);
				} else {
					//just get people
					usersC.onSnapshot(
						(querySnapshot) => {
							var newArray = [];
							querySnapshot.forEach((doc) => {
								newArray.push(doc.data());
								this.setState({ people: newArray });
							});
						},
						(err) => {
							console.log(`Encountered error: ${err}`);
						}
					);
				}
			})
			.catch((err) => {
				console.log('Error getting date document', err);
			});
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
							<Roles people={this.state.people} roles={this.state.roles} />
						</div>
					</div>
				</div>
			</div>
		);
	}
}

export default Home;
