/**
 * Created by sumragen on 13.07.16.
 */
function checkOnErrors(res, err, item, next) {
    if (err || !item) {
        res.status(err.code || 500).send({message: err.message || 'Server error'});
    } else {
        next();
    }
}

module.exports.checkOnErrors = checkOnErrors;