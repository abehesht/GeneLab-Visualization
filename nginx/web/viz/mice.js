// Set margin convention (link: https://bl.ocks.org/mbostock/3019563)
var margin = {top: 50, right: 50, bottom: 50, left: 50},
    padding = {top: 0, right: 0, bottom: 0, left: 0},
    outerWidth = 1150,
    outerHeight = 800,
    innerWidth = outerWidth - margin.left - margin.right,
    innerHeight = outerHeight - margin.top - margin.bottom,
    width = innerWidth - padding.left - padding.right,
    height = innerHeight - padding.top - padding.bottom;
    var i = -1;

// Create canvas
var canvas = d3.select(".plot")
    .append("svg")
    .attr("width", outerWidth)
    .attr("height", outerHeight);
    
canvas.append("rect")
    .attr("width", "100%")
    .attr("height", "100%")
    .attr("fill", "white");
    
var canvas = canvas.append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

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

function xValue(d) { return d.x; }
function yValue(d) { return d.flt_vs_aem; }

function fillOutOptionList(data) {
    const clusters = [...new Set(data.map(d => d.cluster))].sort();

    var select = document.getElementById("clusterX");
    for(index in clusters) {
        select.options[select.options.length] = new Option(clusters[index], index);
    }
}

function update() {
    var sel = document.getElementById("clusterX");
    var text = sel.options[sel.selectedIndex].text;

    mice.then(data => {
        canvas.selectAll(".dot")
            .attr("fill", function(d) {
                if (d.cluster == text) {
                    return "blue";
                } else {
                    return "black";
                }
            })
            .attr("r", function(d) {
                if (d.cluster == text) {
                    return 4;
                } else {
                    return 3;
                }
            })
            .style("opacity", function(d) {
                if (d.cluster == text) {
                    return 1;
                } else {
                    return 0.05;
                }
            });
    });

    
}

mice.then(data => {

    fillOutOptionList(data);

    var x = d3.scaleLinear()                // interpolator for X axis -- inner plot region
        .domain(d3.extent(data,xValue))
        .range([0,width]);

    var y = d3.scaleLinear()                // interpolator for Y axis -- inner plot region
        .domain(d3.extent(data,yValue))
        .range([height,0]);

    var xAxis = d3.axisBottom(x)
        .ticks(5);                           // request 5 ticks on the x axis

    var yAxis = d3.axisLeft(y)                // y Axis
        .ticks(10);

    canvas.append("g")                            // render the Y axis in the inner plot area
        .attr("class", "y axis")
        .call(yAxis);

    canvas.append("g")                            // render the X axis in the inner plot area
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")  // axis runs along lower part of graph
        .call(xAxis);

    canvas.append("text")                         // inner x-axis label
        .attr("class", "x label")
        .attr("text-anchor", "end")
        .attr("x", width - 6)
        .attr("y", height - 6)
        .text("inner x-axis label");

    canvas.append("text")                         // plot title
        .attr("class", "x label")
        .attr("text-anchor", "middle")
        .attr("x", width/2)
        .attr("y", -margin.top/2)
        .attr("dy", "+.75em")
        .text("Flight mean vs. AEM mean");

    canvas.append("text")                         // inner y-axis label
        .attr("class", "y label")
        .attr("text-anchor", "end")
        .attr("x", -6)
        .attr("y", 6)
        .attr("dy", ".75em")
        .attr("transform", "rotate(-90)")
        .text("inner y-axis label");

    canvas.selectAll(".dot")                      // plot a circle at each data location
        .data(data)
        .enter().append("circle")
        .attr("class", "dot")
        .attr("cx", function(d) { return x(d.x); } )
        .attr("cy", function(d) { return y(d.flt_vs_aem); } )
        .style("opacity", 0.05)
        .attr("r", 2);

});