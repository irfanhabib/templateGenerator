var _ = require('lodash');
var advisor = require('./advisor');
var html_tablify = require('html-tablify');


var SC_HASH = 1738186005;


function getXurSection(advisorJson) {

    var xurHTML = '';
    var xurEvent = _.get(advisorJson, 'Response.data.events.events[0]');
    if (xurEvent && xurEvent.eventHash === 5) {

        var items = [];
        var saleItemsCategories = _.get(xurEvent, 'vendor.saleItemCategories');

        _.each(saleItemsCategories, function (saleItemCategory) {

            var category = saleItemCategory.categoryTitle;

            _.each(saleItemCategory.saleItems, function (item) {
                items.push({
                    item: getItemDetails(item.item.itemHash, advisorJson),
                    cost: _.get(item, 'costs[0].value'),
                    category: category
                });
            });
        });


        xurHTML = "<h2>Xur has arrived</h2>"
        xurHTML += getTable(items);

        console.log(JSON.stringify(items));
        console.log(xurHTML)

    }
    return xurHTML;
}


function getTable(items){

    var data = [];
    _.each(items, function(item){

        data.push({
            icon: item.item.icon,
            name: item.item.name,
            type: item.item.type,
            category: item.category,
            cost: item.cost
        })
    });

    return html_tablify.tablify({
        data: data,
        header: ['icon', 'name', 'type', 'category', 'cost'],
        cellspacing: 5,
        border: 1
    });


}

function getItemDetails(itemHash, advisor) {

    var itemDefinition = _.get(advisor, 'Response.definitions.items.' + itemHash);
    
    return {
        name: itemDefinition.itemName,
        type: itemDefinition.itemTypeName,
        icon: '<img height="50%" src="http://www.bungie.net/' + itemDefinition.icon + '"/>'
    };
}

module.exports.getXurSection = getXurSection;