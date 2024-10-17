# Project Files Summary

This document contains the content of all project files, excluding those specified in .gitignore, node_modules, and .git.

## Directory Structure

```json
{
  "name": "mind-map",
  "type": "directory",
  "children": [
    {
      "name": ".env",
      "type": "file",
      "path": ".env"
    },
    {
      "name": ".gitignore",
      "type": "file",
      "path": ".gitignore"
    },
    {
      "name": "README.md",
      "type": "file",
      "path": "README.md"
    },
    {
      "name": "concatenate.js",
      "type": "file",
      "path": "concatenate.js"
    },
    {
      "name": "index.html",
      "type": "file",
      "path": "index.html"
    },
    {
      "name": "package.json",
      "type": "file",
      "path": "package.json"
    },
    {
      "name": "src",
      "type": "directory",
      "children": [
        {
          "name": "components",
          "type": "directory",
          "children": [
            {
              "name": "MindMap",
              "type": "directory",
              "children": [
                {
                  "name": "MindMap.js",
                  "type": "file",
                  "path": "src/components/MindMap/MindMap.js"
                },
                {
                  "name": "controls.js",
                  "type": "file",
                  "path": "src/components/MindMap/controls.js"
                }
              ]
            }
          ]
        },
        {
          "name": "data",
          "type": "directory",
          "children": [
            {
              "name": "mindMapData.js",
              "type": "file",
              "path": "src/data/mindMapData.js"
            }
          ]
        },
        {
          "name": "services",
          "type": "directory",
          "children": [
            {
              "name": "visualization.js",
              "type": "file",
              "path": "src/services/visualization.js"
            }
          ]
        },
        {
          "name": "styles",
          "type": "directory",
          "children": [
            {
              "name": "global.css",
              "type": "file",
              "path": "src/styles/global.css"
            }
          ]
        },
        {
          "name": "utils",
          "type": "directory",
          "children": [
            {
              "name": "d3Setup.js",
              "type": "file",
              "path": "src/utils/d3Setup.js"
            },
            {
              "name": "nodeFunctions.js",
              "type": "file",
              "path": "src/utils/nodeFunctions.js"
            }
          ]
        }
      ]
    }
  ]
}
```

## File List

1. .env
2. .gitignore
3. README.md
4. concatenate.js
5. index.html
6. package.json
7. src/components/MindMap/MindMap.js
8. src/components/MindMap/controls.js
9. src/data/mindMapData.js
10. src/services/visualization.js
11. src/styles/global.css
12. src/utils/d3Setup.js
13. src/utils/nodeFunctions.js

## File Contents

### 1. .env

```
# Place your StackBlitz environment variables here,
# and they will be securely synced to your account.
```

### 2. .gitignore

```
node_modules
package-lock.json
```

### 3. README.md

```
1) Create .gitignore
    node_modules
    package-lock.json


2) create package.json
    {
        "scripts": {
        "start": "live-server --port=8080"
        },
        "dependencies": {
        "live-server": "^1.2.1"
        }
    }

3)  npm install && npm start
https://stackblitz.com/~/github.com/riccardoluise/mind-map?file=README.md

4) GitHub Pages - Settings - Source -  root - Save
```

### 4. concatenate.js

