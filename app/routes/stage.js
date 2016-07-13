/**
 * Created by trainee on 6/9/16.
 */
var _ = require('lodash'),
    libs = process.cwd() + '/app/',
    Stage = require(libs + 'db/model/stage'),
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
    app.post('/api/stage/add', function (req, res) {
        var stage = {
            stage: req.body.stage,
            suffix: req.body.suffix,
            formmaster_id: req.body.formMaster
        };
        req.models.stage.create(stage, function (err, newStage) {
            checkOnError(res, err, newStage, function () {
                req.models.stage.get(newStage.id, {autoFetch: true, autoFetchLimit: 3}, function (err, stage) {
                    checkOnError(res, err, stage, function () {
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
            if (err) {
                res.status(500).send({message: err});
            } else {
                var responseBody = [];
                _.each(stages, function (stage) {
                    responseBody.push(createResponseBody(stage))
                });
                res.status(200).send(responseBody);
            }
        });
    });

    app.get('/api/stage/:id', function (req, res) {
        req.models.stage.get(req.params.id, {autoFetch: true, autoFetchLimit: 3}, function (err, stage) {
            checkOnError(req, err, stage, function () {
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
                checkOnError(res, err, newStage, function () {
                    req.models.stage.get(req.params.id, {autoFetch: true, autoFetchLimit: 3}, function (err, stage) {
                        checkOnError(res, err, stage, function () {
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
        Stage.findById(req.params.id, function (err, stage) {
            checkOnError(res, err, stage, function () {
                stage.remove(function (err) {
                    if (err) {
                        res.status(err.code).send({message: err});
                    } else {
                        res.status(200).send({message: 'Stage deleted'});
                    }
                })
            });
        });
    })
};