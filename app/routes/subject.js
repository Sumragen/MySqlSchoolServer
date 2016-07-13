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
    app.post('/api/subject/add', function (req, res) {
        res.status(500).send({message: 'In development.'})
    });

    /**
     * Read
     */
    app.get('/api/subjects', function (req, res) {
        req.models.subject.all({}, {autoFetch: true, autoFetchLimit: 2}, function (err, subjects) {
            util.checkOnErrors(req, err, subjects, function () {
                res.status(200).json(subjects);
            });
        });
    });

    app.get('/api/subject/:id', function (req, res) {
        req.models.subject.get(req.params.id, {autoFetch: true, autoFetchLimit: 3}, function (err, subject) {
            util.checkOnErrors(res, err, subject, function () {
                res.status(200).json(subject);
            })
        });
    });
    app.get('/api/subject/teacher/:id', function (req, res) {
        req.models.teacher.find({user_id: req.params.id}, {autoFetchLimit: 3}, function (err, teachers) {
            util.checkOnErrors(req, err, {}, function () {
                res.status(200).json(teachers[0] ? teachers[0].subject : null);
            });
        });
    });

    /**
     * Update
     */
    app.put('/api/subject/:id', function (req, res) {
        res.status(500).send({message: 'In development.'});
    });
    /**
     * Delete
     */
    app.delete('/api/subject/:id', function (req, res) {
        req.models.subject.find({id: req.params.id}).remove(function (err) {
            util.checkOnErrors(res, err, {}, function () {
                res.status(200).send({id: req.params.id});
            })
        });
    })
};