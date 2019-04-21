// Define helper to easily get x and y values later on
function xValue(d, i) { return i; }
function yValue(d) { return d.FvsAEM; }

// Define function to fill out clusterX option dropdown with cluster values
function fillOutOptionList(data) {
    const clusters = [...new Set(data.map(d => d.cluster_name))].sort();

    var select = document.getElementById("clusterX");
    for (index in clusters) {
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
    var level = document.getElementById("significance").value;
    if (d.FvsAEM < level && d.FvsAEM > -level) {
        return 0.1
    } else {
        return (d.cluster_name == text) ? 1 : 0.5;
    }
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

function writeGeneTable(data, cluster_name) {
    var geneTable = document.getElementById("geneTable");
    function insertGeneCell(geneTable, geneName, geneDescription) {
        var row = geneTable.insertRow(-1);
        var cell1 = row.insertCell(0);
        var cell2 = row.insertCell(1);
        cell1.innerHTML = geneName;
        cell2.innerHTML = geneDescription;
    }
    var tableHeaderRowCount = 1;

    var rowCount = geneTable.rows.length;
    for (var i = tableHeaderRowCount; i < rowCount; i++) {
        geneTable.deleteRow(tableHeaderRowCount);
    }

    if (data != undefined) {
        data.forEach(gene => {
            if (gene.cluster_name == cluster_name) {
                insertGeneCell(geneTable, gene.Name, gene.Description)
            }
        });
    }
}

function writeStatsTable(data, cluster_name) {
    if (data != undefined) {
        // Calculate for cluster
        var clusterMinCell = document.getElementById("clusterMinCell");
        var clusterMin = 99;
        var clusterMaxCell = document.getElementById("clusterMaxCell");
        var clusterMax = -99;
        var clusterSummed = 0;
        var clusterCount = 0;
        var clusterMeanCell = document.getElementById("clusterMeanCell");
        var clusterAllDiffs = [];

        var popMinCell = document.getElementById("popMinCell");
        var popMin = 99;
        var popMaxCell = document.getElementById("popMaxCell");
        var popMax = -99;
        var popSummed = 0;
        var popCount = 0;
        var popMeanCell = document.getElementById("popMeanCell");
        var popAllDiffs = [];
        data.forEach(gene => {
            if (gene.cluster_name == cluster_name) {
                // Min
                if (gene.FvsAEM < clusterMin) {
                    clusterMin = gene.FvsAEM;
                }
                // Max
                if (gene.FvsAEM > clusterMax) {
                    clusterMax = gene.FvsAEM;
                }
                // Mean and count
                clusterSummed += gene.FvsAEM;
                clusterCount += 1;
                clusterAllDiffs.push(gene.FvsAEM);
            }
            // Min
            if (gene.FvsAEM < popMin) {
                popMin = gene.FvsAEM;
            }
            // Max
            if (gene.FvsAEM > popMax) {
                popMax = gene.FvsAEM;
            }
            // Mean and count
            popSummed += gene.FvsAEM;
            popCount += 1;
            popAllDiffs.push(gene.FvsAEM);
        });
        clusterCountCell.innerText = clusterCount;
        clusterMinCell.innerText = math.round(clusterMin, 5);
        clusterMaxCell.innerText = math.round(clusterMax, 5);
        clusterMeanCell.innerText = math.round((clusterSummed / clusterCount), 5);
        clusterMedianCell.innerText = math.round(math.median(clusterAllDiffs), 5); // TODO: Round this
        clusterStdCell.innerText = math.round(math.std(clusterAllDiffs), 5); // TODO: Round this

        popCountCell.innerText = popCount;
        popMinCell.innerText = math.round(popMin, 5);
        popMaxCell.innerText = math.round(popMax, 5);
        popMeanCell.innerText = math.round((popSummed / popCount), 5);
        popMedianCell.innerText = math.round(math.median(popAllDiffs), 5); // TODO: Round this
        popStdCell.innerText = math.round(math.std(popAllDiffs), 5); // TODO: Round this


    }
}
