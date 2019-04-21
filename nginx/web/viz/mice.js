// Set margin convention (link: https://bl.ocks.org/mbostock/3019563)
var i = -1;
var chartDiv = document.getElementById("plot");
var margin = {top: 50, right: 50, bottom: 50, left: 50},
    padding = {top: 0, right: 0, bottom: 0, left: 0},
    outerWidth = chartDiv.clientWidth;
    outerHeight = chartDiv.clientHeight;
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
var mice = d3.json("../data/glds4.json", d => d);

// Define update function which will be called everytime the user selects
// a cluster from the clusterX option
function update() {
    // Not declaring the variable means it's global
    // and can be used in the activeClusterXXX functions
    text = selectedCluster();
    console.log(text);

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
    document.getElementById('significanceLevel').innerHTML = "(" + level + ")";
    d3.select(".significanceZone")
        .attr("y", yScale(level))
        .attr("height", (yScale(0) - yScale(level)) * 2);

    d3.selectAll(".dot")
        .style("opacity", function(d) {
            if (d.FvsAEM < level && d.FvsAEM > -level) {
                return 0.1
            }
        })

    mice.then(data => {significantGenes(data)});
}

function significantGenes(data) {
    var level = document.getElementById("significance").value;
    var count = 0;

    for(var i = 0; i < data.length; ++i){
        if(data[i].FvsAEM >= level | data[i].FvsAEM <= -level)
            count++;
    }
    document.getElementById('vbtwo').innerHTML = count;

    var count = 0;
    for(var i = 0; i < data.length; ++i){
        if(data[i].FvsAEM >= level)
            count++;
    }
    document.getElementById('vbthree').innerHTML = count;

    var count = 0;
    for(var i = 0; i < data.length; ++i){
        if(data[i].FvsAEM <= -level)
            count++;
    }
    document.getElementById('vbfour').innerHTML = count;

}

// Define initial function which will define axis, labels and draw circles
function initial() {
    mice.then(data => {

        var data = data.sort((a, b) => (a.FvsAEM > b.FvsAEM) ? 1 : -1)

        console.log(data);

        fillOutOptionList(data);
        defineClusterColors(data);
    
        // Define scales
        xScale = d3.scaleLinear().domain(d3.extent(data, xValue)).range([0,width]);
        yScale = d3.scaleLinear().domain(d3.extent(data, yValue)).range([height,0]);
    
        // Define axis
        var xAxis = d3.axisBottom(xScale).ticks(0);
        var yAxis = d3.axisLeft(yScale).ticks(10);
    
        // Render y-axis
        canvas.append("g")
            .attr("class", "y axis")
            .call(yAxis);
    
        // Render x-axis
        canvas.append("g")
            .attr("class", "x axis")
            .attr("transform", "translate(0," + yScale(0) + ")")
            .call(xAxis);
    
        // Define plot title
        canvas.append("text")
            .attr("class", "x label")
            .attr("text-anchor", "middle")
            .attr("x", width/2)
            .attr("y", -margin.top/2)
            .attr("dy", "+.75em")
            .text("Flight mean vs. AEM mean");
        
        var level = document.getElementById("significance").value;
        // Draw circles
        canvas.selectAll("dot")
            .data(data)
            .enter().append("circle")
            .attr("class", "dot")
            .attr("cx", (d,i) => xScale(i))
            .attr("cy", d => yScale(d.FvsAEM))
            .style("opacity", function(d) {
                if (d.FvsAEM < level && d.FvsAEM > -level) {
                    return 0.1
                }
            })
            .attr("r", 1);

        // Append rectangle for significance zone
        canvas.append("rect")
            .attr("class", "significanceZone")
            .attr("x", 0)
            .attr("y", yScale(level))
            .attr("height", (yScale(0) - yScale(level)) * 2)
            .attr("width", d3.max(data, (d,i) => xScale(i)))
            .attr("fill", "#000000")
            .attr("opacity", 0.1);

        // Define x-axis label
        canvas.append("text")
            .attr("class", "x label")
            .attr("text-anchor", "end")
            .attr("x", width - 6)
            .attr("y", height - 6)
            .text("Alfredsen og Steenssøn, 2019");

        significantGenes(data);
        document.getElementById('vbone').innerHTML = data.length;
    });
}

// Run initial function
initial()
document.getElementById("clusterY").disabled = true;