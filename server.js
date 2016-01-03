var express = require("express");
var bodyParser = require("body-parser");
var _ = require("underscore");
var app = express();
var PORT = process.env.PORT || 3000;
var tareas = [];
var sigTareaId = 1;

app.use(bodyParser.json());

app.get("/", function(req, res){
	res.send("Todo API Root");
});

// GET /tareas?completed=true
app.get("/tareas", function(req, res){
	var queryParams = req.query;
	var filtroTareas = tareas;

	if(queryParams.hasOwnProperty('completed') && queryParams.completed === 'true')
		filtroTareas = _.where(filtroTareas, {completed: true});
	else if(queryParams.hasOwnProperty('completed') && queryParams.completed === 'false')
		filtroTareas = _.where(filtroTareas, {completed: false});

	res.json(filtroTareas);
});


// GET /tareas/:id
app.get("/tareas/:id", function(req, res){
	var tareaID = parseInt(req.params.id, 10);
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

	if(!_.isBoolean(body.completed) || !_.isString(body.description) || body.description.trim().length === 0) // Comprobar que completed sea booleano, description sea string y no vacia
		return res.status(400).send(); // 400 => Bad Request

	body.description = body.description.trim(); // Quita espacios principio y final

	body.id = sigTareaId++;
	tareas.push(body);

	console.log("Description: " + body);
	res.json(body);
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
});

app.listen(PORT, function(){
	console.log("Express listening on port " + PORT + "!");
})