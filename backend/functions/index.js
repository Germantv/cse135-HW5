const functions = require('firebase-functions');
const express = require('express');
const admin = require('firebase-admin');
const cors = require('cors');

const app = express();

admin.initializeApp(functions.config().firebase);
// Automatically allow cross-origin requests
app.use(cors({ origin: true, credentials: true }));

const db = admin.firestore();


app.get("/roles", (req, res) => {
	db.collection("roles").get()
		.then((snapshot) => {
			var docsArray = []
			snapshot.forEach(doc => {
				console.log(doc.id, "=>", doc.data())
				docsArray.push(doc.data())
			});
			return res.send(docsArray)
		})
		.catch((err) => {
			console.log('Error getting documents', err);
		});
})

app.get("/reports/browsers", (req, res) => {
	db.collection('browsers').get()
		.then((snapshot) => {
			var docsArray = []
			snapshot.forEach((doc) => {
				console.log(doc.id, '=>', doc.data())
				docsArray.push(doc.data())
			});
			return res.send(docsArray)
		})
		.catch((err) => {
			console.log('Error getting documents', err);
		});
})

app.get("/reports/speed", (req, res) => {
	db.collection('speeds').get()
		.then((snapshot) => {
			var docsArray = []
			snapshot.forEach((doc) => {
				console.log(doc.id, '=>', doc.data());
				docsArray.push(doc.data())
			});
			return res.send(docsArray)
		})
		.catch((err) => {
			console.log('Error getting documents', err);
		});
})

// Expose Express API as a single Cloud Function:
exports.api = functions.https.onRequest(app);