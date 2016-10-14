var Q = require('q');
var _ = require('lodash');
var request = require('request');
var CONSTANTS = require('./constants');

var header = {
    'X-API-Key': CONSTANTS.API_KEY
};
var requestGet = Q.denodeify(request);

var advisorUrl = 'http://www.bungie.net/Platform/Destiny/Advisors/?definitions=true';

module.exports.getAdvisor = function () {

    var requestOptions = {
        url: advisorUrl,
        followRedirect: true,
        proxy: 'http://proxy.sdc.hp.com:8080',
        headers: header
    };

    return requestGet(requestOptions).then(function (response) {
        return JSON.parse(response[1]);
    });
};
