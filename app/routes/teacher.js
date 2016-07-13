/**
 * Created by trainee on 6/17/16.
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
    app.post('/api/teacher/add', function (req, res) {
        req.models.teacher.create(req.body, function (err, newTeacher) {
            util.checkOnErrors(res, err, newTeacher, function () {
                res.status(200).json(newTeacher);
            });
        });
    });

    /**
     * Read
     */
    app.get('/api/teachers', function (req, res) {
        req.models.teacher.find({}, {autoFetch: true, autoFetchLimit: 3}, function (err, teachers) {
            util.checkOnErrors(res, err, teachers, function () {
                res.status(200).send(teachers);
            });
        });
    });

    app.get('/api/teacher/:id', function (req, res) {
        req.models.teacher.get(req.params.id, {autoFetch: true, autoFetchLimit: 3}, function (err, teacher) {
            util.checkOnErrors(res, err, teacher, function () {
                res.status(200).json(teacher);
            });
        });
    });

    /**
     * Update
     */
    app.put('/api/teacher/:id', function (req, res) {
        req.models.teacher.get(req.params.id, function (err, teacher) {
            util.checkOnErrors(res, err, teacher, function () {
                res.status(500).send({message: 'empty'});
            });
        });
    });
    /**
     * Delete
     */
    app.delete('/api/teacher/:id', function (req, res) {
        req.models.teacher.find({id: req.params.id}).remove(function (err) {
            util.checkOnErrors(res, err, {}, function () {
                res.status(200).send({id: req.params.id});
            })
        });
    })
};