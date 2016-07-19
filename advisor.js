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
    return needleGet(advisorUrl, {headers: header}).then(function (response) {
        console.log(response.toString())
        return response[0].body;
    });
};