```
const fs = require('fs');
const path = require('path');

function parseGitignore(rootPath) {
  const gitignorePath = path.join(rootPath, '.gitignore');
  let patterns = [];
  if (fs.existsSync(gitignorePath)) {
    const content = fs.readFileSync(gitignorePath, 'utf8');
    patterns = content.split('\n')
      .map(line => line.trim())
      .filter(line => line && !line.startsWith('#'));
  }
  patterns.push('node_modules', '.git');
  return patterns;
}

function isIgnored(filePath, ignorePatterns, rootPath) {
  const relativePath = path.relative(rootPath, filePath);
  return ignorePatterns.some(pattern => {
    if (pattern.endsWith('/')) {
      return relativePath.startsWith(pattern) || relativePath + '/' === pattern;
    }
    return relativePath === pattern || relativePath.startsWith(pattern + '/');
  });
}

function walkSync(dir, ignorePatterns, rootPath, filelist = []) {
  const files = fs.readdirSync(dir);

  files.forEach(file => {
    const filePath = path.join(dir, file);
    
    if (isIgnored(filePath, ignorePatterns, rootPath)) {
      return;
    }

    if (fs.statSync(filePath).isDirectory()) {
      filelist = walkSync(filePath, ignorePatterns, rootPath, filelist);
    } else {
      filelist.push(filePath);
    }
  });

  return filelist;
}

function generateDirectoryTree(rootPath, ignorePatterns) {
  function buildTree(dir) {
    const baseName = path.basename(dir);
    const tree = { name: baseName, type: 'directory', children: [] };
    const files = fs.readdirSync(dir);

    files.forEach(file => {
      const filePath = path.join(dir, file);
      const relativePath = path.relative(rootPath, filePath);
      
      if (isIgnored(filePath, ignorePatterns, rootPath)) {
        return;
      }

      if (fs.statSync(filePath).isDirectory()) {
        tree.children.push(buildTree(filePath));
      } else {
        tree.children.push({ name: file, type: 'file', path: relativePath });
      }
    });

    return tree;
  }

  return buildTree(rootPath);
}

function concatenateFiles(rootPath) {
  const ignorePatterns = parseGitignore(rootPath);
  const files = walkSync(rootPath, ignorePatterns, rootPath);
  let output = '';

  output += "# Project Files Summary\n\n";
  output += "This document contains the content of all project files, excluding those specified in .gitignore, node_modules, and .git.\n\n";
  
  output += "## Directory Structure\n\n";
  output += "```json\n";
  output += JSON.stringify(generateDirectoryTree(rootPath, ignorePatterns), null, 2);
  output += "\n```\n\n";

  output += "## File List\n\n";
  files.forEach((file, index) => {
    const relativePath = path.relative(rootPath, file);
    output += `${index + 1}. ${relativePath}\n`;
  });

  output += "\n## File Contents\n\n";
  files.forEach((file, index) => {
    const relativePath = path.relative(rootPath, file);
    const content = fs.readFileSync(file, 'utf8');
    output += `### ${index + 1}. ${relativePath}\n\n`;
    output += "```\n";
    output += content.trim();
    output += "\n```\n\n";
  });

  fs.writeFileSync('project_files_summary.md', output);
  console.log('Files concatenated successfully in project_files_summary.md');
}

concatenateFiles(process.cwd());
```

### 5. index.html

```
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Web Development Mind Map</title>
    <script src="https://d3js.org/d3.v7.min.js"></script>
    <link rel="stylesheet" href="styles.css">
</head>
<body>
    <div id="controls">
        <button id="zoom-in">+</button>
        <button id="zoom-out">-</button>
        <button id="expand-all">Espandi tutti</button>
        <button id="collapse-all">Collassa tutti</button>
        <button id="center-view">Centra Mappa</button>
        <button id="fit-view">Adatta alla Finestra</button>
    </div>
    <div id="mindmap"></div>
    <script src="src/data/mindMapData.js"></script>
    <script src="src/utils/d3Setup.js"></script>
    <script src="src/utils/nodeFunctions.js"></script>
    <script src="src/services/visualization.js"></script>
    <script src="src/components/MindMap/controls.js"></script>
    <script src="src/components/MindMap/MindMap.js"></script>
</body>
</html>
```

### 6. package.json

```
{
    "scripts": {
      "start": "live-server --port=8080"
    },
    "dependencies": {
      "live-server": "^1.2.1"
    }
  }
```

### 7. src/components/MindMap/MindMap.js

```
document.addEventListener('DOMContentLoaded', (event) => {
    initializeVisualization();
    setupControls();
});
```

### 8. src/components/MindMap/controls.js

```
function centerView() {
    const rootNode = root;
    
    svg.transition().duration(750).call(
        zoom.transform,
        d3.zoomIdentity
          .translate(width / 2, height / 2)
          .scale(1)
          .translate(-rootNode.x, -rootNode.y)
    );
}

