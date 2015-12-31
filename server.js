var express = require("express");
var bodyParser = require("body-parser");
var app = express();
var PORT = process.env.PORT || 3000;
var tareas = [];
var sigTareaId = 1;

app.use(bodyParser.json());

app.get("/", function(req, res){
	res.send("Todo API Root");
});

app.get("/tareas", function(req, res){
	res.json(tareas);
});

app.get("/tareas/:id", function(req, res){
	var tareaID = parseInt(req.params.id, 10);
	var matchedTarea;
	tareas.forEach(function(tarea){
		if(tareaID === tarea.id)
			matchedTarea = tarea;
	});

	if(matchedTarea){
		res.json(matchedTarea);
	} else {
		res.status(404).send();
	}	
});

app.post("/tareas", function(req, res){
	var body = req.body;

	body.id = sigTareaId++;
	tareas.push(body);

	console.log("Description: " + body);
	res.json(body);
});

app.listen(PORT, function(){
	console.log("Express listening on port " + PORT + "!");
})