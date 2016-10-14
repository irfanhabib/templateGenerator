var needle = require('needle');
var advisor = require('./advisor');
var nightfall = require('./nightfalls');
var weeklyHeroics = require('./weeklyHeroic');
var weeklyCrucible = require('./weeklyCrucible');
var clanStats = require('./calculateClanStats');
var Xur = require('./xur');
var express = require('express');
var app = express();

var fs = require('fs');
var template = fs.readFileSync('views/template.html', 'utf8');

app.set('port', (process.env.PORT || 5555));
app.get('/', function (request, response) {

    clanStats.getClanStats().then(function(clanStatsHTML){
        advisor.getAdvisor().then(function (advisorResponse) {
            var nfSection = nightfall.getNightfallSection(advisorResponse);
            var weeklyheroicSection = weeklyHeroics.getWeeklyHeroicSection(advisorResponse);
            var weeklyCrucibleSection = weeklyCrucible.getWeeklyCrucibleSection(advisorResponse);
            var xurSection = Xur.getXurSection(advisorResponse);

            /** replace sections **/
            template = template.replace('$TMPL_NF_SECTION$', nfSection);
            template = template.replace('$TMPL_WH_SECTION$', weeklyheroicSection);
            template = template.replace('$TMPL_WC_SECTION$', weeklyCrucibleSection);
            template = template.replace('$TMPL_STATS_SECTION$', clanStatsHTML);
            template = template.replace('$TMPL_XUR_SECTION$', xurSection);
            response.send(template);

        }).catch(function () {
            response.send("Exception occurred fetching template");
            console.log(arguments);
        });
    })


});
app.listen(app.get('port'), function () {
    console.log('Template Generator app is running on port', app.get('port'));
});






