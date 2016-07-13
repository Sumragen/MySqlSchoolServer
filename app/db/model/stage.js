/**
 * Created by trainee on 6/9/16.
 */
module.exports = function (db) {
    var Stage = db.define('stage', {
        id: {type: Number, index: true},
        stage: Number,
        suffix: {type: 'text'},
        formmaster_id: Number
    }, {});
    Stage.hasOne('formMaster', db.models.teacher, {}, {
        autoFetch: false
    });
    return Stage;
};
