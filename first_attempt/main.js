// Variables
var margin = {top: 100, right: 50, bottom: 100, left: 400, grid: 1};
var height = 50000 - (margin.top + margin.bottom);
var width = 1500 - (margin.left + margin.right);
var gridSize = {width: width / (4 + 2 * margin.grid), height: height / (5428 + 2 * margin.grid)};
var roundness = 1;

var mice = d3.dsv(",", "GLDS_4_analysis_simple.csv", function(d) {
    return {
        "name": d.Name,       "desc": d.Description,
        "sample": +d.sample,  "value": +d.value,
        "x": +d.x,            "y": +d.y
    };
});

// Building visualisation
var svg = createCanvas();

mice.then(function(dataset) {

    // Creating rects and adding on-events
    var rects = addRects(svg, dataset);

    // Styling rects
    styleRects(rects, dataset);

    // Adding labels to columns
    addColumnLabels();    

    // Adding labels to rows
    addRowLabels(dataset);

});














