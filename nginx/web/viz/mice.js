// Set margin convention (link: https://bl.ocks.org/mbostock/3019563)
var margin = {top: 50, right: 50, bottom: 50, left: 50},
    padding = {top: 0, right: 0, bottom: 0, left: 0},
    outerWidth = 800,
    outerHeight = 800,
    innerWidth = outerWidth - margin.left - margin.right,
    innerHeight = outerHeight - margin.top - margin.bottom,
    width = innerWidth - padding.left - padding.right,
    height = innerHeight - padding.top - padding.bottom;

// Create canvas
var canvas = d3.select("body")
    .append("svg")
    .attr("width", outerWidth)
    .attr("height", outerHeight)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

var confusion = d3.csv("../data/mice.csv", function (d) {
    return {
        "group": d.group,
        "variable": d.variable,
        "value": +d.value
    };
});

confusion.then(data => {

    

});