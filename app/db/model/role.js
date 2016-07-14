/**
 * Created by trainee on 6/8/16.
 */
module.exports = function (db) {
    var Role = db.define('role', {
        id: {type: Number, index: true},
        name: {type: 'text', unique: true},
        weight: Number,
        description: {type: 'text'}
    }, {});
    Role.hasMany('permissions', db.models.permission, {}, {
        autoFetch: true
    });

    return Role;
};
