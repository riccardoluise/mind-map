// src/services/update.js
function update(source) {
    nodes = root.descendants();
    links = root.links();

    simulation.nodes(nodes);
    simulation.force("link").links(links);

    link = link.data(links, d => d.target.id);
    link.exit().remove();
    link = link.enter().append("line").attr("class", "link").merge(link);

    node = node.data(nodes, d => d.id);
    node.exit().remove();

    let nodeEnter = node.enter().append("g")
        .attr("class", "node")
        .on("click", toggleNode)
        .call(d3.drag()
            .on("start", dragstarted)
            .on("drag", dragged)
            .on("end", dragended));

    nodeEnter.append("circle")
        .attr("r", 0)
        .transition().duration(750)
        .attr("r", d => radiusScale(d.depth))
        .attr("fill", d => colorScale(d.depth))
        .style("filter", d => d.depth === 0 ? "url(#drop-shadow)" : null)
        .style("stroke", getBorderColor)
        .style("stroke-width", 2);

    // Append text first
    nodeEnter.append("text")
        .attr("class", "node-label")
        .attr("dy", ".31em")
        .attr("text-anchor", "middle")
        .text(d => d.data.name)
        .style("font-size", d => `${Math.max(10, 16 - d.depth * 2)}px`)
        .style("fill-opacity", 0)
        .transition().duration(750)
        .style("fill-opacity", 1);

    // Insert rect before text
    nodeEnter.insert("rect", "text")
        .attr("class", "node-label-background")
        .attr("rx", 4)
        .attr("ry", 4);

    // Set rect dimensions based on text
    nodeEnter.each(function (d) {
        const nodeGroup = d3.select(this);
        const text = nodeGroup.select('text');
        const rect = nodeGroup.select('rect');

        const bbox = text.node().getBBox();
        rect.attr('x', bbox.x - 4)
            .attr('y', bbox.y - 2)
            .attr('width', bbox.width + 8)
            .attr('height', bbox.height + 4);
    });

    node = nodeEnter.merge(node);

    node.select("circle")
        .attr("r", d => radiusScale(d.depth))
        .attr("fill", d => colorScale(d.depth))
        .style("filter", d => d.depth === 0 ? "url(#drop-shadow)" : null)
        .style("stroke", getBorderColor)
        .style("stroke-width", 2);

    node.select("text")
        .style("font-size", d => `${Math.max(10, 16 - d.depth * 2)}px`);

    simulation.alpha(1).restart();
}
