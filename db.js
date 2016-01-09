var Sequelize = require('sequelize');
var env = process.env.NODE_ENV || 'developer';
var sequelize;

if(env === 'production') {
	sequelize = new Sequelize(process.env.DATABASE_URL, {
		dialect: 'postgres'
	});
} else {
	sequelize = new Sequelize(undefined, undefined, undefined, {
		dialect: 'sqlite',
		storage: __dirname + '/data/dev-tareas-api.sqlite'
	});
}


var db = {};

db.tarea = sequelize.import(__dirname + '/models/tarea.js');
db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;