function fitView() {
    const bounds = g.node().getBBox();
    const fullWidth = bounds.width;
    const fullHeight = bounds.height;
    const midX = bounds.x + fullWidth / 2;
    const midY = bounds.y + fullHeight / 2;

    const scale = 0.9 / Math.max(fullWidth / width, fullHeight / height);
    const translate = [width / 2 - scale * midX, height / 2 - scale * midY];

    svg.transition().duration(750).call(
        zoom.transform,
        d3.zoomIdentity.translate(translate[0], translate[1]).scale(scale)
    );
}

function setupControls() {
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

    d3.select("#center-view").on("click", centerView);

    d3.select("#fit-view").on("click", fitView);
}
```

### 9. src/data/mindMapData.js

```
const mindMapData = {
    "name": "Web Development",
    "children": [
        {
            "name": "Frontend Development",
            "children": [
                {"name": "HTML"},
                {"name": "CSS"},
                {"name": "JavaScript"},
                {"name": "TypeScript"},
                {
                    "name": "Frameworks e Librerie",
                    "children": [
                        {"name": "React"},
                        {"name": "Angular"},
                        {"name": "Vue.js"},
                        {"name": "Svelte"},
                        {"name": "jQuery"},
                        {"name": "Bootstrap"},
                        {"name": "Tailwind CSS"}
                    ]
                },
                {
                    "name": "Build Tools",
                    "children": [
                        {"name": "Webpack"},
                        {"name": "Vite"},
                        {"name": "Rollup"},
                        {"name": "Babel"}
                    ]
                },
                {
                    "name": "Testing",
                    "children": [
                        {"name": "Jest"},
                        {"name": "Cypress"},
                        {"name": "Playwright"},
                        {"name": "Selenium"}
                    ]
                }
            ]
        },
        {
            "name": "Backend Development",
            "children": [
                {
                    "name": "Linguaggi",
                    "children": [
                        {"name": "Node.js"},
                        {"name": "Python"},
                        {"name": "Ruby"},
                        {"name": "PHP"},
                        {"name": "Java"},
                        {"name": "Go"},
                        {"name": "Rust"},
                        {"name": "C#"}
                    ]
                },
                {
                    "name": "Frameworks",
                    "children": [
                        {"name": "Express.js"},
                        {"name": "Django"},
                        {"name": "Ruby on Rails"},
                        {"name": "Laravel"},
                        {"name": "Spring Boot"},
                        {"name": "ASP.NET Core"}
                    ]
                },
                {
                    "name": "API",
                    "children": [
                        {"name": "REST"},
                        {"name": "GraphQL"},
                        {"name": "gRPC"},
                        {"name": "WebHooks"}
                    ]
                }
            ]
        },
        {
            "name": "Databases",
            "children": [
                {
                    "name": "Relazionali (SQL)",
                    "children": [
                        {"name": "PostgreSQL"},
                        {"name": "MySQL"},
                        {"name": "SQLite"},
                        {"name": "Oracle"}
                    ]
                },
                {
                    "name": "Non Relazionali (NoSQL)",
                    "children": [
                        {"name": "MongoDB"},
                        {"name": "Redis"},
                        {"name": "Cassandra"},
                        {"name": "Elasticsearch"}
                    ]
                }
            ]
        },
        {
            "name": "DevOps e CI/CD",
            "children": [
                {
                    "name": "Containerizzazione",
                    "children": [
                        {"name": "Docker"},
                        {"name": "Kubernetes"}
                    ]
                },
                {
                    "name": "CI/CD Tools",
                    "children": [
                        {"name": "Jenkins"},
                        {"name": "GitLab CI"},
                        {"name": "GitHub Actions"},
                        {"name": "CircleCI"}
                    ]
                }
            ]
        },
        {
            "name": "Cloud e Hosting",
            "children": [
                {"name": "AWS"},
                {"name": "Google Cloud"},
                {"name": "Azure"},
                {"name": "Heroku"},
                {"name": "Netlify"},
                {"name": "Vercel"},
                {"name": "GitHub Pages"}
            ]
        }
    ]
};
```

### 10. src/services/visualization.js

```
let root, nodes, links, simulation, link, node;

