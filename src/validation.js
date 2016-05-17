'use strict';

// Classes
var squibConfig = require('./squibconfig'),
    HeadertagConfig = squibConfig.HeadertagConfig,
    GPTConfig = squibConfig.GPTConfig,
    ViewPortConfig = squibConfig.ViewPortConfig,
    SquibConfig = squibConfig.SquibConfig,
// Modules
    type = require('./type'),
    util = require('./util'),
    log = require('./log').log;

function createSquibConfig(jsonSquibConfig) {
    var ht = jsonSquibConfig.headertag,
        gpt = jsonSquibConfig.gpt,
        vps = jsonSquibConfig.viewPortSizes,
        htCfgObj,
        gptCfgObj,
        vpCfgObj,
        squibConfig,
        errors;

    if (type.isObj(ht)) {
        htCfgObj = new HeadertagConfig(ht.enabled, ht.reference);
    }
    else {
        htCfgObj = new HeadertagConfig();
    }

    if (type.isObj(gpt)) {
        gptCfgObj = new GPTConfig(gpt.disableInitalLoad, gpt.loadTag);
    }
    else {
        gptCfgObj = new GPTConfig();
    }

    vpCfgObj = new ViewPortConfig(vps);

    squibConfig = new SquibConfig(htCfgObj, gptCfgObj, vpCfgObj);

    errors = squibConfig.errors();
    if (errors.length > 0) {
        util.foreach(errors, log.error);
        util.invalidStateError(errors);
    }
    return squibConfig;
}


function createSlotConfig(jsonSlotConfig) {
    // TODO
    /*
    AD-Unit-Path format : /[0-9]* /.*
    GPTDivId format : ""
    OPT:  targeting, format :  Object, {key:value,key:value,.....}  value format : string/stringable
    lazyload: Optional, defaults to false.  Boolean value
    viewPortSizes: Object  : Format {large:[[width,height],[width,height],[width,height]],medium:[],small[]} // needs AT LEAST one key
    
                         OR IFF interstitial==true, format is ['key1','key2','key3'.....] from above objects key types (such as large,small etc.
    
    Validates configuration matches above described format, and if not, throws an exception.
    */
    var err = {    
    }
    if (typeof jsonSlotConfig === 'undefined'){
        err['config'] = 'undefined';
        throw err;
    } else {
        if(typeof jsonSlotConfig.adUnitPath === 'undefined'){
            err['adUnitPath'] ='undefined';
        }else{
            var testAdUnitPath = new RegExp('^/\d+/.*');
            if(testAdUnitPath.test(jsonSlotConfig.adUnitPath)){
                
            } else {
                err['adUnitPath'] = 'invalidAdUnitPath';
            }
        }
        
        if(typeof jsonSlotConfig.gptDivId ==='undefined'){
            err['gptDivId'] ='undefined';
        } else if (typeof jsonSlotConfig.gptDivId === ''){
            err['gptDivId']= 'emptyString';
        }
        
        if( typeof jsonSlotConfig.targeting ==='object'){
            var keyStartChar = new RegExp(/^([0-9]).+/);
            var keyPatValChar = new RegExp(/("|'|=|!|\+|#|\*|~|;|\^|\(|\)|<|>|\[|\]|,|&| )/);
            var valPat = new RegExp(/("|'|=|!|\+|#|\*|~|;|\^|\(|\)|<|>|\[|\]|&)/);
            // !requrements for key, ^(?![0-9]).+("|'|=|!|\+|#|\*|~|;|\^|\(|\)|<|>|\[|\]|,|&| ) && length <20characters 
            // Value: ("|'|=|!|\+|#|\*|~|;|\^|\(|\)|<|>|\[|\]|&) && length < 40 characters 
            
            
            var sKey = "";
            var sVal = "";
            for ( var key in jsonSlotConfig.targeting){
                sKey = String(key);
                sVal = String(jsonSlotConfig.targeting[key]);
                if(keyStartChar.test(sKey)){
                    err['targeting.' + sKey+ '.keyStart'] = 'keyStartsWithNumber';
                }
                if(keyPatValChar.test(sKey) + '.keycontains'){
                    err['targeting.' + sKey] = 'keyHasInvalidCharacter';
                }
                if(valPat.test(sVal)){
                    err['targeting.' + sKey] = 'valueHasInvalidCharacter';
                }
                if(sKey.length >20){
                    err['targeting.' + sKey + '.length'] = 'keyTooLongMax20';
                }
                if(sVal.length>40){
                    err['targeting.' + sVal + '.length'] = 'keyTooLongMax20';
                }
            }
        }
        //Lazyload need not be checked at all - can just be used naiively with truthiness.
        var emptyVPS = false;
        if (typeof jsonSlotConfig.viewPortSizes ==='undefined'){
            err['viewPortSizes'] = 'undefinedViewportSize';
            emptyVPS = true;
        }
        if(jsonSlotConfig.interstitial&& !emptyVPS){
            if(type.isArray(jsonSlotConfig.viewPortSizes)){
                for(var i = 0; i< jsonSlotConfig.viewPortSizes.length;i++){
                    if (!(typeof jsonSlotConfig.viewPortSizes[i] ==='string')){
                        err['viewPortSizes['+ i+']'] = 'isNotAString';
                    }
                }
            } else {
                err['viewPortSizes.interstitial'] = 'isInterstitialButViewportSizesNotArray'; 
            }
        } else {
            if ( !emptyVPS ){
                if(type.isArray(jsonSlotConfig.viewPortSizes)){
                    err['viewPortSizes.notInterstitial'] = 'viewPortSizesIsArrayWhileNotInterstitialAd';
                } else if ( type.isObj(jsonSlotConfig.viewPortSizes)){
                    var count = 0;
                    for(var key in jsonSlotConfig.viewPortSizes){
                        count++;
                        if(jsonSlotConfig[key].length ===0){
                            err['jsonSlotConfig['+key+'+]'] = 'hasLengthZero';
                        }
                        for(var i = 0;i<jsonSlotConfig[key];i++){
                            if(isNaN(jsonSlotConfig[key][i][0])||isNaN(jsonSlotConfig[key][i][0])){
                                err['jsonSlotConfig['+key+']['+i+']'] = 'isNotTwoNumbers';
                            }
                            
                        }
                    }
                    if(count ===0){
                        err['jsonSlotConfig.viewPortSizes'] = 'hasNoElements';
                    }
                } else {
                    err['viewPortSizes'] = 'notObject';
                }
                    
            }
            
        }
    }
    return {
        adUnitPath: function () {
            return jsonSlotConfig.adUnitPath;
        },
        viewPortSizes: function (catagory) {
            return jsonSlotConfig.viewPortSizes[catagory] || [];
        },
        sizeCatagories: function () {
            return jsonSlotConfig.viewPortSizes;
        },
        gptDivId: function () {
            return jsonSlotConfig.gptDivId;
        },
        lazyload: function () {
            return jsonSlotConfig.lazyload;
        },
        interstitial: function () {
            return jsonSlotConfig.interstitial;
        },
        defineOnDisplay: function () {
            return jsonSlotConfig.defineOnDisplay || false;
        },
        targeting: function () {
            return jsonSlotConfig.targeting;
        }
    };
}

module.exports = {
    createSquibConfig: createSquibConfig,
    createSlotConfig: createSlotConfig
};
