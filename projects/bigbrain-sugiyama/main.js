// Dagre cheat sheet https://github.com/cytoscape/cytoscape.js-dagre

const Graph = ForceGraph()(document.getElementById("graph"))
  .nodeId("id")
  .nodeLabel("id")
  .cooldownTicks(0) // pre-defined layout, cancel force engine iterations
  .linkDirectionalArrowLength(3)
  .linkDirectionalArrowRelPos(1)
  .linkCurvature(
    (d) =>
      0.07 * // max curvature
      //   curve outwards from source, using gradual straightening within a margin of a few px
      Math.max(-1, Math.min(1, (d.source.x - d.target.x) / 5)) *
      Math.max(-1, Math.min(1, (d.target.y - d.source.y) / 5))
  );

fetch("course2.json")
  .then((r) => r.json())
  .then((data) => {
    const nodeDiameter = Graph.nodeRelSize() * 2;
    const layoutData = getLayout(data.nodes, data.links, {
      nodeWidth: nodeDiameter,
      nodeHeight: nodeDiameter,
      nodesep: nodeDiameter * 0.5,
      ranksep: nodeDiameter * Math.sqrt(data.nodes.length) * 0.6,

      // root nodes aligned on top
      rankDir: "RL",
      ranker: "network-simplex",
      linkSource: "target",
      linkTarget: "source",
    });
    layoutData.nodes.forEach((node) => {
      node.fx = node.x;
      node.fy = node.y;
    }); // fix nodes

    Graph.graphData(layoutData);
    Graph.zoomToFit();
  });

//

function getLayout(
  nodes,
  links,
  {
    nodeId = "id",
    linkSource = "source",
    linkTarget = "target",
    nodeWidth = 0,
    nodeHeight = 0,
    ...graphCfg
  } = {}
) {
  const getNodeWidth = accessorFn(nodeWidth);
  const getNodeHeight = accessorFn(nodeHeight);

  const g = new dagre.graphlib.Graph();
  g.setGraph({
    // rankDir: 'TD',
    // ranker: 'network-simplex' // 'tight-tree', 'longest-path'
    // acyclicer: 'greedy',
    nodesep: 5,
    edgesep: 1,
    ranksep: 20,
    ...graphCfg,
  });

  nodes.forEach((node) =>
    g.setNode(
      node[nodeId],
      Object.assign({}, node, {
        width: getNodeWidth(node),
        height: getNodeHeight(node),
      })
    )
  );
  links.forEach((link) =>
    g.setEdge(link[linkSource], link[linkTarget], Object.assign({}, link))
  );

  dagre.layout(g);

  return {
    nodes: g.nodes().map((n) => {
      const node = g.node(n);
      delete node.width;
      delete node.height;
      return node;
    }),
    links: g.edges().map((e) => g.edge(e)),
  };
}
