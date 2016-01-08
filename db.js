var Sequelize = require('sequelize');
var sequelize = new Sequelize(undefined, undefined, undefined, {
	dialect: 'sqlite',
	storage: __dirname + '/data/dev-tareas-api.sqlite'
});

var db = {};

db.tarea = sequelize.import(__dirname + '/models/tarea.js');
db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;