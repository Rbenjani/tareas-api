var bcrypt = require('bcrypt');
var _ = require('underscore');
var cryptojs = require('crypto-js');
var jwt = require('jsonwebtoken');

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
			},
			findByToken: function(token) {
				return new Promise(function(resolve, reject){
					try {
						var decodedJWT = jwt.verify(token, 'querty098');
						var bytes = cryptojs.AES.decrypt(decodedJWT, 'abc123!@!');
						var tokenData = JSON.parse(bytes.toString(cryptojs.enc.Utf8));

						user.findById(tokenData.id).then(function(user){
							if(user)
								resolver(user);
							else
								reject();
						}, function(e){
							reject();
						})
					} catch (e) {
						reject();
					}
				});
			}
		},
		instanceMethods: {
			toPublicJSON: function() {
				var json = this.toJSON();
				return _.pick(json, 'id', 'email', 'createdAt', 'updatedAt');
			},
			generateToken: function(tipo) {
				if(!_.isString(tipo)){
					return undefined;
				}

				try {
					var stringData = JSON.stringify({
						id: this.get('id'),
						type: type
					});
					var encryptedData = cryptojs.AES.encrypt(stringData, 'abc123!@!').toString();
					var token = jwt.sign({
						token: encryptedData
					}, 'qwerty098');

					return token;
				} catch (e) {
					console.error(e);
					return undefined;
				}
			}
		}
	});

	return usuario;
} 