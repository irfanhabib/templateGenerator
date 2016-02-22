var _ = require('lodash');


var urlPrefix = 'http://www.bungie.net/';

function nightfallDetails(advisorData) {

    var nightfallData = _.get(advisorData, 'Response.data.nightfall');


    var nightfallActivityHash = _.get(advisorData, 'Response.data.nightfallActivityHash');
    var specificActivityHash = nightfallData.specificActivityHash;
    var strikeDetails = {
        name: advisorData.Response.definitions.activities[specificActivityHash].activityName,
        icon: urlPrefix + advisorData.Response.definitions.activities[specificActivityHash].pgcrImage,
        skulls: getSkulls(advisorData, nightfallActivityHash)
    };


    return strikeDetails;


}


function getSkulls(advisorData, nightfallActivityHash) {

    var nightfallDefinitions = _.get(advisorData, 'Response.definitions.activities.' + nightfallActivityHash);
    var skullsList = _.get(advisorData, 'Response.data.nightfall.tiers[0].skullIndexes');
    var skulls = [];
    _.each(skullsList, function(skullIndex) {
        skulls.push({
            name: nightfallDefinitions.skulls[skullIndex].displayName,
            desc: nightfallDefinitions.skulls[skullIndex].description,
            url: urlPrefix + nightfallDefinitions.skulls[skullIndex].icon
        });
    });
    return skulls;
}


function getNightfallSection(advisorData) {

    var nightfallData = nightfallDetails(advisorData);

    var section = '<div id="NF" class="tab-pane active">';
    section = section + '<div class="well well-dark-transparent">';
    section = section + '<h3 style="font-size: 24px; text-align: center;' +
        ' border-bottom: 2px solid #8d8c91; margin: 0px 0px 15px; padding: 5px 0px 5px;' +
        '">Vanguard Nightfall Strike</h3>';

    /** Strike name **/
    section = section + '<h3 style="font-size: 24px; text-align: center;' +
        ' margin: 0px 0px 5px; padding: 5px 0px 5px;">' + nightfallData.name + '</h3>';
    /** Strike Image **/
    section = section + '<img src="' + nightfallData.icon +
        '" width="100%" alt="nf Banner" title="nightfall Banner"/><br>';

    /** table start **/
    section = section + '<table align="center" style="border: 1px solid white; font-size: 16px;"><tbody>';

    /** Skulls data **/
    _.each(nightfallData.skulls, function(skull) {

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

module.exports.getNightfallSection = getNightfallSection;

