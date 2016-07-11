/**
 * Created by trainee on 6/9/16.
 */
var _ = require('lodash'),
    libs = process.cwd() + '/app/',
    Role = require(libs + 'db/model/role'),
    mysql = require(libs + 'db/mysql'),
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
    app.post('/api/role/add', function (req, res) {
        req.models.role.create(req.body, function (err, newRole) {
            if (err) {
                res.send(err);
            } else {
                res.status(200).json(newRole);
            }
        });
        // var role = new Role(req.body);
        // role.save(function (err) {
        //     if (err) {
        //         res.send({message: err});
        //     } else {
        //         res.status(200).json(role);
        //     }
        // })
    });

    /**
     * Read
     */
    app.get('/api/roles', function (req, res) {
        req.models.role.find({}, {autoFetchLimit: 2}, function (err, roles) {
            checkOnError(res, err, roles, function () {
                res.status(200).json(roles);
            });
        });
    });

    app.get('/api/role/:id', function (req, res) {
        req.models.role.get(req.params.id, {autoFetchLimit: 1}, function (err, role) {
            checkOnError(res, err, role, function () {
                res.status(200).json(role);
            });
        });
    });

    /**
     * Update
     */
    app.put('/api/role/:id', function (req, res) {
        req.models.role.get(req.params.id, function (err, role) {
            checkOnError(res, err, role, function () {
                role.description = req.body.description;
                role.name = req.body.name;
                role.permissions = req.body.permissions;
                role.weight = req.body.weight;
                role.save(function (err) {
                    if (err) {
                        res.status(err.code).send({message: err});
                    } else {
                        res.status(200).send(role);
                    }
                })
            })
        });
        // Role.findById(req.params.id, function (err, role) {
        //     checkOnError(res, err, role, function () {
        //         role.description = req.body.description;
        //         role.name = req.body.name;
        //         role.permissions = req.body.permissions;
        //         role.weight = req.body.weight;
        //         role.save(function (err) {
        //             if (err) {
        //                 res.status(err.code).send({message: err});
        //             } else {
        //                 res.status(200).send(role);
        //             }
        //         })
        //     });
        // })
    });
    /**
     * Delete
     */
    app.delete('/api/role/:id', function (req, res) {
        req.models.role.find({id: req.params.id}).remove(function (err) {
            checkOnError(res, err, {}, function () {
                res.status(200).send({id: req.params.id});
            })
        });
        // Role.findById(req.params.id, function (err, role) {
        //     checkOnError(res, err, role, function () {
        //         role.remove(function (err) {
        //             if (err) {
        //                 res.status(err.code).send({message: err});
        //             } else {
        //                 res.status(200).send({message: 'Role deleted'});
        //             }
        //         })
        //     });
        // });
    })
};