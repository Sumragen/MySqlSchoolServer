/**
 * Created by trainee on 6/9/16.
 */
var _ = require('lodash'),
    libs = process.cwd() + '/app/',
    util = require(libs + 'common/util'),
    log = require(libs + 'log');

module.exports = function (app) {
    //CRUD
    /**
     * Create
     */
    app.post('/api/event/add', function (req, res) {
        if (!req.body.address) {
            req.body.address = 'default address';
        }
        var event = _.clone(req.body);
        event.date = new Date(event.date);
        event.location = event.location ? event.location.latitude + ';' + event.location.longitude : ';';
        req.models.event.create(event, function (err, newEvent) {
            if (err) {
                res.status(500).send({message: err});
            } else {
                res.status(200).send(newEvent.getValue());
            }
        });
    });

    /**
     * Read
     */
    app.get('/api/events', function (req, res) {
        req.models.event.find(null, function (err, events) {
            util.checkOnErrors(res, err, events, function () {
                var respBody = [];
                _.each(events, function (event) {
                    respBody.push(event.getValue());
                });
                res.status(200).json(respBody);
            })
        });
    });

    app.get('/api/event/:id', function (req, res) {
        req.models.event.get(req.params.id, function (err, event) {
            util.checkOnErrors(res, err, event, function () {
                res.status(200).json(event);
            })
        });
    });

    /**
     * Update
     */
    app.put('/api/event/:id', function (req, res) {
        req.models.event.get(req.params.id, function (err, event) {
            util.checkOnErrors(res, err, event, function () {
                event.date = new Date(req.body.date);
                event.description = req.body.description;
                event.name = req.body.name;
                event.save(function (err) {
                    util.checkOnErrors(res, err, event, function () {
                        res.status(200).send(event);
                    });
                });
            });
        });
    });
    app.put('/api/events', function (req, res) {
        req.models.event.clear(function (err) {
            util.checkOnErrors(res, err, {}, function () {
                _.each(req.body, function (event) {
                    event.date = new Date(event.date);
                    event.address = event.address || 'default address';
                    event.location = event.location.latitude + ';' + event.location.longitude;
                    req.models.event.create(event, function (err) {
                        if (err) {
                            res.status(500).send({message: err});
                        } else {
                            res.status(200).send();
                        }
                    });
                })
            });
        });
    });
    /**
     * Delete
     */
    app.delete('/api/event/:id', function (req, res) {
        req.models.event.find({id: req.params.id}).remove(function (err) {
            if (err) {
                res.status(500).send({message: err});
            } else {
                res.status(200).send({id: req.params.id});
            }
        });
    })
};