import React, { Component } from 'react';
import db from '../firebaseconfig';
import Roles from './Roles';
import Leaderboard from './Leaderboard';

const moment = require('moment');
const firebase = require('firebase/app');

var usersC = db.collection('users');
var rolesDoc = db.collection('general').doc('roles');
console.log(rolesDoc)
var dateC = db.collection('general').doc('lastUpdated');

class Home extends Component {
	constructor(props) {
		super(props);
		this.state = { // TODO: put descriptions in db
			roles: [],
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
					if(this.state.people.length > 0) {
						usersC
							.orderBy('points', 'desc')
							.get()
							.then((snapshot) => {
								snapshot.forEach((doc) => {
									var newID = (doc.data().role + 1) % this.state.people.length;
									doc.ref.update({ role: newID });
								});
							})
							.catch((err) => {
								console.log('Error getting role document', err);
							});
					}
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
		rolesDoc.get().then(docSnapshot => {
			this.state.roles = docSnapshot.get('roleNames');
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
							<Roles people={this.state.people} roles={this.state.roles} />
						</div>
					</div>
				</div>
			</div>
		);
	}
}

export default Home;
