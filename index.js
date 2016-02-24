var needle = require('needle');
var advisor = require('./advisor');
var nightfall = require('./nightfalls');
var express = require('express');
var app = express();

var fs = require('fs');
var template = fs.readFileSync('views/template.html', 'utf8');


app.set('port', (process.env.PORT || 5000));
app.get('/', function(request, response) {

    advisor.getAdvisor().then(function(advisorResponse) {
        var nfSection = nightfall.getNightfallSection(advisorResponse);

        /** replace sections **/
        template = template.replace('$TMPL_NF_SECTION$', nfSection);
        response.send(template);


    }).catch(function() {
        response.send("Exception occurred fetching template");
        console.log(arguments);
    });


});
app.listen(app.get('port'), function() {
    console.log('Template Generator app is running on port', app.get('port'));
});






