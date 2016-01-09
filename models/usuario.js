var bcrypt = require('bcrypt');
var _ = require('underscore');

module.exports = function(sequelize, tipos){
	var usuario = sequelize.define('usuario', {
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
		classMethods: {
			authenticate: function(body) {
				return new Promise(function(resolve, reject){
					if(typeof body.email !== 'string' || typeof body.password !== 'string')
						return reject();

					usuario.findOne({
						where: {
							email: body.email
						}
					}).then(function(usuario){
						if(!usuario || !bcrypt.compareSync(body.password, this.password))
							return reject();

						resolve(usuario);
					}, function(e){
						reject();
					});
				});
			}
		},
		instanceMethods: {
			toPublicJSON: function() {
				var json = this.toJSON();
				return _.pick(json, 'id', 'email', 'createdAt', 'updatedAt');
			}
		}
	});

	return usuario;
} 