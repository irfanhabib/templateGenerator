var utils = require('./utils');


var advisorUrl = 'http://www.bungie.net/Platform/Destiny/Advisors/?definitions=true';

module.exports.getAdvisor = function () {

    var requestOptions = utils.getRequestOptions(advisorUrl);

    return utils.request(requestOptions).then(function (response) {
        return JSON.parse(response[1]);
    });
};
