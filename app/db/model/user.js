/**
 * Created by trainee on 6/7/16.
 */
var crypto = require('crypto');

module.exports = function (db) {
    var User = db.define('user', {
        id: {type: Number, index: true},
        first_name: {
            type: 'text',
            required: true
        },
        last_name: {
            type: 'text',
            required: true
        },
        email: {
            type: 'text',
            required: true,
            unique: true
        },
        username: {
            type: 'text',
            required: true,
            unique: true
        },
        hashedPassword: {
            type: 'text',
            required: true
        },
        salt: {
            type: 'text',
            required: true
        },
        role_id: Number,
        created: Date
    }, {
        methods: {
            getValues: function () {
                return {
                    first_name: this.first_name,
                    last_name: this.last_name,
                    username: this.username,
                    email: this.email,
                    role: this.getRole(),
                    id: this.id
                }
            },
            checkPassword: function (password) {
                return this.encryptPassword(password) === this.hashedPassword;
            },
            encryptPassword: function (password) {
                return crypto.createHmac('sha1', this.salt).update(password).digest('hex');
            },
            setPassword: function (password) {
                this._plainPassword = password;
                this.salt = crypto.randomBytes(32).toString('base64');
                this.hashedPassword = this.encryptPassword(password);
            },
            getPassword: function () {
                return this._plainPassword;
            }
        }
    });
    User.hasOne('role', require('./role')(db), {
        autoFetch: true
    });
    return User;
};
