var Q = require('q');
var _ = require('lodash');
var needle = require('needle');
var CONSTANTS = require('./constants');
var clan = require('./clan');
var request = require('request');
var html_tablify = require('html-tablify');


var header = {
    'X-API-Key': CONSTANTS.API_KEY
};


var headers = {
    raidKills: 'Raid Kills',
    raidCompletions: 'Raid Completions',
    strikesCleared: 'Strike Completions',
    pvpKdR: 'Average K/D',
    longestKillingSpree: 'Longest Kill Spree',
    crucibleGames: 'Crucible Games'
};


function calculateStats(clanInfo) {

    var stats = {};

    stats.raidKills = [];
    stats.raidCompletions = [];
    stats.strikesCleared = [];
    // stats.arenasCleared = [];
    stats.pvpKdR = [];
    stats.longestKillingSpree = [];
    stats.crucibleGames = [];


    _.each(clanInfo, function (clanMember) {
        console.log('Total Raid Completions: ' + clanMember.user.user.displayName);
        // For each character
        var raidCompletions = 0;
        var raidKills = 0;
        var strikesCleared = 0;
        // var arenasCleared = 0;
        var pvpKdR = 0.0;
        var crucibleGames = 0.0;
        var longestKillingSpree = 0;
        _.each(clanMember.characters, function (character) {

            if (_.has(character, 'raid.allTime.activitiesCleared.basic.value')) {
                raidCompletions += character.raid.allTime.activitiesCleared.basic.value;
            } else {
                console.log(clanMember.user.user.displayName + ' has probably not raided!');
            }
            if (_.has(character, 'allStrikes.allTime.activitiesCleared.basic.value')) {
                strikesCleared += character.allStrikes.allTime.activitiesCleared.basic.value;
            } else {
                console.log(clanMember.user.user.displayName + ' has probably done any strikes!');
            }

            // if (_.has(character, 'character.allArena.allTime.activitiesCleared.basic.value')) {
            //     arenasCleared += character.allArena.allTime.activitiesCleared.basic.value;
            // } else {
            //     // console.log(clanMember.user.user.displayName + ' has probably not done PoE!');
            // }

            if (_.has(character, 'raid.allTime.kills.basic.value')) {
                raidKills += character.raid.allTime.kills.basic.value;
            } else {
                console.log(clanMember.user.user.displayName + ' has probably not done raiding!');
            }

            if (_.has(character, 'allPvP.allTime.killsDeathsRatio.basic.value')) {
                pvpKdR += (character.allPvP.allTime.killsDeathsRatio.basic.value / clanMember.characters.length);
            } else {
                console.log(clanMember.user.user.displayName + ' has probably not done PvP!');
            }

            if (_.has(character, 'allPvP.allTime.activitiesEntered.basic.value')) {
                crucibleGames += (character.allPvP.allTime.activitiesEntered.basic.value);
            }
            if (_.has(character, 'allPvP.allTime.activitiesEntered.basic.value')) {
                var killingSpree = character.allPvP.allTime.longestKillSpree.basic.value;
                if (killingSpree > longestKillingSpree) {
                    longestKillingSpree = killingSpree;
                }
            }
        });

        stats.raidKills.push({
            count: raidKills,
            user: clanMember
        });
        stats.raidCompletions.push({
            count: raidCompletions,
            user: clanMember
        });
        stats.strikesCleared.push({
            count: strikesCleared,
            user: clanMember
        });
        // stats.arenasCleared.push({
        //     count: arenasCleared,
        //     user: clanMember
        // });
        stats.pvpKdR.push({
            count: pvpKdR.toFixed(2),
            user: clanMember
        });
        stats.longestKillingSpree.push({
            count: longestKillingSpree,
            user: clanMember
        });
        stats.crucibleGames.push({
            count: crucibleGames,
            user: clanMember
        });
    });

    return stats;
}

module.exports.getClanStats = function () {
    return clan.getClanInformation().then(function (clanInfo) {

        var sortedStats = {};

        var tables = [];

        try {
            var stats = calculateStats(clanInfo);
            _.each(_.keys(stats), function (stat) {

                sortedStats[stat] = stats[stat].sort(function (a, b) {
                    return b.count - a.count;
                })

            });
        } catch (err) {
            console.error(err);
        }

        // For each sortedStats entry generate a table

        _.each(_.keys(sortedStats), function (stat) {

            var firstThree = _.take(sortedStats[stat], 5);

            var data = [];
            _.each(firstThree, function (member) {
                data.push({
                    count: member.count,
                    name: '<a href="http://destinytracker.com/destiny/overview/xbox/' + member.user.user.user.xboxDisplayName + '">' + member.user.user.user.xboxDisplayName + '</a>'
                });
            });
            var options = {
                data: data,
                header: ['name', 'count']
            };
            var html_data = html_tablify.tablify(options);

            var html = '<div><h3>' + headers[stat] + '</h3>'
                + html_data + '</div>';

            tables.push(html);
        });

        // generate merged table
        var data = [];
        _.each(_.keys(stats), function (stat) {

            if (stat === 'longestKillingSpree' || stat === 'pvpKdR') {
                return;
            }
            var sum = _.sumBy(sortedStats[stat], function (o) {
                return o.count;
            });
            data.push({
                stat: headers[stat],
                'cumulative count': sum
            });
        });

        var rootTable = '<div><h2>Clan-wide Stats</h2>';
        rootTable += html_tablify.tablify({
            data: data,
            header: ['stat', 'cumulative count']
        });
        rootTable += '</div><br><br>';

        var rootHTML = rootTable;
        _.each(tables, function (table) {
            rootHTML += table;
        });

        return rootHTML;
    }).catch(function (err) {
        console.err(err)
    });
};
