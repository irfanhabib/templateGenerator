var config = require('./config.json');
var Q = require('q');
var request = require('request');

function getRequestOptions(url){
    var requestOptions = {
        url: url,
        followRedirect: true,
        headers: {
            'X-API-Key': config['X-API-KEY']
        }
    };

    if (config.proxy){
        requestOptions["proxy"] = config.proxy;
    }
    return requestOptions;
}

module.exports.getRequestOptions = getRequestOptions;
module.exports.request = Q.denodeify(request);
