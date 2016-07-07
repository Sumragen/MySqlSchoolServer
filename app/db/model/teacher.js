/**
 * Created by trainee on 6/17/16.
 */
module.exports = function (db) {
    var Teacher = db.define('teacher', {
        id: {type: Number, index: true},
        user_id: Number
    }, {});
    Teacher.hasOne('user', require('./user')(db), {
        autoFetch: true,
        autoFetchLimit: 2
    });
    return Teacher;
};
