/**
 * Created by trainee on 6/9/16.
 */
var _ = require('lodash'),
    libs = process.cwd() + '/app/',
    util = require(libs + 'common/util'),
    User = require(libs + 'db/model/user'),
    Role = require(libs + 'db/model/role'),
    Stage = require(libs + 'db/model/stage'),
    Teacher = require(libs + 'db/model/teacher'),
    log = require(libs + 'log')(module),
    config = require(libs + 'config');

module.exports = function (app) {
    /**
     * Login
     */
    app.post('/api/login', function (req, res) {
        req.models.user.one({username: req.body.username}, {autoFetch: true, autoFetchLimit: 2}, function (err, user) {
            util.checkOnErrors(res, err, user, function () {
                if (user.checkPassword(req.body.password)) {
                    req.headerSession.getSession()
                        .then(function (session) {
                            session['user'] = user;
                            session['user'].role.permissions = _.map(user.role.permissions, function (permission) {
                                return permission.id;
                            });
                            res.status(200).json({
                                currentUser: user,
                                sessionID: req.headerSession.token
                            });
                        })
                } else {
                    res.status(404).send({message: 'User not found'});
                }
            });
        });
    });

    /**
     * Logout
     */
    app.post('/api/logout', function (req, res) {
        //delete req.session.authorized;
        //req.session.destroy(function (err) {
        //    if(err){
        //        res.status(err.code).send({message:err});
        //    }else{
        res.status(200).send({message: 'OK'});
        //    }
        //});
    });

    /**
     * Create
     */
    //register
    app.post('/api/user/add', function (req, res) {
        req.models.role.find({name: config.get('default:role')}, function (err, roles) {
            if (err) {
                res.status(500).send({message: 'Role not found'});
            } else {
                var user = {
                    email: req.body.email,
                    first_name: req.body.first_name,
                    last_name: req.body.last_name,
                    username: req.body.username,
                    role_id: roles[0].id,
                    created: new Date()
                };
                req.models.user.create(user, function (err, newUser) {
                    if (err) {
                        res.status(400).send(err);
                    } else {
                        newUser.generatePassword(req.body.password);
                        newUser.save(function (err) {
                            if (err) {
                                res.status(500).send(err);
                            } else {
                                res.status(200).send(newUser);
                            }
                        });
                    }
                });
            }
        });
    });

    /**
     * Read
     */
    // List
    app.get('/api/users', function (req, res) {
        req.models.user.find({}, {autoFetch: true, autoFetchLimit: 2}, function (err, users) {
            if (err || !users) {
                res.status(500).send({message: err || 'Users not found'});
            } else {
                if (req.query.limit && req.query.offset) {
                    res.status(200).json(users.splice(Number(req.query.offset), Number(req.query.limit)));
                } else {
                    res.status(200).json(users);
                }
            }
        });
    });

    // Get user by id
    app.get('/api/user/:id', function (req, res) {
        req.models.user.get(req.params.id, function (err, user) {
            if (err) {
                res.status(500).send(err);
            } else {
                res.status(200).send(user);
            }
        });
    });

    /**
     * Update
     */
    function saveRecord(req, res, user, cb) {
        user.save(function (err) {
            util.checkOnErrors(res, err, {}, function () {
                req.headerSession.getSession()
                    .then(function (session) {
                        if (session.user.id == user.id) {
                            session['user'] = user;
                        }
                        cb();
                    })
            });
        });
    }

    app.put('/api/user/:id', function (req, res) {
        if (!req.body) {
            res.status(400);
        } else {
            req.models.user.get(req.params.id, {autoFetch: true, autoFetchLimit: 2}, function (err, user) {
                util.checkOnErrors(res, err, user, function () {
                    var reqBody = req.body;
                    user.first_name = reqBody.first_name;
                    user.last_name = reqBody.last_name;
                    user.username = reqBody.username;
                    user.email = reqBody.email;
                    req.models.role.get(reqBody.role, function (err, role) {
                        util.checkOnErrors(res, err, role, function () {
                            if (role.weight >= 50 && reqBody.subjects && reqBody.subjects.length > 0) {
                                user.role_id = reqBody.role;
                                saveRecord(req, res, user, function () {
                                    req.models.teacher.find({user_id: reqBody.id}, {
                                        autoFetch: true,
                                        autoFetchLimit: 3
                                    }, function (err, teachers) {
                                        util.checkOnErrors(res, err, teachers, function () {
                                            req.models.subject.find({id: reqBody.subjects}, function (err, subjects) {
                                                util.checkOnErrors(res, err, subjects, function () {
                                                    if (teachers && teachers.length > 0) {
                                                        teachers[0].setSubject(subjects, function (err) {
                                                            util.checkOnErrors(res, err, {}, function () {
                                                                res.status(200).json(user);
                                                            });
                                                        });
                                                    } else {
                                                        req.models.teacher.create({user_id: user.id}, function (err, result) {
                                                            util.checkOnErrors(res, err, result, function () {
                                                                result.setSubject(subjects, function (err) {
                                                                    util.checkOnErrors(res, err, {}, function () {
                                                                        res.status(200).json(user);
                                                                    });
                                                                });
                                                            });
                                                        });
                                                    }
                                                });
                                            });
                                        });
                                    })
                                });
                            } else {
                                req.models.stage.find({}, {
                                    autoFetch: true,
                                    autoFetchLimit: 3
                                }, function (err, stages) {
                                    util.checkOnErrors(res, err, stages, function () {
                                        if (_.every(stages, function (stage) {
                                                return stage.formMaster.user.id != user.id
                                            })) {
                                            user.role_id = reqBody.role;
                                            saveRecord(req, res, user, function () {
                                                req.models.teacher.find({'user_id': reqBody.id}, function (err, teacher) {
                                                    if (err) {
                                                        res.status(500).send({message: err});
                                                    } else if (teacher.length < 1) {
                                                        res.status(200).json(user)
                                                    } else {
                                                        teacher[0].remove(function (err) {
                                                            util.checkOnErrors(res, err, {}, function () {
                                                                res.status(200).json(user);
                                                            });
                                                        });
                                                    }
                                                });
                                            });
                                        } else {
                                            res.status(400).send({message: 'That user is form master'});
                                        }
                                    });
                                });
                            }
                        });
                    });
                })
            });
        }
    });

    /**
     * Delete
     */
    app.delete('/api/user/:id', function (req, res) {
        req.models.user.get(req.params.id).remove(function (err) {
            if (err) {
                res.status(500).send(err);
            } else {
                res.status(200).send({id: req.params.id});
            }
        });
    });
};
