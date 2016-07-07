/**
 * Created by trainee on 6/9/16.
 */
module.exports = function (db) {
    var Subject = db.define('subject', {
        id: {type: Number, index: true},
        name: {type: 'text'},
        classroom: Number
    }, {});
    Subject.hasMany('teacher', db.models.teacher, {}, {
        autoFetch: true,
        // autoFetchLimit: 2,
        reverse: 'subject',
        key: true,
    });
    return Subject;
};
