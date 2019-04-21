// Function: Creating SVG canvas
var createCanvas = function() {
    return d3.select("body")
                .select("#wrapper")
                .append("svg")
                .attr("height", height + (margin.top + margin.bottom))
                .attr("width", width + (margin.left + margin.right))
                .append("g") // appending group
                .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
};

// Function: Creating rects and adding on-events
var addRects = function(svg, dataset) {
    return svg.selectAll("rect")
        .data(dataset)
        .enter()
        .append("rect")
        .on("mouseover", handleMouseOver)
        .on("mouseout", handleMouseOut);
};

// Function: Styling rects
var styleRects = function(rects, dataset) {

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
        .delay(function(d,i) { return 200 + i * 0.2 })
        .attr("fill", function(d) { return color(d.value) });

};

// Function: Adding column labels
var addColumnLabels = function() {
    svg.selectAll("samples")
        .data(["FLIGHT #1", "FLIGHT #2", "FLIGHT #3", "FLIGHT #4"])
        .enter()
        .append("text")
        .text(function (d) { return d; })
        .attr("x", function(d, i) { return (i * gridSize.width + gridSize.width * 1/2 + (i + 1) * margin.grid); })
        .attr("y", -10)
        .style("text-anchor", "middle")
        .classed("labs", true);
};

// Function: Adding row labels
var addRowLabels = function(dataset) {
    svg.selectAll("genes")
        .data(d3.map(dataset, function(d) { return d.name; }).keys())
        .enter()
        .append("text")
        .text(function (d) { return d; })
        .attr("y", function(d, i) { return (i * gridSize.height + 6 + gridSize.height * 1/2 + (i + 1) * margin.grid); })
        .attr("x", -10)
        .style("text-anchor", "end")
        .classed("labs rows", true);
};

// Function: Mouse over event
function handleMouseOver(d) {
    var xPosition = d3.select(this).attr("x");
    var yPosition = d3.select(this).attr("y");
    var col = d3.select(this).attr('fill');
    
    var tool = d3.select("#tooltip")
        .style("left", +xPosition + margin.left + "px")
        .style("top", +yPosition + margin.top + "px")
        .style('background-color', col);

    tool.select("#name").text(d.name);
    tool.select("#desc").text(d.desc);
    tool.select("#value").text(fraction(d.value));
    tool.classed("hidden", false);
};

// Function: Mouse out event
function handleMouseOut() {
    d3.select("#tooltip").classed("hidden", true);
};

var fraction = function(num){
    return Math.round(num * 10000) / 100 + " %";
 };