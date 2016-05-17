'use strict';

var type = require('./type'),
    util = require('./util');

function errorCheck(errors) {
    if (errors.length > 0) {
        util.invalidStateError(errors);
    }
}

function HeadertagConfig(enabled, reference) {
    //Enabled :bool, default false;  reference: function
    var errors = [], msg = '';

    switch (type.getType(enabled)) {
        case 'undefined':
            enabled = false;
            break;
        case 'boolean': break;
        default:
            msg = 'headertag.enabled Option: type: boolean, default false';
            errors.push(msg);
    }

    switch (type.getType(reference)) {
        case 'function': break;
        case 'undefined':
            reference = function () {
                util.invalidStateError(errors);
            };
            /* falls through */
        default:
            if (enabled) {
                msg = 'headertag.reference Option: type: function, default none';
                errors.push(msg);
            }
    }

    this.errors = function () {
        return errors;
    };

    this.enabled = function () {
        errorCheck(errors);
        return enabled;
    };

    this.reference = function () {
        errorCheck(errors);
        return reference();
    };
}

function GPTConfig(disableInitalLoad, loadTag) {
    var errors = [], msg = '';

    switch (type.getType(disableInitalLoad)) {
        case 'undefined':
            disableInitalLoad = false;
            break;
        case 'boolean': break;
        default:
            msg = 'gpt.disableInitalLoad Option: type: boolean, default: false';
            errors.push(msg);
    }

    switch (type.getType(loadTag)) {
        case 'undefined':
            loadTag = false;
            break;
        case 'boolean': break;
        default:
            msg = 'gpt.loadTag Option: type: boolean, default: true';
            errors.push(msg);
    }

    this.errors = function () {
        return errors;
    };

    this.disableInitalLoad = function () {
        errorCheck(errors);
        return disableInitalLoad;
    };

    this.loadTag = function () {
        errorCheck(errors);
        return loadTag;
    };
}

function ViewPortConfig(vpsConfig) {
    //vpsConfig is obj,  getViewPortSize is func , viewCatagories is object, viewCatagories[size] is number
    var viewCatagories = {'huge': 0, 'large': 0, 'medium': 0, 'small': 0, 'mini': 0},
        getViewPortSize,
        errors = [],
        msg = '';

    if (!type.isObj(vpsConfig)) {
        msg = 'viewPortSizes is required configuration';
        errors.push(msg);
        vpsConfig = {};
    }

    getViewPortSize = vpsConfig.getViewPortSize;

    if (!type.isFunc(getViewPortSize)) {
        msg = 'viewPortSizes.getViewPortSize Option: type: function, required: true';
        errors.push(msg);
    }

    if(typeof viewCatagories !=='undefined'){
        
        util.foreachProp(viewCatagories, function (size) {
            if (type.isInt(vpsConfig[size])) {
                viewCatagories[size] = vpsConfig[size];
            }
            else {
                delete viewCatagories[size];
            }
        });
    } else {
        msg = 'viewCatagories undefined';
        errors.push(msg);
    }
    
    if (util.isEmptyObject(viewCatagories)) {
        msg = 'At lease one size option is required';
        errors.push(msg);
    }

    this.errors = function () {
        return errors;
    };

    this.viewCatagory = function () {
        var width, sizeCatagory;

        errorCheck(errors);

        width = this.viewPortSize();
        sizeCatagory = util.foreachProp(viewCatagories, function (catagory, size) {
            if (width >= size) {
                return catagory;
            }
        });

        if (type.isUndef(sizeCatagory)) {
            return null;
        }
        return sizeCatagory;
    };

    this.viewCatagories = function () {
        errorCheck(errors);
        return viewCatagories;
    };

    this.viewPortSize = function () {
        errorCheck(errors);
        return getViewPortSize();
    };
}

function SquibConfig(headertagConfig, gptConfig, viewPortConfig) {
    var errors = [];

    this.headertag = headertagConfig;
    this.gpt = gptConfig;
    this.viewPort = viewPortConfig;

    errors = errors.concat(
        this.headertag.errors(),
        this.gpt.errors(),
        this.viewPort.errors()
    );

    this.errors = function () {
        return errors;
    };
}

module.exports = {
    HeadertagConfig: HeadertagConfig,
    GPTConfig: GPTConfig,
    ViewPortConfig: ViewPortConfig,
    SquibConfig: SquibConfig
};
