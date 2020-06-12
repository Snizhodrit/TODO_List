let router = module.exports = require('express').Router();
const sqlite3 = require('sqlite3').verbose();

let db = new sqlite3.Database('./schema.sql', (err) => {
	if (err) {
	  return console.error(err.message);
	}
	console.log('Connected to the in-memory SQlite database.');
  });


router.get('/users', function (req, rsp) {
	req.db.all('select * from users', (err, users) => {
		if (users) rsp.status(200).json(users);
		else console.log("noo"); //rsp.status(404).json({ error: "User not found" });
	})
	
})

router.get('/items', function (req, rsp) {
	req.db.all('select * from items', (err, items) => {
		if (items) rsp.status(200).json(items);
		else return rsp.status(404).json({ error: "User not found" });
	})
	
})

router.post('/users', function (req, rsp) {
	req.db.all('insert into users values ($user_name, $password)',
	{
		$user_name: req.body.user_name,
		$password: req.body.password,
	}, function (err) {
		if (!err) {
		rsp.status(200).json("User added");
		}
		else return rsp.status(404).json("Fail adding user")
	})
})

router.post('/items', function (req, rsp) {
	req.db.all('insert into items (name, user_name) values ($name, $user_name)',
	{
		$name: req.body.name,
		$user_name: req.body.user_name
	}, function (err) {
		if (!err) {
		rsp.status(200).json("Item added");
		}
		else rsp.status(404).json("Failed adding item");
	})
})

router.put('/:name', function (req, rsp) {
	console.log( req.body.tag);
	console.log(req.params.name);
	req.db.run('update items set tag=? where name=?', req.body.tag, req.params.name, function (err) {
	if (!err) rsp.status(200).json("item updated")
		else rsp.status(400).json("Failed to update this item")
	})
})

router.put('/name/:name', function (req, rsp) {
	req.db.run('update items set name=? where name=?', req.body.new_name, req.params.name, function (err) {
		if (!err) rsp.status(200).json("item updated")
			else rsp.status(400).json("Failed to update this item")
		})
})

router.delete('/:user_name', function(req, rsp) {
	req.db.run('DELETE FROM users WHERE user_name=?', req.params.user_name, function (err) {
		if (!err) rsp.status(200).json("User updated")
			else rsp.status(400).json("Fail to update this user")
		})
})

router.use(function (req, rsp) {
	rsp.status(404).json({ error: "No such route found" })
});