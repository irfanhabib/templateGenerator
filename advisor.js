var Q = require('q');
var _ = require('lodash');
var needle = require('needle');
var CONSTANTS = require('./constants');

var header = {
    'X-API-Key': CONSTANTS.API_KEY
};

var needleGet = Q.denodeify(needle.get);
var advisorUrl = 'http://www.bungie.net/Platform/Destiny/Advisors/?definitions=true';

module.exports.getAdvisor = function () {

    return Q.resolve(require('./advisor.json'));
    // return needleGet(advisorUrl, {headers: header, proxy: 'http://proxy.sdc.hp.com:8080'}).then(function (response) {
    //     console.log(response.toString())
    //     return response[0].body;
    // });
};
