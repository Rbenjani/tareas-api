var express = require("express");
var app = express();
var PORT = process.env.PORT || 3000;
var tareas = [{
	id: 1,
	description: "Completar curso de Node.js",
	completed: false
}, {
	id: 2,
	description: "Entrenar markers",
	completed: false
}, {
	id: 3,
	description: "Ejercicios de meter y progress",
	completed: true
}];

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
	//res.send("Asking for todo with id of " + req.params.id);
});

app.listen(PORT, function(){
	console.log("Express listening on port " + PORT + "!");
})