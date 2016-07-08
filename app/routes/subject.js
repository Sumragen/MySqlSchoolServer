/**
 * Created by trainee on 6/9/16.
 */
var _ = require('lodash'),
    libs = process.cwd() + '/app/',
    Subject = require(libs + 'db/model/subject'),
    Teacher = require(libs + 'db/model/teacher'),
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
    app.post('/api/subject/add', function (req, res) {
        var subject = new Subject(req.body);
        subject.save(function (err) {
            if (err) {
                res.send({message: err});
            } else {
                log.info('Subject created');
                res.status(200).json(subject);
            }
        })
    });

    /**
     * Read
     */
    app.get('/api/subjects', function (req, res) {
        req.models.subject.all({}, {autoFetchLimit: 2}, function (err, subjects) {
            checkOnError(req, err, subjects, function () {
                res.status(200).json(subjects);
            });
        });
    });

    app.get('/api/subject/:id', function (req, res) {
        Subject.findById(req.params.id, function (err, subject) {
            checkOnError(res, err, subject, function () {
                res.status(200).json(subject);
            });
        })
    });
    app.get('/api/subject/teacher/:id', function (req, res) {
        req.models.teacher.find({user_id: req.params.id}, {autoFetchLimit: 3}, function (err, teachers) {
            checkOnError(req, err, {}, function () {
                res.status(200).json(teachers[0] ? teachers[0].subject : null);
            });
        });
    });

    /**
     * Update
     */
    app.put('/api/subject/:id', function (req, res) {
        Subject.findById(req.params.id, function (err, subject) {
            checkOnError(res, err, subject, function () {
                subject = req.body;
                subject.save(function (err) {
                    if (err) {
                        res.status(err.code).send({message: err});
                    } else {
                        res.status(200).send(subject);
                    }
                })
            });
        })
    });
    /**
     * Delete
     */
    app.delete('/api/subject/:id', function (req, res) {
        Subject.findById(req.params.id, function (err, subject) {
            checkOnError(res, err, subject, function () {
                subject.remove(function (err) {
                    if (err) {
                        res.status(err.code).send({message: err});
                    } else {
                        res.status(200).send({message: 'Subject deleted'});
                    }
                })
            });
        });
    })
};