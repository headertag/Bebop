//? LOG = function(msg, doLog) {
    //? if (DEBUG_INFO) {
    if (/*?= doLog */ === undefined || /*?= doLog */) {
        require('./log').log(/*?= msg */);
    }
    //? }
//? }

//? LOG_INFO = function(msg, doLog) {
    //? if (DEBUG_INFO) {
    if (/*?= doLog */ === undefined || /*?= doLog */) {
        require('./log').log.info(/*?= msg */);
    }
    //? }
//? }

//? LOG_WARN = function(msg, doLog) {
    //? if (DEBUG_WARN) {
    if (/*?= doLog */ === undefined || /*?= doLog */) {
        require('./log').log.warn(/*?= msg */);
    }
    //? }
//? }

//? LOG_ERROR = function(msg, doLog) {
    //? if (DEBUG_ERROR) {
    require('./log').log.error(/*?= msg */);
    //? }
//? }

//? ASSERT_TYPE = function (test, types) {
    //? if (ENFORCE_TYPE) {
    require('./validation').enforceType(/*?= test */ /*?= "," */ /*?= types */);
    //? }
//? }
