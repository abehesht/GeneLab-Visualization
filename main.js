// Variables
var margin = {top: 50, right: 50, bottom: 50, left: 200, grid: 1};
var height = 1000 - (margin.top + margin.bottom);
var width = 1500 - (margin.left + margin.right);
var gridSize = {width: width / (4 + 2 * margin.grid), height: height / (30 + 2 * margin.grid)};
var roundness = 3;
var genes = [
    "0610007P14RIK",
    "0610009B14RIK",
    "0610009O20RIK",
    "1110002L01RIK",
    "1110003O08RIK",
    "1110008P14RIK",
    "1110021L09RIK",
    "1110028C15RIK",
    "1300002K09RIK",
    "1600012F09RIK",
    "1700001O22RIK",
    "1700007K13RIK",
    "1700017D01RIK",
    "1700018A04RIK",
    "1700029J07RIK",
    "1700041G16RIK",
    "1700049L16RIK",
    "1700066J24RIK",
    "1700074P13RIK",
    "1700123I01RIK",
    "2010107G12RIK",
    "2010204K13RIK",
    "2200002J24RIK",
    "2200002K05RIK",
    "2210403K04RIK",
    "2310008H04RIK",
    "2310022A10RIK",
    "2410075B13RIK",
    "2410124H12RIK",
    "2410127L17RIK",
]

d3.dsv(",", "test.csv", function(d) {
// d3.dsv(",", "GLDS_4_analysis_simple.csv", function(d) {
    return {
        name: d.Name,       desc: d.Description,
        sample: +d.sample,  value: +d.value,
        x: +d.x,            y: +d.y
    };
}).then(function(dataset) {
    // Defining canvas
    var svg = createCanvas(height, width, margin);

    // Creating rects and adding on-events
    var rects = addRects(svg, dataset, gridSize, margin, roundness);

    // Styling rects
    styleRects(rects, dataset, gridSize, margin, roundness);

    // Creating labels
    svg.selectAll("samples")
        .data(["Flight #1", "Flight #2", "Flight #3", "Flight #4"])
        .enter()
        .append("text")
        .text(function (d) { return d; })
        .attr("x", function(d, i) { return (i * gridSize.width + gridSize.width * 1/2 + (i + 1) * margin.grid); })
        .attr("y", -10)
        .style("text-anchor", "middle")
        .attr("class", "labs")
        .style("font-family", "Arial")
        .style("fill", "#b3b3b3");

    // Creating labels
    svg.selectAll("genes")
        .data(genes)
        .enter()
        .append("text")
        .text(function (d) { return d; })
        .attr("y", function(d, i) { return (i * gridSize.height + 6 + gridSize.height * 1/2 + (i + 1) * margin.grid); })
        .attr("x", -10)
        .style("text-anchor", "end")
        .attr("class", "labs")
        .style("font-family", "Arial")
        .style("fill", "#302e2f");


    // Hover over info

});










// Creating SVG canvas
var createCanvas = function(height, width, margin) {
    return d3.select("body")
                .select("#wrapper")
                .append("svg")
                .attr("height", height + (margin.top + margin.bottom))
                .attr("width", width + (margin.left + margin.right))
                .append("g") // appending group
                .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
};

    // Creating rects and adding on-events
var addRects = function(svg, dataset) {
    return svg.selectAll("rect")
        .data(dataset)
        .enter()
        .append("rect")
        .on("mouseover", handleMouseOver)
        .on("mouseout", handleMouseOut);
};

// Styling rects
var styleRects = function(rects, dataset, gridSize, margin, roundness) {

    var color = d3.scaleLinear()
        .domain([
            d3.min(dataset, function(d) {return d.value}),
            0,
            d3.max(dataset, function(d) {return d.value})
        ])
        .range(["#FC3D21", "#FFFFFF", "#0B3D91"]);

    rects.attr("x", function(d) {
            return ((d.x - 1) * gridSize.width + d.x * margin.grid);
        })
        .attr("y", function(d) {
            return ((d.y - 1) * gridSize.height + d.y * margin.grid);
        })
        .attr("rx", roundness)
        .attr("ry", roundness)
        .attr("height", gridSize.height)
        .attr("width", gridSize.width)
        .attr("fill", "white")
        .transition()
        .duration(1000)
        .delay(function(d,i) { return i * 10 })
        .attr("fill", function(d) { return color(d.value) });

};

function handleMouseOver() {
    var scaleFactor = 1.3;

    d3.select(this).raise()
        .attr("x", function(d) {
            return ((d.x - 1) * gridSize.width + d.x * margin.grid) - gridSize.width * (scaleFactor - 1) * 1/2;
        })
        .attr("y", function(d) {
            return ((d.y - 1) * gridSize.height + d.y * margin.grid) - gridSize.height * (scaleFactor - 1) * 1/2;
        })
        .attr("height", gridSize.height * scaleFactor)
        .attr("width", gridSize.width * scaleFactor)
        .attr("stroke", "#302e2f");    
};

function handleMouseOut(d, i) {

    d3.select(this)
        .attr("x", function(d) {
            return ((d.x - 1) * gridSize.width + d.x * margin.grid);
        })
        .attr("y", function(d) {
            return ((d.y - 1) * gridSize.height + d.y * margin.grid);
        })
        .attr("height", gridSize.height)
        .attr("width", gridSize.width)
        .attr("stroke", null);
}

