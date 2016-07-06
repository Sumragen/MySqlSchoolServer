/**
 * Created by trainee on 6/9/16.
 */
module.exports = function(db){
    var Lesson = db.define('lesson', {
        id: {type: Number, index: true},
        subject: Number,
        teacher: Number,
        stage: Number,
        classroom: Number,
        day: ['Monday','Tuesday','Wednesday','Thursday','Friday','Sunday','Saturday'],
        order: Number
    }, {});
    return Lesson;
};
