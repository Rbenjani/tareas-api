var bcrypt = require('bcrypt');
var _ = require('underscore');

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
		salt: {
			type: tipos.STRING
		},
		password_hash: {
			type: tipos.STRING
		},
		password: {
			type: tipos.VIRTUAL,
			allowNull: false,
			validate: {
				len: [7,100]
			},
			set: function(value){
				var salt = bcrypt.genSaltSync(10);
				var hashedpassword = bcrypt.hashSync(value, salt);

				this.setDataValue('password', value);
				this.setDataValue('salt', salt);
				this.setDataValue('password_hash', hashedpassword);
			}
		}
	}, {
		hooks: {
			beforeValidate: function(usuario, options){
				if(typeof usuario.email === 'string') {
					usuario.email = usuario.email.toLowerCase();
				}
			}
		},
		instanceMethods: {
			toPublicJSON: function() {
				var json = this.toJSON();
				return _.pick(json, 'id', 'email', 'createdAt', 'updatedAt');
			}
		}
	});
} 