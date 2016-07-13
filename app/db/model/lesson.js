/**
 * Created by trainee on 6/9/16.
 */
module.exports = function (db) {
    var Lesson = db.define('lesson', {
        id: {type: Number, index: true},
        subject_id: Number,
        teacher_id: Number,
        stage_id: Number,
        classroom: Number,
        day: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Sunday', 'Saturday'],
        order: Number
    }, {});
    Lesson.hasOne('subject', db.models.subject, {}, {
        autoFetch: false
    });
    Lesson.hasOne('teacher', db.models.teacher, {}, {
        autoFetch: false
    });
    Lesson.hasOne('stage', db.models.stage, {}, {
        autoFetch: false
    });
    return Lesson;
};
