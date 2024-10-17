// src/services/simulation.js
function setupSimulation(nodes, links) {
    return d3.forceSimulation(nodes)
        .force("link", d3.forceLink(links).id(d => d.id).distance(100).strength(1))
        .force("charge", d3.forceManyBody().strength(-1000))
        .force("x", d3.forceX())
        .force("y", d3.forceY());
}
