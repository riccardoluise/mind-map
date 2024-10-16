const width = window.innerWidth;
const height = window.innerHeight;
const maxRadius = 30;
const minRadius = 5;

const svg = d3.select("#mindmap")
    .append("svg")
    .attr("width", width)
    .attr("height", height);

const defs = svg.append("defs");
const filter = defs.append("filter")
    .attr("id", "drop-shadow")
    .attr("height", "130%");

filter.append("feGaussianBlur")
    .attr("in", "SourceAlpha")
    .attr("stdDeviation", 5)
    .attr("result", "blur");

filter.append("feOffset")
    .attr("in", "blur")
    .attr("dx", 3)
    .attr("dy", 3)
    .attr("result", "offsetBlur");

const feMerge = filter.append("feMerge");
feMerge.append("feMergeNode")
    .attr("in", "offsetBlur");
feMerge.append("feMergeNode")
    .attr("in", "SourceGraphic");

const g = svg.append("g")
    .attr("transform", `translate(${width / 2},${height / 2})`);

const zoom = d3.zoom()
    .scaleExtent([0.1, 3])
    .on("zoom", (event) => {
        g.attr("transform", event.transform);
    });

svg.call(zoom);

let root = d3.hierarchy(mindMapData);
let nodes = root.descendants();
let links = root.links();

const colorScale = d3.scaleLinear()
    .domain([0, root.height])
    .range(["#8A2BE2", "#FFFFFF"]);

const radiusScale = d3.scaleLinear()
    .domain([0, root.height])
    .range([maxRadius, minRadius]);

function getBorderColor(d) {
    if (d._children) {
        return d3.color(colorScale(d.depth)).darker(1.5);
    } else {
        return "none";
    }
}

const simulation = d3.forceSimulation(nodes)
    .force("link", d3.forceLink(links).id(d => d.id).distance(100).strength(1))
    .force("charge", d3.forceManyBody().strength(-1000))
    .force("x", d3.forceX())
    .force("y", d3.forceY());

let link = g.append("g")
    .attr("class", "links")
    .selectAll(".link")
    .data(links)
    .enter().append("line")
    .attr("class", "link");

let node = g.append("g")
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
    .style("stroke-width", 3);

node.append("rect")
    .attr("class", "node-label-background")
    .attr("rx", 5)
    .attr("ry", 5);

node.append("text")
    .attr("class", "node-label")
    .attr("dy", ".31em")
    .attr("text-anchor", "middle")
    .text(d => d.data.name)
    .each(function(d) {
        const bbox = this.getBBox();
        d3.select(this.previousSibling)
            .attr("x", bbox.x - 5)
            .attr("y", bbox.y - 2)
            .attr("width", bbox.width + 10)
            .attr("height", bbox.height + 4);
    });

root.children.forEach(collapseNode);
update(root);

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
        .style("stroke-width", 3);

    nodeEnter.append("rect")
        .attr("class", "node-label-background")
        .attr("rx", 5)
        .attr("ry", 5);

    nodeEnter.append("text")
        .attr("class", "node-label")
        .attr("dy", ".31em")
        .attr("text-anchor", "middle")
        .text(d => d.data.name)
        .style("font-size", d => `${Math.max(8, 16 - d.depth * 2)}px`)
        .style("fill-opacity", 0)
        .transition().duration(750)
        .style("fill-opacity", 1)
        .each(function(d) {
            const bbox = this.getBBox();
            d3.select(this.previousSibling)
                .attr("x", bbox.x - 5)
                .attr("y", bbox.y - 2)
                .attr("width", bbox.width + 10)
                .attr("height", bbox.height + 4);
        });

    node = nodeEnter.merge(node);

    node.select("circle")
        .attr("r", d => radiusScale(d.depth))
        .attr("fill", d => colorScale(d.depth))
        .style("filter", d => d.depth === 0 ? "url(#drop-shadow)" : null)
        .style("stroke", getBorderColor)
        .style("stroke-width", 3);

    node.select("text")
        .style("font-size", d => `${Math.max(8, 16 - d.depth * 2)}px`);

    simulation.alpha(1).restart();
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

simulation.on("tick", () => {
    link
        .attr("x1", d => d.source.x)
        .attr("y1", d => d.source.y)
        .attr("x2", d => d.target.x)
        .attr("y2", d => d.target.y);

    node
        .attr("transform", d => `translate(${d.x},${d.y})`);
});

d3.select("#zoom-in").on("click", () => {
    svg.transition().call(zoom.scaleBy, 1.3);
});

d3.select("#zoom-out").on("click", () => {
    svg.transition().call(zoom.scaleBy, 1 / 1.3);
});

d3.select("#expand-all").on("click", () => {
    expandNode(root);
    update(root);
});

d3.select("#collapse-all").on("click", () => {
    root.children.forEach(collapseNode);
    update(root);
});