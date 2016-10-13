var _ = require('lodash');


var urlPrefix = 'http://www.bungie.net/';

function weeklyCrucibleDetails(advisorData) {

    var weeklyCrucibleData = _.get(advisorData, 'Response.data.weeklyCrucible')[0];
    var hash = weeklyCrucibleData.activityBundleHash;
    var weeklyCrucibleName = _.get(advisorData, 'Response.definitions.activityBundles.' + hash).activityName;
    var weeklyCrucibleDesc = _.get(advisorData, 'Response.definitions.activityBundles.' + hash).activityDescription;
    var weeklyCrucibleIcon = _.get(advisorData, 'Response.definitions.activityBundles.' + hash).releaseIcon;


    var strikeDetails = {
        name: weeklyCrucibleName,
        desc: weeklyCrucibleDesc,
        icon: urlPrefix + weeklyCrucibleData.image
    };
    return strikeDetails;
}

function getWeeklyCrucibleSection(advisorData) {

    var weeklyCrucible = weeklyCrucibleDetails(advisorData);

    var section = '<div id="weeklycrucible" class="tab-pane fade in">';
    section = section + '<div class="well well-dark-transparent">';
    section = section + '<h3 style="font-size: 24px; text-align: center;' +
        ' border-bottom: 2px solid #8d8c91; margin: 0px 0px 15px; padding: 5px 0px 5px;' +
        '">Weekly Crucible Playlist</h3>';

    /** Image **/
    section = section + '<img src="' + weeklyCrucible.icon +
        '" width="100%" alt="nf Banner" title="nightfall Banner"/><br>';

    /** name **/
    section = section + '<h3 style="font-size: 24px; text-align: center;' +
        ' margin: 0px 0px 5px; padding: 5px 0px 5px;">' + weeklyCrucible.name + '</h3>';

    /** name **/
    section = section + '<p style="font-size: 24px; text-align: center;' +
        ' margin: 0px 0px 5px; padding: 5px 0px 5px;">' + weeklyCrucible.desc + '</p>';


    section = section + '</div></div>';
    return section;
}

module.exports.getWeeklyCrucibleSection = getWeeklyCrucibleSection;

