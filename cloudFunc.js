// See https://github.com/dialogflow/dialogflow-fulfillment-nodejs
// for Dialogflow fulfillment library docs, samples, and to report issues
'use strict';

const admin = require('firebase-admin');
const functions = require('firebase-functions');
const { WebhookClient } = require('dialogflow-fulfillment');
const { Card, Suggestion } = require('dialogflow-fulfillment');
const firebase = require('firebase');
const moment = require('moment');
// Required for side-effects
require('firebase/firestore');

firebase.initializeApp({
	apiKey: 'AIzaSyAlWvWD1ISY8c2_QOCZ7H_Spj9GlpiolP4',
	authDomain: 'emersonchores.firebaseapp.com',
	projectId: 'emersonchores',
});

// Initialize Cloud Firestore through Firebase
var db = firebase.firestore();

process.env.DEBUG = 'dialogflow:debug'; // enables lib debugging statements

exports.dialogflowFirebaseFulfillment = functions.https.onRequest(
	(request, response) => {
		const agent = new WebhookClient({ request, response });
		console.log(
			'Dialogflow Request headers: ' + JSON.stringify(request.headers)
		);
		console.log('Dialogflow Request body: ' + JSON.stringify(request.body));
		//   if(request.body.parameters.name) {
		//     console.log(request.body.parameters.name);
		//   }
		function welcome(agent) {
			agent.add(`Welcome to Chore Wars!`);
		}

		function fallback(agent) {
			agent.add(`I didn't understand`);
			agent.add(`I'm sorry, can you try again?`);
		}

		// // Uncomment and edit to make your own intent handler
		// // uncomment `intentMap.set('your intent name here', yourFunctionHandler);`
		// // below to get this function to be run when a Dialogflow intent is matched
		function finishedChoreHandler(agent) {
			var choreName = agent.parameters.choreName;
			console.log(agent.intent);
			db.collection('cloudFuncState')
				.where('id', '==', 'lastChore')
				.get()
				.then(function(querySnapshot) {
					var doc = querySnapshot.docs[0];
					doc.ref
						.update({
							lastChore: choreName,
						})
						.then(function() {
							console.log(choreName);
						});
				})
				.catch(function(error) {
					console.log(
						'Error getting documents in finshedChoreHandler: ',
						error
					);
				});
			agent.add(`What's your name?`);
		}

		//TODO: add name if not already in system
		function nameHandler(agent) {
			var date;
			var data;
			var currentChore;
			// console.log(agent.intent);
			var name = agent.parameters.name;

			db.collection('users')
				.where('name', '==', name)
				.get()
				.then(function(querySnapshot) {
					//console.log("check1");
					var doc = querySnapshot.docs[0];
					var current = doc.data().points;
					doc.ref.update({
						points: current + 1,
					});

					//console.log("Check3");
				})
				.catch(function(error) {
					console.log('Error getting documents from users: ', error);
				});

			db.collection('cloudFuncState')
				.where('id', '==', 'lastChore')
				.get()
				.then(function(querySnapshot) {
					//console.log("check1");
					var doc = querySnapshot.docs[0];
					date = moment();
					date = date.format('MM/DD/YYYY HH:mm:ss');
					currentChore = doc.data().lastChore;
					console.log('Current Chore');
				})
				.then(function() {
					data = {
						name: name,
						chore: currentChore,
						date: date,
					};
				})
				.then(function() {
					db.collection('eventLogData').add(data);
				})
				.catch(function(error) {
					console.error('Error adding document to eventLogData: ', error);
				});
			agent.add('Thanks ' + agent.parameters.name + '!');
		}

		// // Uncomment and edit to make your own Google Assistant intent handler
		// // uncomment `intentMap.set('your intent name here', googleAssistantHandler);`
		// // below to get this function to be run when a Dialogflow intent is matched
		// function googleAssistantHandler(agent) {
		//   let conv = agent.conv(); // Get Actions on Google library conv instance
		//   conv.ask('Hello from the Actions on Google client library!') // Use Actions on Google library
		//   agent.add(conv); // Add Actions on Google library responses to your agent's response
		// }
		// // See https://github.com/dialogflow/dialogflow-fulfillment-nodejs/tree/master/samples/actions-on-google
		// // for a complete Dialogflow fulfillment library Actions on Google client library v2 integration sample

		// Run the proper function handler based on the matched Dialogflow intent name
		let intentMap = new Map();
		intentMap.set('Default Welcome Intent', welcome);
		intentMap.set('Default Fallback Intent', fallback);
		intentMap.set('finishedChore', finishedChoreHandler);
		intentMap.set('finishedChore - name', nameHandler);
		// intentMap.set('your intent name here', googleAssistantHandler);
		agent.handleRequest(intentMap);
	}
);
