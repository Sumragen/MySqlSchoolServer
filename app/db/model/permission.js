/**
 * Created by sumragen on 14.07.16.
 */
module.exports = function (db) {
    var Permission = db.define('permission', {
        id: {type: Number, index: true},
        code: {type: 'text'},
        description: {type: 'text'}
    });

    return Permission;
};