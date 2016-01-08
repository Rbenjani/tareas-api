module.exports = function(sequelize, tipos){
	return sequelize.define('Tarea', {
		description: {
			type: tipos.STRING,
			allowNull: false,
			validate: {
				len: [1,250]
			}
		},
		completed: {
			type: tipos.BOOLEAN,
			allowNull: false,
			defaultValue: false
		}
	});
};