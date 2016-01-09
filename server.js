var express = require("express");
var bodyParser = require("body-parser");
var _ = require("underscore");
var db = require('./db.js');

var app = express();
var PORT = process.env.PORT || 3000;
var tareas = [];
var sigTareaId = 1;

app.use(bodyParser.json());

app.get("/", function(req, res){
	res.send("API Tareas");
});

// GET /tareas?completed=true&q=house
app.get("/tareas", function(req, res){ 
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
app.get("/tareas/:id", function(req, res){
	var tareaID = parseInt(req.params.id, 10);

	db.tarea.findById(tareaID).then(function(tarea){
		if(!!tarea) // Cast to boolean
			res.json(tarea.toJSON());
		else
			res.status(404).send();
	}, function(e){
		res.status(500).send();
	});

	var matchedTarea = _.findWhere(tareas, {id: tareaID});

	if(matchedTarea){
		res.json(matchedTarea);
	} else {
		res.status(404).send();
	}	
});

// POST /tareas
app.post("/tareas", function(req, res){
	var body = _.pick(req.body, "description", "completed");

	db.tarea.create(body).then(function(){
		res.json(tarea.toJSON());
	}, function(e){
		res.status(400).json(e);
	});

	// if(!_.isBoolean(body.completed) || !_.isString(body.description) || body.description.trim().length === 0) // Comprobar que completed sea booleano, description sea string y no vacia
	// 	return res.status(400).send(); // 400 => Bad Request

	// body.description = body.description.trim(); // Quita espacios principio y final

	// body.id = sigTareaId++;
	// tareas.push(body);

	// console.log("Description: " + body);
	// res.json(body);
});

// DELETE /tareas/:id
app.delete("/tareas/:id", function(req, res){
	var tareaID = parseInt(req.params.id, 10);
	var matchedTarea = _.findWhere(tareas, {id: tareaID});

	if(!matchedTarea)
		res.status(404).json({"error":"Tarea no encontrada con esa id"});
	else {
		tareas = _.without(tareas, matchedTarea); // Devuelve el array quitando matchedTarea
		res.json(matchedTarea);
	}
});

// PUT /tareas/:id
app.put("/tareas/:id", function(req, res){
	var tareaID = parseInt(req.params.id, 10);
	var matchedTarea = _.findWhere(tareas, {id: tareaID});
	var body = _.pick(req.body, 'description', 'completed');
	var atributos = {};

	if(!matchedTarea)
		return res.status(400).send();

	if(body.hasOwnProperty('completed') && _.isBoolean(body.completed)){
		atributos.completed = body.completed;
	} else if(body.hasOwnProperty('completed')){
		return res.status(400).send();
	} 

	if(body.hasOwnProperty('description') && _.isString(body.description))
		atributos.description = body.description;
	else if(body.hasOwnProperty('description'))
		return res.status(400).send();

	_.extend(matchedTarea, atributos); // Copia las nuevas propiedas y sobreescribe si existe
	res.json(matchedTarea);
});

db.sequelize.sync().then(function(){
	app.listen(PORT, function(){
		console.log("Express listening on port " + PORT + "!");
	})
});

