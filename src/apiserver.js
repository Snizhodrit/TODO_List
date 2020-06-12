// Create an express ap
const express = require('express');
const fs = require('fs');
const bodyParser = require('body-parser');
const app = express();
const sqlite3 = require('sqlite3');


createDb();

function createDb(ready) {
	app.db = new sqlite3.Database('./schema.db');

	// Make sure tables and initial data exist in the database
	let stmts = fs.readFileSync('schema.sql').toString().split(/;\s*\n/);
	function next(err) {
		if (err) console.warn(err);
		let stmt = stmts.shift();
		if (stmt) app.db.run(stmt, next);
		else if (ready) ready();
	}
	next();
}

// Automatically decode JSON bodies
app.use(bodyParser.json());

// Serve static data from the public directory
app.use(express.static('public'));

// Put a reference to our db in the request, so that rules can easily access it.
app.use(function (req, rsp, next) {
	req.db = app.db;
    next();
});

// Use the API subrouter
app.use('/api', require('./api'));

const userRoutes = require('./api')
app.use('/users', userRoutes);

// Start accepting requests
const listener = app.listen(3001, function () {
  console.log('Your api server is listening on port ' + listener.address().port);
});