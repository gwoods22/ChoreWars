import React from 'react';
import db from '../firebaseconfig';

const moment = require('moment');

function Leaderboard(props) {
	function addPoint(user, chore) {
		db.collection('users')
			.where('name', '==', user)
			.get()
			.then(function(querySnapshot) {
				var doc = querySnapshot.docs[0];
				var current = doc.data().points;
				doc.ref.update({
					points: current + 1,
				});
			})
			.catch(function(error) {
				console.log('Error getting documents from users: ', error);
			})
			.then(function() {
				let date = moment().utc();
				date = parseInt(date.format('YYYYMMDDHHmmss'));
				let data = {
					name: user,
					chore: chore,
					date: date,
				};
				db.collection('eventLogData').add(data);
			})
			.catch(function(error) {
				console.error('Error adding document to eventLogData: ', error);
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
				{props.people
					.sort(function compare(a, b) {
						if (a.points < b.points) return 1;
						if (a.points > b.points) return -1;
						return 0;
					})
					.map((p, index) => (
						<tr key={p.id}>
							<td>{index + 1}</td>
							<td>{p.points}</td>
							<td>{p.name}</td>
							<td className="btn-container">
								<button className="btn">Finshed Chore</button>
								<ul className="dropdown">
									<li>
										<button
											className="drop-btn"
											type="submit"
											onClick={() => {
												addPoint(p.name, 'counters');
											}}
										>
											Counters
										</button>
									</li>
									<li>
										<button
											className="drop-btn"
											type="submit"
											onClick={() => {
												addPoint(p.name, 'dishes');
											}}
										>
											Dish Unload
										</button>
									</li>
									<li>
										<button
											className="drop-btn"
											type="submit"
											onClick={() => {
												addPoint(p.name, 'garbage');
											}}
										>
											Garbage
										</button>
									</li>
									<li>
										<button
											className="drop-btn"
											type="submit"
											onClick={() => {
												addPoint(p.name, 'swept');
											}}
										>
											Sweep
										</button>
									</li>
									<li>
										<button
											className="drop-btn"
											type="submit"
											onClick={() => {
												addPoint(p.name, 'bathroom');
											}}
										>
											Bathroom
										</button>
									</li>
								</ul>
							</td>
						</tr>
					))}
			</tbody>
		</table>
	);
}

export default Leaderboard;
