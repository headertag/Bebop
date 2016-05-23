
/**
 * @module private/log
 */

/**
 * @class log
 * @param {string} msg - The message to be logged
 */
function log(msg) {
    log.info(msg);
}

/**
 * @private
 */
log.doLog = function (level, css, msg) {
    console.log(
        '%c Squib Log ->' +
        '%c [' + level + ']' + '[' + Date.now() + ']: ' + msg,
        'font-weight: bold; background: pink',
        css
    );
};

/**
 * @param {string} msg - The message to be logged
 */
log.info = function (msg) {
    var css = 'font-weight: bold;';
    log.doLog('INFO', css, msg);
};

/**
 * @param {string} msg - The message to be logged
 */
log.warn = function (msg) {
    var css = 'font-weight: bold; color: magenta;';
    log.doLog('WARN', css, msg);
};

/**
 * @param {string} msg - The message to be logged
 */
log.error = function (msg) {
    var css = 'font-weight: bold; color: red;';
    log.doLog('ERROR', css, msg);
};

module.exports.log = log;
