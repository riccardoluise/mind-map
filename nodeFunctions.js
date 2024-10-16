function getBorderColor(d) {
    if (d._children) {
        return d3.color(colorScale(d.depth)).darker(1.5);
    } else {
        return "none";
    }
}

function toggleNode(event, d) {
    if (d.children) {
        d._children = d.children;
        d.children = null;
    } else {
        d.children = d._children;
        d._children = null;
    }
    update(d);
}

function collapseNode(node) {
    if (node.children) {
        node._children = node.children;
        node._children.forEach(collapseNode);
        node.children = null;
    }
}

function expandNode(node) {
    if (node._children) {
        node.children = node._children;
        node._children = null;
    }
    if (node.children) {
        node.children.forEach(expandNode);
    }
}

function dragstarted(event, d) {
    if (!event.active) simulation.alphaTarget(0.3).restart();
    d.fx = d.x;
    d.fy = d.y;
}

function dragged(event, d) {
    d.fx = event.x;
    d.fy = event.y;
}

function dragended(event, d) {
    if (!event.active) simulation.alphaTarget(0);
    d.fx = null;
    d.fy = null;
}