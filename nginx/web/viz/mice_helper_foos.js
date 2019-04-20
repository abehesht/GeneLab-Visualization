// Define helper to easily get x and y values later on
function xValue(d, i) { return i; }
function yValue(d) { return d.FvsAEM; }

// Define function to fill out clusterX option dropdown with cluster values
function fillOutOptionList(data) {
    const clusters = [...new Set(data.map(d => d.cluster_name))].sort();

    var select = document.getElementById("clusterX");
    for(index in clusters) {
        select.options[select.options.length] = new Option(clusters[index], index);
    }
}

// Define cluster colors
function defineClusterColors(data) {
    const clusters = [...new Set(data.map(d => d.cluster_name))].sort();
    colorScale = d3.scaleOrdinal(d3.schemePaired).domain(clusters);
}

// Identify selected cluster (clusterX option)
function selectedCluster() {
    var sel = document.getElementById("clusterX");
    return sel.options[sel.selectedIndex].text;
}

// Define fill color for selected cluster
function activeClusterFill(d) {
    if (d.cluster_name == text) {
        d3.select(this).raise(); 
        return colorScale(d.cluster_name);
    } else {
        return "black";
    }
}

// Define stroke color for selected cluster
function activeClusterStroke(d) {
    return (d.cluster_name == text) ? "black" : "transparent";
}

// Define radius for selected cluster
function activeClusterRadius(d) {
    return (d.cluster_name == text) ? 5 : 1;
}

// Define opacity for selected cluster
function activeClusterOpacity(d) {
    return (d.cluster_name == text) ? 1 : 0.5;
}

// Define mouseover action (tooltip appear) for selected cluster
function activeClusterMouseover(d) {
    if (d.cluster_name == text) {
        tooltip.transition()
             .duration(200)
             .style("background-color", colorScale(d.cluster_name))
             .style("opacity", .9);

        tooltip.html(d.Name)
             .style("left", (d3.event.pageX) + "px")
             .style("top", (d3.event.pageY) + "px");
    }
}

// Define mouseout action (tooltip disappear) for selected cluster
function activeClusterMouseout(d) {
    tooltip.transition().duration(500).style("opacity", 0);
}