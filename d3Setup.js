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

const colorScale = d3.scaleLinear()
    .domain([0, 5])
    .range(["#8A2BE2", "#FFFFFF"]);

const radiusScale = d3.scaleLinear()
    .domain([0, 5])
    .range([maxRadius, minRadius]);