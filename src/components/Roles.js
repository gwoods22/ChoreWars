import React, { Component } from 'react';
import Role from './Role';
import db from '../firebaseconfig';

const moment = require('moment');
const firebase = require('firebase/app');

var bathC = db.collection('general').doc('bathroom');

class Roles extends Component {
	constructor(props) {
		super(props);
		this.state = {
			uBaron: {
				name: 'Upstairs Baron',
				description:
					'The Bathroom Baron for the upstairs boys. Must clean the bathroom once in the 2 week span.',
			},
			dBaron: {
				name: 'Downstairs Baron',
				description:
					'The Bathroom Baron for the downstairs boys. Must clean the bathroom once in the 2 week span.',
			},
			uID: 0,
			dID: 0,
			userCount: props.people.length,
		};
		this.toggleRoles = this.toggleRoles.bind(this);

		bathC
			.get()
			.then((doc) => {
				var dbDate = moment(
					'01/01/1970 00:00:00',
					'DD/MM/YYYY HH:mm:ss'
				).seconds(doc.data().date.seconds);
				var ms = moment().diff(dbDate);
				var offset = Math.floor(moment.duration(ms)._data.days / 7);
				if (offset > 1) {
					// let newDate = firebase.firestore.Timestamp.fromDate( new Date(dbDate.add(offset, 'w').format('YYYY-MM-DDTHH:mm:ss')))
					let newDate = firebase.firestore.Timestamp.fromDate(
						new Date(dbDate.add(offset, 'w').unix())
					);
					doc.ref.update({ date: newDate });
					// increment bathroom var
					var newUp = ((doc.data().upstairs + 1) % 3) + 3;
					var newDown = (doc.data().downstairs + 1) % 3;
					doc.ref.update({ upstairs: newUp });
					doc.ref.update({ downstairs: newDown });
					this.setState({ uID: newUp });
					this.setState({ dID: newDown });
				} else {
					this.setState({ uID: doc.data().upstairs });
					this.setState({ dID: doc.data().downstairs });
				}
			})
			.catch((err) => {
				console.log('Error getting bathroom document', err);
			});
	}

	toggleRoles = (index) => {
		if (this.state.show[0]) {
			this.setState((prevState) => ({
				// show: prevState.slice(0,index).concat([true]).concat(prevState.slice(index+1, prevState.length))
				show: new Array(this.state.userCount).fill(false),
			}));
		} else {
			this.setState((prevState) => ({
				// show: prevState.slice(0,index).concat([false]).concat(prevState.slice(index+1, prevState.length))
				show: new Array(this.state.userCount).fill(true),
			}));
		}
	};
	render() {
		return (
			<div>
				<table className="roles">
					<tbody>
						{this.props.roles && this.props.people
							? this.props.people
									.sort(function compare(a, b) {
										if (a.role < b.role) return -1;
										if (a.role > b.role) return 1;
										return 0;
									})
									.map((p) => (
										<Role
											key={p.id}
											role={this.props.roles[p.role].name}
											desc={this.props.roles[p.role].description}
											name={p.name}
										/>
									))
							: null}
						{/*
              }{ [].concat(this.props.people).map(p =>
                p.id === this.state.uID &&
                <Role key={0} class="divider" role={this.state.uBaron.name} desc={this.state.uBaron.description} name={p.name}></Role>
              )}
              { [].concat(this.props.people).map(p =>
                p.id === this.state.dID &&
                <Role key={0} role={this.state.dBaron.name} desc={this.state.dBaron.description} name={p.name}></Role>
              )}
            */}
					</tbody>
				</table>
			</div>
		);
	}
}

export default Roles;
