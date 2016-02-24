var _ = require('lodash');
var needle = require('needle');

var trialsReport = 'https://destinytrialsreport.com/';


function test() {
    needle.get(trialsReport, function(err, response) {
        console.log(response.body);
    })
}

test();


