/**
 * Created by sumragen on 01.07.16.
 */
var orm = require('orm'),
    log = require('./../log')(module);

module.exports = function (app) {
    app.use(orm.express("mysql://root:root@localhost/SchoolMySqlDB", {
        define: function (db, models, next) {
            models.permission = require('./model/permission')(db);
            models.role = require('./model/role')(db);
            models.user = require('./model/user')(db);
            models.teacher = require('./model/teacher')(db);
            models.subject = require('./model/subject')(db);
            models.stage = require('./model/stage')(db);
            models.event = require('./model/event')(db);
            models.lesson = require('./model/lesson')(db);
            log.info('MySql database connected.');
            next();
        }
    }));
};