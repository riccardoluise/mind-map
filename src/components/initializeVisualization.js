// src/components/initializeVisualization.js
function initializeVisualization() {
    loadData(data => {
        root = d3.hierarchy(data);
        nodes = root.descendants();
        links = root.links();

        simulation = setupSimulation(nodes, links);

        renderNodesAndLinks(nodes, links);

        root.children.forEach(collapseNode);
        update(root);

        simulation.on("tick", () => {
            link
                .attr("x1", d => d.source.x)
                .attr("y1", d => d.source.y)
                .attr("x2", d => d.target.x)
                .attr("y2", d => d.target.y);

            node
                .attr("transform", d => `translate(${d.x},${d.y})`);
        });
    });
}
