// src/components/nodeRenderer.js
function renderNodesAndLinks(nodes, links) {
    link = g.append("g")
        .attr("class", "links")
        .selectAll(".link")
        .data(links)
        .enter().append("line")
        .attr("class", "link");

    node = g.append("g")
        .attr("class", "nodes")
        .selectAll(".node")
        .data(nodes)
        .enter().append("g")
        .attr("class", "node")
        .on("click", toggleNode)
        .call(d3.drag()
            .on("start", dragstarted)
            .on("drag", dragged)
            .on("end", dragended));

    node.append("circle")
        .attr("r", d => radiusScale(d.depth))
        .attr("fill", d => colorScale(d.depth))
        .style("filter", d => d.depth === 0 ? "url(#drop-shadow)" : null)
        .style("stroke", getBorderColor)
        .style("stroke-width", 2);

    // Append text first
    node.append("text")
        .attr("class", "node-label")
        .attr("dy", ".31em")
        .attr("text-anchor", "middle")
        .text(d => d.data.name)
        .style("font-size", d => `${Math.max(10, 16 - d.depth * 2)}px`);

    // Append rect after text
    node.insert("rect", "text")
        .attr("class", "node-label-background")
        .attr("rx", 4)
        .attr("ry", 4);

    // Set rect dimensions based on text
    node.each(function (d) {
        const nodeGroup = d3.select(this);
        const text = nodeGroup.select('text');
        const rect = nodeGroup.select('rect');

        const bbox = text.node().getBBox();
        rect.attr('x', bbox.x - 4)
            .attr('y', bbox.y - 2)
            .attr('width', bbox.width + 8)
            .attr('height', bbox.height + 4);
    });
}
