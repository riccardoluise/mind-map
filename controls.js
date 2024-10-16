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