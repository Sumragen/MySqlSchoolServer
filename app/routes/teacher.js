/**
 * Created by trainee on 6/17/16.
 */
var _ = require('lodash'),
    libs = process.cwd() + '/app/',
    Teacher = require(libs + 'db/model/teacher'),
    User = require(libs + 'db/model/user'),
    log = require(libs + 'log');

function checkOnError(res, err, item, next) {
    if (err) {
        res.status(err.code).send({message: err});
    } else if (!item) {
        res.status(404).send({message: 'Not found!'});
    } else {
        next();
    }
}

module.exports = function (app) {
    //CRUD
    /**
     * Create
     */
    app.post('/api/teacher/add', function (req, res) {
        req.models.teacher.create(req.body, function (err, newTeacher) {
            if (err) {
                res.send({message: err});
            } else {
                res.status(200).json(newTeacher);
            }
        });
    });

    /**
     * Read
     */
    app.get('/api/teachers', function (req, res) {
        req.models.teacher.find({}, {autoFetchLimit: 3}, function (err, teachers) {
            checkOnError(res, err, teachers, function () {
                res.status(200).send(teachers);
            });
        });
    });

    app.get('/api/teacher/:id', function (req, res) {
        req.models.teacher.get(req.params.id, function (err, teacher) {
            checkOnError(res, err, teacher, function () {
                res.status(200).json(teacher);
            });
        });
    });

    /**
     * Update
     */
    app.put('/api/teacher/:id', function (req, res) {
        req.models.teacher.get(req.params.id, function (err, teacher) {
            res.status(500).send({message: 'empty'});
        });
        // Teacher.findById(req.params.id, function (err, teacher) {
        //     checkOnError(res, err, teacher, function () {
        //         teacher = req.body;
        //         teacher.save(function (err) {
        //             if (err) {
        //                 res.status(err.code).send({message: err});
        //             } else {
        //                 res.status(200).send(teacher);
        //             }
        //         })
        //     });
        // })
    });
    /**
     * Delete
     */
    app.delete('/api/teacher/:id', function (req, res) {
        req.models.teacher.find({id: req.params.id}).remove(function (err) {
            checkOnError(res, err, {}, function () {
                res.status(200).send({id: req.params.id});
            })
        });
    })
};