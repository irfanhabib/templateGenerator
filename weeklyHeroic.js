var _ = require('lodash');


var urlPrefix = 'http://www.bungie.net/';

function heroicDetails(advisorData) {

    var heroicStrike = _.get(advisorData, 'Response.data.heroicStrike');
    var heroicStrikesHash = _.get(advisorData, 'Response.data.heroicStrikeHashes[0]');


    var strikeDetails = {
        name: "SIVA Crisis Heroic",
        icon: urlPrefix + heroicStrike.image,
        skulls: getSkulls(advisorData, heroicStrikesHash)
    };
    return strikeDetails;
}


function getSkulls(advisorData, heroicStrikesHash) {

    var heroicDefinitions = _.get(advisorData, 'Response.definitions.activities[' + heroicStrikesHash + ']');

    var skullsList =_.get(advisorData, 'Response.data.heroicStrike.tiers[0].skullIndexes');
    var skulls = [];
    _.each(skullsList, function (skullIndex) {
        skulls.push({
            name: heroicDefinitions.skulls[skullIndex].displayName,
            desc: heroicDefinitions.skulls[skullIndex].description,
            url: urlPrefix + heroicDefinitions.skulls[skullIndex].icon
        });
    });
    return skulls;
}


function getWeeklyHeroicSection(advisorData) {

    var weeklyHeroicDetails = heroicDetails(advisorData);

    var section = '<div id="weeklyheroic" class="tab-pane fade in">';
    section = section + '<div class="well well-dark-transparent">';
    section = section + '<h3 style="font-size: 24px; text-align: center;' +
        ' border-bottom: 2px solid #8d8c91; margin: 0px 0px 15px; padding: 5px 0px 5px;' +
        '">Weekly Heroics</h3>';

    /** Strike name **/
    section = section + '<h3 style="font-size: 24px; text-align: center;' +
        ' margin: 0px 0px 5px; padding: 5px 0px 5px;">' + weeklyHeroicDetails.name + '</h3>';
    /** Strike Image **/
    section = section + '<img src="' + weeklyHeroicDetails.icon +
        '" width="100%" alt="nf Banner" title="nightfall Banner"/><br>';

    /** table start **/
    section = section + '<table align="center" style="border: 1px solid white; font-size: 16px;"><tbody>';

    /** Skulls data **/
    _.each(weeklyHeroicDetails.skulls, function (skull) {

        section = section + '<tr><td style="padding: 5px; border-bottom: 1px solid white;' +
            ' border-collapse: collapse;">';
        /** modifier detail **/
        section = section + '<a href=' + skull.url + 'class="image image-thumbnail">' +
            '<img src=' + skull.url + ' title=' + skull.name + ' width="30" height="30"/></a>';
        section = section + '</td><td style="padding: 5px;' +
            ' border-bottom: 1px solid white; border-collapse: collapse;">';
        /** skull name **/
        section = section + '<b>' + skull.name + '</b>';
        section = section + '</td><td style="padding: 5px;' +
            ' border-bottom: 1px solid white;' +
            ' border-collapse: collapse;">' + skull.desc + '</td></tr>';

    });

    section = section + '</tbody><tfoot></tfoot></table></div></div>';

    return section;
}

module.exports.getWeeklyHeroicSection = getWeeklyHeroicSection;

