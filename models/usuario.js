module.exports = function(sequelize, tipos){
	return sequelize.define('user', {
		email: {
			type: tipos.STRING,
			allowNull: false,
			unique: true,
			validate: {
				isEmail: true
			}
		}, 
		password: {
			type: tipos.STRING,
			allowNull: false,
			validate: {
				len: [7,100]
			}
		}
	})
} 