var Sequelize = require('sequelize');
var sequelize = new Sequelize(undefined, undefined, undefined, {
	dialect: 'sqlite',
	storage: __dirname + '/basic-sqlite-database.sqlite'
});

var Tarea = sequelize.define('tarea', { // Crea la tabla tareas con description y completed + los 3 fijos
	description: {
		type: Sequelize.STRING,
		allowNull: false,
		validate: {
			//notEmpty: true,
			len: [1,250]
		}
	},
	completed: {
		type: Sequelize.BOOLEAN,
		allowNull: false,
		defaultValue: false
	}
})

//sequelize.sync({force: true}).then(function(){ // Para que cree la tabla siempre, fuerza a que sea desde 0
sequelize.sync().then(function(){
	console.log("Everything is synced");

	Tarea.findById(2).then(function(tarea){
		if(tarea)
			console.log(tarea.toJSON());
		else
			console.log("No se encontró la tarea");
	});

	// Tarea.create({ // INSERT INTO tareas (id, description, completed, updatedAt, createdAt) VALUES ...
	// 	description: 'Take out the dog'
	// }).then(function(tarea){
	// 	return Tarea.create({
	// 		description: 'Do the class 62',
	// 		completed: true
	// 	});
	// }).then(function(){
	// 	return Tarea.findAll({
	// 		where: {
	// 			completed: false
	// 		}
	// 	});
	// }).then(function(tareas){
	// 	if(tareas){
	// 		tareas.forEach(function(tarea){
	// 			console.log(tarea.toJSON());
	// 			console.log("Sin JSON");
	// 			console.log(tarea);
	// 		});			
	// 	}
	// 	else
	// 		console.log("No se ha encontrado esa tarea");
	// })
	// .catch(function(e){
	// 	console.log(e);
	// });
});