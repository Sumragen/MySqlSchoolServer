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
    app.post('/api/stage/add', function (req, res) {
        var stage = {
            stage: req.body.stage,
            suffix: req.body.suffix,
            formmaster_id: req.body.formMaster
        };
        req.models.stage.create(stage, function (err, newStage) {
            util.checkOnErrors(res, err, newStage, function () {
                req.models.stage.get(newStage.id, {autoFetch: true, autoFetchLimit: 3}, function (err, stage) {
                    util.checkOnErrors(res, err, stage, function () {
                        res.status(200).send(createResponseBody(stage));
                    })
                });
            })
        });
    });

    /**
     * Read
     */
    function createResponseBody(stage) {
        return {
            formMaster: {
                id: stage.formMaster.id,
                name: stage.formMaster.user.first_name + ' ' + stage.formMaster.user.last_name
            },
            stage: stage.stage,
            suffix: stage.suffix,
            id: stage.id
        }
    }

    app.get('/api/stages', function (req, res) {
        req.models.stage.find({}, {autoFetch: true, autoFetchLimit: 2}, function (err, stages) {
            util.checkOnErrors(res, err, stages, function () {
                var responseBody = [];
                _.each(stages, function (stage) {
                    responseBody.push(createResponseBody(stage))
                });
                res.status(200).send(responseBody);
            });
        });
    });

    app.get('/api/stage/:id', function (req, res) {
        req.models.stage.get(req.params.id, {autoFetch: true, autoFetchLimit: 3}, function (err, stage) {
            util.checkOnErrors(req, err, stage, function () {
                res.status(200).json(stage);
            })
        });
    });

    /**
     * Update
     */
    app.put('/api/stage/:id', function (req, res) {
        req.models.stage.get(req.params.id, function (err, stage) {
            stage.stage = req.body.stage;
            stage.suffix = req.body.suffix;
            stage.formmaster_id = req.body.formMaster;
            stage.save(function (err, newStage) {
                util.checkOnErrors(res, err, newStage, function () {
                    req.models.stage.get(req.params.id, {autoFetch: true, autoFetchLimit: 3}, function (err, stage) {
                        util.checkOnErrors(res, err, stage, function () {
                            res.status(200).send(createResponseBody(stage));
                        });
                    });
                })
            });
        });
    });
    /**
     * Delete
     */
    app.delete('/api/stage/:id', function (req, res) {
        req.models.stage.find({id: req.params.id}).remove(function (err) {
            util.checkOnErrors(res, err, {}, function () {
                res.status(200).send({id: req.params.id});
            });
        });
    })
};