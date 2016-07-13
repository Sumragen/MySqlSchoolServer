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
    app.post('/api/role/add', function (req, res) {
        req.models.role.create(req.body, function (err, newRole) {
            util.checkOnErrors(res, err, newRole, function () {
                res.status(200).json(newRole);
            });
        });
    });

    /**
     * Read
     */
    app.get('/api/roles', function (req, res) {
        req.models.role.find({}, {autoFetchLimit: 2}, function (err, roles) {
            util.checkOnErrors(res, err, roles, function () {
                res.status(200).json(roles);
            });
        });
    });

    app.get('/api/role/:id', function (req, res) {
        req.models.role.get(req.params.id, {autoFetchLimit: 1}, function (err, role) {
            util.checkOnErrors(res, err, role, function () {
                res.status(200).json(role);
            });
        });
    });

    /**
     * Update
     */
    app.put('/api/role/:id', function (req, res) {
        req.models.role.get(req.params.id, function (err, role) {
            util.checkOnErrors(res, err, role, function () {
                role.description = req.body.description;
                role.name = req.body.name;
                role.permissions = req.body.permissions;
                role.weight = req.body.weight;
                role.save(function (err, newRole) {
                    util.checkOnErrors(res, err, newRole, function () {
                        res.status(200).send(newRole);
                    });
                })
            })
        });
    });
    /**
     * Delete
     */
    app.delete('/api/role/:id', function (req, res) {
        req.models.role.find({id: req.params.id}).remove(function (err) {
            util.checkOnErrors(res, err, {}, function () {
                res.status(200).send({id: req.params.id});
            })
        });
    })
};