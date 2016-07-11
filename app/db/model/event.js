/**
 * Created by trainee on 6/9/16.
 */
module.exports = function (db) {
    var Event = db.define('event', {
        id: {type: Number, index: true},
        name: {type: 'text', unique: true},
        date: Date,
        description: {type: 'text'},
        address: {type: 'text'},
        location: {type: 'text'}
    }, {
        methods: {
            getValue: function () {
                var response = this;
                response.location = {
                    latitude: this.location.split(';')[0],
                    longitude: this.location.split(';')[1]
                };
                return response;
            }
        }
    });

    return Event;
};
