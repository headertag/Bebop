
function log(msg) {
    log.info(msg);
}

log.doLog = function (level, css, msg) {
    console.log(
        '%c Squib Log ->' +
        '%c [' + level + ']' + '[' + Date.now() + ']: ' + msg,
        'font-weight: bold; background: pink',
        css
    );
};

log.info = function (msg) {
    var css = 'font-weight: bold;';
    log.doLog('INFO', css, msg);
};

log.warn = function (msg) {
    var css = 'font-weight: bold; color: magenta;';
    log.doLog('WARN', css, msg);
};

log.error = function (msg) {
    var css = 'font-weight: bold; color: red;';
    log.doLog('ERROR', css, msg);
};

module.exports.log = log;
