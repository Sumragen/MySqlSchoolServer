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
    app.post('/api/lesson/add', function (req, res) {
        var lesson = req.body;
        req.models.lesson.find(function (err, lessons) {
            if (_.every(lessons, function (existLesson) {
                    if (existLesson.day == lesson.day
                        && existLesson.order == lesson.order
                        && (existLesson.teacher_id == lesson.teacher_id || existLesson.classroom == lesson.classroom)) {
                        if (existLesson.teacher_id == lesson.teacher_id) {
                            res.status(400).send({message: 'That teacher is busy'});
                        } else {
                            res.status(400).send({message: 'That classroom is busy'});
                        }
                        return false;
                    }
                    return true;
                })) {
                req.models.lesson.create(lesson, function (err, newLesson) {
                    util.checkOnErrors(res, err, newLesson, function () {
                        req.models.lesson.get(newLesson.id, {
                            autoFetch: true,
                            autoFetchLimit: 3
                        }, function (err, lesson) {
                            util.checkOnErrors(res, err, lesson, function () {
                                res.status(200).send(lesson);
                            })
                        })
                    });
                });
            }
        });
    });

    /**
     * Read
     */
    app.get('/api/lessons', function (req, res) {
        req.models.lesson.find({}, {autoFetch: true, autoFetchLimit: 3}, function (err, lessons) {
            util.checkOnErrors(res, err, lessons, function () {
                res.status(200).json(lessons);
            })
        });
    });

    app.get('/api/lesson/:id', function (req, res) {
        req.models.lesson.get(req.params.id, {autoFetch: true, autoFetchLimit: 3}, function (err, lesson) {
            util.checkOnErrors(res, err, lesson, function () {
                res.status(200).json(lesson);
            })
        });
    });
    app.get('/api/lesson/stage/:id', function (req, res) {
        req.models.lesson.find({stage_id: req.params.id}, {
            autoFetch: true,
            autoFetchLimit: 3
        }, function (err, lessons) {
            if (err) {
                res.status(500).send(err)
            } else {
                req.models.stage.get(req.params.id, {autoFetch: true, autoFetchLimit: 3}, function (err, stage) {
                    util.checkOnErrors(res, err, stage, function () {
                        if (!lessons || lessons.length <= 0) {
                            res.status(200).send({
                                stage: stage
                            })
                        } else {
                            res.status(200).send({
                                stage: stage,
                                lessons: lessons
                            })
                        }
                    })
                });
            }
        });
    });
    app.get('/api/lesson/day/:day', function (req, res) {
        req.models.lesson.find({day: req.params.day}, {autoFetch: true, autoFetchLimit: 3}, function (err, lessons) {
            util.checkOnErrors(res, err, lessons, function () {
                res.status(200).send(lessons);
            });
        });
    });

    /**
     * Update
     */
    app.put('/api/lesson/:id', function (req, res) {
        req.models.lesson.find({}, function (err, lessons) {
            var lesson = _.find(lessons, function (l) {
                return l.id == req.params.id;
            });
            lesson.order = req.body.order;
            lesson.classroom = req.body.classroom;
            lesson.stage_id = req.body.stage_id;
            lesson.subject_id = req.body.subject_id;
            lesson.teacher_id = req.body.teacher_id;

            if (_.every(lessons, function (existL) {
                    if (existL.day == lesson.day
                        && existL.order == lesson.order
                        && (existL.teacher_id == lesson.teacher_id || existL.classroom == lesson.classroom)
                        && existL.id != lesson.id) {
                        if (existL.teacher_id == lesson.teacher_id) {
                            res.status(400).send({message: 'That teacher is busy.'});
                        } else {
                            res.status(400).send({message: 'That classroom is busy.'});
                        }
                        return false;
                    }
                    return true;
                })) {
                lesson.save(function (err, newLesson) {
                    util.checkOnErrors(res, err, newLesson, function () {
                        req.models.lesson.get(req.params.id, {
                            autoFetch: true,
                            autoFetchLimit: 3
                        }, function (err, flesson) {
                            if (!err) {
                                res.status(200).send(flesson)
                            }
                        });
                    })
                })
            }
        });
    });
    var days = {
        1: 'Monday',
        2: 'Tuesday',
        3: 'Wednesday',
        4: 'Thursday',
        5: 'Friday',
        6: 'Sunday',
        7: 'Saturday'
    };
    app.put('/api/lessons', function (req, res) {
        req.models.lesson.find({}, {}, function (err, lessons) {
            var result = {isError: false, objects: []};
            _.each(req.body.objects, function (newLesson) {
                _.every(lessons, function (lesson) {
                    if (lesson.id == newLesson.id) {
                        _.every(lessons, function (checkLesson) {
                            if (newLesson.id != checkLesson.id
                                && lesson.teacher_id == checkLesson.teacher_id
                                && lesson.order == checkLesson.order
                                && days[newLesson.dow] == checkLesson.day) {
                                result.isError = true;
                                result.objects.push(lesson.id);
                                return false;
                            }
                            return true;
                        });
                        return false;
                    }
                    return true;
                })
            });
            if (!result.isError) {
                req.models.lesson.find({stage_id: req.body.stage.id}, {}, function (err, lessons) {
                    _.each(req.body.objects, function (newLesson) {
                        _.every(lessons, function (lesson) {
                            if (newLesson.id == lesson.id) {
                                lesson.day = days[newLesson.dow];
                                lesson.order = newLesson.order;
                                lesson.save(function (err) {
                                    util.checkOnErrors(res, err, {}, function () {
                                        res.status(200).send()
                                    });
                                });
                                return false;
                            }
                            return true;
                        })
                    })
                })
            } else {
                res.status(200).send(result);
            }
        })
    });
    /**
     * Delete
     */
    app.delete('/api/lesson/:id', function (req, res) {
        req.models.lesson.find({id: req.params.id}).remove(function (err) {
            util.checkOnErrors(res, err, {}, function () {
                res.status(200).send({id: req.params.id});
            })
        });
    });

    //default schedule
    app.get('/api/schedule', function (req, res) {
        req.models.stage.find({}, function (err, stages) {
            util.checkOnErrors(res, err, stages, function () {
                req.models.lesson.find({stage_id: stages[0].id}, {
                    autoFetch: true,
                    autoFetchLimit: 3
                }, function (err, lessons) {
                    util.checkOnErrors(res, err, lessons, function () {
                        res.status(200).send({stage: stages[0], lessons: lessons});
                    })
                });
            })
        });
    });
};