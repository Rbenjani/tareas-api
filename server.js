var express = require("express");
var bodyParser = require("body-parser");
var _ = require("underscore");
var db = require('./db.js');
var bcrypt = require('bcrypt');
var middleware = require('./middleware.js')(db);

var app = express();
var PORT = process.env.PORT || 3000;
var tareas = [];
var sigTareaId = 1;

app.use(bodyParser.json());

app.get("/", function(req, res){
	res.send("API Tareas");
});

// GET /tareas?completed=true&q=house
app.get("/tareas", middleware.requireAuthentication, function(req, res){ 
	var query = req.query;
	var where = {};

	if(query.hasOwnProperty('completed') && query.completed === 'true')
		where.completed = true;
	else if(query.hasOwnProperty('completed') && query.completed === 'false')
		where.completed = false;

	if(query.hasOwnProperty('q') && query.q.length > 0){
		where.description = {
			$like: '%' + query.q + '%'
		}
	} 

	db.tarea.findAll({where: where}).then(function(tareas){
		res.json(tareas);
	}, function(e){
		res.status(500).send();
	})
});

// GET /tareas/:id
app.get("/tareas/:id", middleware.requireAuthentication, function(req, res){
	var tareaID = parseInt(req.params.id, 10);

	db.tarea.findById(tareaID).then(function(tarea){
		if(!!tarea) // Cast to boolean
			res.json(tarea.toJSON());
		else
			res.status(404).send();
	}, function(e){
		res.status(500).send();
	});	
});

// POST /tareas
app.post("/tareas", middleware.requireAuthentication, function(req, res){
	var body = _.pick(req.body, "description", "completed");

	db.tarea.create(body).then(function(){
		res.json(tarea.toJSON());
	}, function(e){
		res.status(400).json(e);
	});
});

// DELETE /tareas/:id
app.delete("/tareas/:id", middleware.requireAuthentication, function(req, res){
	var tareaID = parseInt(req.params.id, 10);
	db.tarea.destroy({
		where: {
			id: tareaID
		}
	}).then(function(filasBorradas){
		if(filasBorradas > 0)
			res.status(204).send(); // 204 => Sin contenido
		else {
			res.status(404).json({
				error: 'No se econtró tarea con el id ' + tareaID
			});
		}
	}, function(e){
		res.status(500).send();
	})

});

// PUT /tareas/:id
app.put("/tareas/:id", middleware.requireAuthentication, function(req, res){
	var tareaID = parseInt(req.params.id, 10);
	var body = _.pick(req.body, 'description', 'completed');
	var atributos = {};

	if(body.hasOwnProperty('completed')){
		atributos.completed = body.completed;
	} 

	if(body.hasOwnProperty('description'))
		atributos.description = body.description;
	
	db.tarea.findById(tareaID).then(function(tarea){
		if(tarea){
			tarea.update(atributos).then(function(tarea){
				res.json(tarea.toJSON());
			}, function(e){
				res.status(400).json(e);
			});
		} else {
			res.status(404).send();
		}
	}, function(){
		res.status(500).send();
	});
});

app.post('/users', function(req, res){
	var body = _.pick(req.body, 'email', 'password');

	db.usuario.create(body).then(function(usuario){
		res.json(usuario.toPublicJSON());
	}, function(e){
		res.status(400).json(e);
	});
})

// POST /users/login
app.post('/users/login', function(req, res){
	var body = _.pick(req.body, 'email', 'password');

	db.usuario.aunthenticate(body).then(function(usuario){
		var token = user.generateToken('authentication');
		if(token){
			res.header('Auth', token)).json(usuario.toPublicJSON());		
		} else {
			res.status(401).send();
		}
		
	}, function(e){
		res.status(401).send();
	});
});

db.sequelize.sync({force: true}).then(function(){
	app.listen(PORT, function(){
		console.log("Express listening on port " + PORT + "!");
	})
});

