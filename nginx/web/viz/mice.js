// Set margin convention (link: https://bl.ocks.org/mbostock/3019563)
var i = -1;
var margin = {top: 50, right: 50, bottom: 50, left: 50},
    padding = {top: 0, right: 0, bottom: 0, left: 0},
    outerWidth = 1150,
    outerHeight = 800,
    innerWidth = outerWidth - margin.left - margin.right,
    innerHeight = outerHeight - margin.top - margin.bottom,
    width = innerWidth - padding.left - padding.right,
    height = innerHeight - padding.top - padding.bottom;

// Add tooltip
var tooltip = d3.select("body").append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);

// Create canvas
var canvas = d3.select(".plot")
    .append("svg")
    .attr("width", outerWidth)
    .attr("height", outerHeight);

// Add white background to canvas
canvas.append("rect")
    .attr("width", "100%")
    .attr("height", "100%")
    .attr("fill", "white");
    
// Transform group to plotting area
var canvas = canvas.append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

// Add NASA logo
canvas.append('svg:image')
    .attr('xlink:href', '/graphics/nasa-logo.svg')
    .attr('x', 75)
    .attr('y', 50)
    .attr('width', width - 100)
    .attr('height', height - 100)
    .attr("opacity", 0.1);

// Load data
var mice = d3.dsv(",", "../data/mice.csv", function (d) {
    i += 1;
    return {
        "x": i,
        "name": d.Name,
        "desc": d.Description,
        "flt1": +d.FLT1,
        "flt2": +d.FLT2,
        "flt3": +d.FLT3,
        "flt4": +d.FLT4,
        "flt_avg": +d["Flight Mean"],
        "aem1": +d.AEM1,
        "aem2": +d.AEM2,
        "aem3": +d.AEM3,
        "aem4": +d.AEM4,
        "aem_avg": +d["AEM Mean"],
        "flt_vs_aem": +d["F vs AEM"],
        "cluster": d.cluster
    };
});

// Define update function which will be called everytime the user selects
// a cluster from the clusterX option
function update() {
    // Not declaring the variable means it's global
    // and can be used in the activeClusterXXX functions
    text = selectedCluster();

    mice.then(data => {
        canvas.selectAll(".dot")
            .attr("fill", activeClusterFill)
            .style("stroke", activeClusterStroke)
            .attr("r", activeClusterRadius)
            .style("opacity", activeClusterOpacity)
            .on("mouseover", activeClusterMouseover)
            .on("mouseout", activeClusterMouseout);
    });
    
}

function updateSignificanceLevel() {
    var level = document.getElementById("significance").value;
    d3.select(".significanceZone")
        .attr("y", yScale(level))
        .attr("height", (yScale(0) - yScale(level)) * 2);
}

// Define initial function which will define axis, labels and draw circles
function initial() {
    mice.then(data => {

        fillOutOptionList(data);
        defineClusterColors(data);
    
        // Define scales
        xScale = d3.scaleLinear().domain(d3.extent(data,xValue)).range([0,width]);
        yScale = d3.scaleLinear().domain(d3.extent(data,yValue)).range([height,0]);
    
        // Define axis
        var xAxis = d3.axisBottom(xScale).ticks(5);
        var yAxis = d3.axisLeft(yScale).ticks(10);
    
        // Render y-axis
        canvas.append("g")
            .attr("class", "y axis")
            .call(yAxis);
    
        // Render x-axis
        canvas.append("g")
            .attr("class", "x axis")
            .attr("transform", "translate(0," + height + ")")  // axis runs along lower part of plot
            .call(xAxis);
    
        // Define x-axis label
        canvas.append("text")
            .attr("class", "x label")
            .attr("text-anchor", "end")
            .attr("x", width - 6)
            .attr("y", height - 6)
            .text("inner x-axis label");
    
        // Define y-axis label
        canvas.append("text")
            .attr("class", "y label")
            .attr("text-anchor", "end")
            .attr("x", -6)
            .attr("y", 6)
            .attr("dy", ".75em")
            .attr("transform", "rotate(-90)")
            .text("inner y-axis label");
    
        // Define plot title
        canvas.append("text")
            .attr("class", "x label")
            .attr("text-anchor", "middle")
            .attr("x", width/2)
            .attr("y", -margin.top/2)
            .attr("dy", "+.75em")
            .text("Flight mean vs. AEM mean");
    
        // Draw circles
        canvas.selectAll("dot")
            .data(data)
            .enter().append("circle")
            .attr("class", "dot")
            .attr("cx", d => xScale(d.x))
            .attr("cy", d => yScale(d.flt_vs_aem))
            .style("opacity", 0.5)
            .attr("r", 1);

            // Append rectangle for significance zone
            var level = document.getElementById("significance").value;
            canvas.append("rect")
                .attr("class", "significanceZone")
                .attr("x", 0)
                .attr("y", yScale(level))
                .attr("height", (yScale(0) - yScale(level)) * 2)
                .attr("width", d3.max(data, d => d.x))
                .attr("fill", "red")
                .attr("opacity", 0.25);
    });
}

// Run initial function
initial()