/**
 * Created by trainee on 6/9/16.
 */
module.exports = function(db){
    var Event = db.define('event', {
        id: {type: Number, index: true},
        name: {type: 'text', unique: true},
        date: Date,
        description: {type: 'text'},
        address: {type: 'text'},
        location: {type: 'text'}
    }, {});
    return Event;
};
