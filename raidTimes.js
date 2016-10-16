var clan = require('./clan');


return clan.getClanInformation().then(function (clanInfo) {

    console.log(clanInfo)
});
