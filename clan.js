var Q = require('q');
var _ = require('lodash');
var needle = require('needle');
var CONSTANTS = require('./constants');
var request = require('request');

var header = {
    'X-API-Key': CONSTANTS.API_KEY
};

var requestGet = Q.denodeify(request);
var clanUrl = 'http://www.bungie.net/Platform/Group/1407864/MembersV3/?lc=en&fmt=true&lcin=true&currentPage=1';
var membershipId = 'https://www.bungie.net/Platform/Destiny/TigerXbox/Stats/GetMembershipIdByDisplayName/';
var memberCharacters = 'https://www.bungie.net/Platform/Destiny/TigerXbox/Account/';
var characterStatUrl = 'http://www.bungie.net/Platform/Destiny/Stats/TigerXbox/';


var membersStruct = {};

function getClanInformation() {

    var requestOptions = {
        url: clanUrl,
        followRedirect: true,
        proxy: 'http://proxy.sdc.hp.com:8080',
        headers: header
    };

    return requestGet(requestOptions).then(function (response) {
        return JSON.parse(response[1]);
    });
}
function getMembershipId(name) {

    var requestOptions = {
        url: membershipId + name,
        followRedirect: true,
        proxy: 'http://proxy.sdc.hp.com:8080',
        headers: header
    };

    return requestGet(requestOptions).then(function (response) {
        return JSON.parse(response[1]).Response;
    });
}

function getClanMembers(clanInformation) {

    var members = {};
    var promises = [];

    var clanMembersStruct = {};
    var clanMembers = _.get(clanInformation, 'Response.results');
    _.each(clanMembers, function (clanMember) {
        if (_.isUndefined(clanMember.user.xboxDisplayName)) {
            console.error('Skipping user: Name: ' + clanMember.user.displayName);
            return;
        }
        console.log('Getting Data for: ' + clanMember.user.xboxDisplayName)
        promises.push(getMembershipId(clanMember.user.xboxDisplayName).then(function (id) {
            clanMembersStruct[id] = {
                user: clanMember
            };
            return id;
        }));
    });

    return Q.all(promises).then(function (membershipIds) {
        promises = [];
        _.each(membershipIds, function (id) {
            promises.push(getClanMemberInfo(id).then(function (characters) {
                clanMembersStruct[id].characters = characters;
            }));
        });
        return Q.all(promises);
    }).then(function () {
        return clanMembersStruct;
    }).catch(function (err) {
        console.error('Error occurred!', err);
    });
};

function getClanMemberInfo(memberId) {

    return getClanMemberCharacters(memberId).then(function (characters) {

        var promises = [];
        _.each(characters, function (character) {
            var characterId = character.characterBase.characterId;
            promises.push(getCharacterStats(memberId, characterId));
        });
        return Q.all(promises);
    });
}

function getCharacterStats(memberId, characterId) {
    var requestOptions = {
        url: characterStatUrl + memberId + '/' + characterId,
        followRedirect: true,
        proxy: 'http://proxy.sdc.hp.com:8080',
        headers: header
    };

    return requestGet(requestOptions).then(function (response) {
        return JSON.parse(response[1]).Response;
    });

}
function getClanMemberCharacters(memberId) {

    var requestOptions = {
        url: memberCharacters + memberId,
        followRedirect: true,
        proxy: 'http://proxy.sdc.hp.com:8080',
        headers: header
    };

    return requestGet(requestOptions).then(function (response) {

        if (JSON.parse(response[1]).ErrorStatus != 'Success') {
            console.error('Request failed for: ' + memberCharacters + memberId, response[1]);
            return Q.reject();
        }
        return JSON.parse(response[1]).Response.data.characters;
    });

}

function getMemberStats() {
    return getClanInformation().then(function (info) {
        return getClanMembers(info);
    });
}
module.exports.getClanInformation = getMemberStats;
