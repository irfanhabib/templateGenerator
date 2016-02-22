var needle = require('needle');
var advisor = require('./advisor');
var nightfall = require('./nightfalls');
var express = require('express');
var app = express();

var fs = require('fs');
var template = fs.readFileSync('views/template.html.tmpl', 'utf8');

advisor.getAdvisor().then(function(response) {
    var nfSection = nightfall.getNightfallSection(response);

    /** replace sections **/
    template = template.replace('$TMPL_NF_SECTION$', nfSection);


    app.set('port', (process.env.PORT || 5000));
    app.get('/', function(request, response) {
        response.send(template);
    });
    app.listen(app.get('port'), function() {
        console.log('Template Generator app is running on port', app.get('port'));
    });

}).catch(function(){
    console.log(arguments);
});



