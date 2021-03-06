/**
 * Created by trainee on 6/7/16.
 */
var libs = process.cwd() + '/app/',
    mongoose = require(libs + 'db/mongoose'),
    Schema = mongoose.Schema;


var AccessToken = new Schema({
    userId: {type: String, required: true},
    clientId: {type: String, required: true},
    token: {type: String, unique: true, required: true},
    created: {type: Date, default: Date.now}
});

module.exports = mongoose.model('AccessToken', AccessToken);