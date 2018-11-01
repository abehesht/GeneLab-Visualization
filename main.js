// Variables
var margin = {top: 0, right: 0, bottom: 0, left: 0, grid: 0}
var h = 750 - (margin.top + margin.bottom)
var w = 750 - (margin.left + margin.right)

d3.dsv(",", "GLDS_4_analysis.csv", function(d) {
    return {
        name: d.Name,
        desc: d.Description,
        flt1: d.flight1,
        flt2: d.flight2,
        flt3: d.flight3,
        flt4: d.flight4,
        ctl1: d.ctl1,
        ctl2: d.ctl2,
        ctl3: d.ctl3,
        ctl4: d.ctl4
    }
}).then(function(data) {
    // Defining canvas
    var svg = createCanvas(h, w, margin);
})

var createCanvas = function(height, width, margin) {
    d3.select("body")
        .select("#wrapper")
        .append("svg")
        .attr("height", height + (margin.top + margin.bottom))
        .attr("width", width + (margin.left + margin.right))
        .append("g") // appending group
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
};