function initializeVisualization() {
    root = d3.hierarchy(mindMapData);
    nodes = root.descendants();
    links = root.links();

    simulation = d3.forceSimulation(nodes)
        .force("link", d3.forceLink(links).id(d => d.id).distance(100).strength(1))
        .force("charge", d3.forceManyBody().strength(-1000))
        .force("x", d3.forceX())
        .force("y", d3.forceY());

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

    node.append("rect")
        .attr("class", "node-label-background")
        .attr("rx", 4)
        .attr("ry", 4);

    node.append("text")
        .attr("class", "node-label")
        .attr("dy", ".31em")
        .attr("text-anchor", "middle")
        .text(d => d.data.name)
        .style("font-size", d => `${Math.max(10, 16 - d.depth * 2)}px`)
        .each(function(d) {
            const bbox = this.getBBox();
            d3.select(this.previousSibling)
                .attr("x", bbox.x - 4)
                .attr("y", bbox.y - 2)
                .attr("width", bbox.width + 8)
                .attr("height", bbox.height + 4);
        });

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
}

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

    nodeEnter.append("rect")
        .attr("class", "node-label-background")
        .attr("rx", 4)
        .attr("ry", 4);

    nodeEnter.append("text")
        .attr("class", "node-label")
        .attr("dy", ".31em")
        .attr("text-anchor", "middle")
        .text(d => d.data.name)
        .style("font-size", d => `${Math.max(10, 16 - d.depth * 2)}px`)
        .style("fill-opacity", 0)
        .transition().duration(750)
        .style("fill-opacity", 1)
        .each(function(d) {
            const bbox = this.getBBox();
            d3.select(this.previousSibling)
                .attr("x", bbox.x - 4)
                .attr("y", bbox.y - 2)
                .attr("width", bbox.width + 8)
                .attr("height", bbox.height + 4);
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
```

### 11. src/styles/global.css

```
body, html {
    margin: 0;
    padding: 0;
    width: 100%;
    height: 100%;
    overflow: hidden;
    background-color: #f0f0f0;
}

#controls {
    position: absolute;
    top: 10px;
    left: 10px;
    z-index: 1000;
    background-color: rgba(255, 255, 255, 0.8);
    padding: 10px;
    border-radius: 5px;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.3);
}

#controls button {
    margin-right: 5px;
    padding: 5px 10px;
    background-color: #ffffff;
    border: 1px solid #ccc;
    border-radius: 3px;
    cursor: pointer;
    font-size: 14px;
    transition: background-color 0.3s, border-color 0.3s;
}

#controls button:hover {
    background-color: #e6e6e6;
    border-color: #999;
}

#mindmap {
    width: 100%;
    height: 100%;
}

.node circle {
    cursor: pointer;
    stroke: #666;
    stroke-width: 1.5px;
}

.node text {
    font-family: 'Helvetica Neue', Arial, sans-serif;
    font-weight: 500;
    pointer-events: none;
    fill: #333;
}

.link {
    fill: none;
    stroke: #999;
    stroke-opacity: 0.6;
    stroke-width: 1.5px;
}

.node-label-background {
    fill: rgba(255, 255, 255, 0.9);
    stroke: #ccc;
    stroke-width: 1px;
}

.node:hover circle {
    stroke: #000;
    stroke-width: 2.5px;
}

.link:hover {
    stroke-opacity: 1;
    stroke-width: 2.5px;
}
```

### 12. src/utils/d3Setup.js

```
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
    .attr("stdDeviation", 3)
    .attr("result", "blur");

filter.append("feOffset")
    .attr("in", "blur")
    .attr("dx", 2)
    .attr("dy", 2)
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

const colorScale = d3.scaleSequential(d3.interpolateYlGnBu)
    .domain([5, 0]);

const radiusScale = d3.scaleLinear()
    .domain([0, 5])
    .range([maxRadius, minRadius]);
```

### 13. src/utils/nodeFunctions.js

```
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
```

