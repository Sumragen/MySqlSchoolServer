/**
 * Created by trainee on 6/9/16.
 */
var _ = require('lodash'),
    libs = process.cwd() + '/app/',
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
        req.models.user.one({username: req.body.username}, {autoFetchLimit: 2}, function (err, user) {
            if (err || !user) {
                res.status(404).send({message: 'User not found'});
            } else if (user.checkPassword(req.body.password)) {
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
        req.models.user.find({}, {autoFetchLimit: 2}, function (err, users) {
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
    app.put('/api/user/:id', function (req, res) {
        if (!req.body) {
            res.status(400);
        } else {
            req.models.user.get(req.params.id, {autoFetchLimit: 2}, function (err, user) {
                if (err || !user) {
                    res.status(!user ? 404 : 500).send({message: !user ? 'User not found' : err})
                } else {
                    var reqBody = req.body;
                    user.first_name = reqBody.first_name;
                    user.last_name = reqBody.last_name;
                    user.username = reqBody.username;
                    user.email = reqBody.email;
                    req.models.role.get(reqBody.role, function (err, role) {
                        if (err || !role) {
                            res.status(500).send({message: err});
                        } else {
                            // user.role_id = reqBody.role;
                            user.setRole(role, function (err) {
                                if (err) {
                                    res.status(500).send({message: err.msg});
                                } else {
                                    user.save(function (err) {
                                        if (err) {
                                            res.status(500).send({message: err.msg});
                                        } else {
                                            req.headerSession.getSession()
                                                .then(function (session) {
                                                    if (session.user.id == user.id) {
                                                        session['user'] = user;
                                                    }
                                                    if (role.weight >= 50 && reqBody.subjects && reqBody.subjects.length > 0) {
                                                        req.models.teacher.find({user_id: reqBody.id}, {
                                                            autoFetch: true,
                                                            autoFetchLimit: 3
                                                        }, function (err, teachers) {
                                                            if (err) {
                                                                res.status(500).send({message: err});
                                                            } else {
                                                                req.models.subject.find({id: reqBody.subjects}, function (err, subjects) {
                                                                    if (err || !subjects) {
                                                                        res.status(500).send({message: err});
                                                                    } else {
                                                                        if (teachers && teachers.length > 0) {
                                                                            teachers[0].setSubject(subjects, function (err) {
                                                                                if (err) {
                                                                                    res.status(500).send({message: err});
                                                                                } else {
                                                                                    res.status(200).json(user);
                                                                                }
                                                                            });
                                                                        } else {
                                                                            var newTeacher = {
                                                                                user_id: user.id
                                                                            };
                                                                            req.models.teacher.create(newTeacher, function (err, result) {
                                                                                if (err) {
                                                                                    res.status(500).send({message: err});
                                                                                } else {
                                                                                    result.setSubject(subjects, function (err) {
                                                                                        if (err) {
                                                                                            res.status(500).send({message: err});
                                                                                        } else {
                                                                                            res.status(200).json(user);
                                                                                        }
                                                                                    });
                                                                                }
                                                                            });
                                                                        }
                                                                    }
                                                                });
                                                            }
                                                        })
                                                    } else {
                                                        req.models.stage.find({}, {autoFetchLimit: 3}, function (err, stages) {
                                                            if (_.every(stages, function (stage) {
                                                                    return stage.formMaster.user.id != user.id
                                                                })) {
                                                                req.models.teacher.find({'user_id': reqBody.id}, function (err, teacher) {
                                                                    if (err) {
                                                                        res.status(500).send({message: err});
                                                                    } else if (teacher.length < 1) {
                                                                        res.status(200).json(user)
                                                                    } else {
                                                                        teacher[0].remove(function (err) {
                                                                            if (err) {
                                                                                res.status(500).send({message: err});
                                                                            } else {
                                                                                res.status(200).json(user);
                                                                            }
                                                                        });
                                                                    }
                                                                });
                                                            } else {
                                                                res.status(400).send({message: 'That user is form master'});
                                                            }
                                                        });
                                                    }
                                                })
                                        }
                                    })
                                }
                            });

                        }
                    });
                }
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
