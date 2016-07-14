/**
 * Created by sumragen on 14.07.16.
 */
var _ = require('lodash'),
    libs = process.cwd() + '/app/',
    util = require(libs + 'common/util'),
    log = require(libs + 'log');

module.exports = function (app) {
    app.get('/api/permissions', function (req, res) {
        req.models.permission.find({}, {}, function (err, permissions) {
            util.checkOnErrors(res, err, permissions, function () {
                res.status(200).json(permissions);
            });
        });
    });
};