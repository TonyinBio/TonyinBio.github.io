//https://github.com/vasturiano/force-graph
const highlightNodes = new Set();
const highlightLinks = new Set();
let hoverNode = null;

// function to focus into view 
function scrollTo (id) {
  let element = document.getElementById(id);
  element.scrollIntoView({behavior: "smooth"});
  element.classList.add('highlight')
  setTimeout(function() {element.classList.remove('highlight')
}, 1000)
};

// generate json from https://bl.ocks.org/cjrd/6863459
  const Graph = ForceGraph()
    .backgroundColor('#42AE90')
    .linkColor(() => 'rgba(255,255,255,0.2)')
    .nodeId('id')
    .nodeVal('val')
    .nodeLabel('title')
    .nodeAutoColorBy('group')
    .nodeRelSize(30)
    .linkSource('source')
    .linkTarget('target')
    .linkColor('#FAFCFC')
    .dagMode('lr')
    .dagLevelDistance(100)
  //   .onNodeHover(node => {
  //   highlightNodes.clear();
  //   highlightLinks.clear();
  //   if (node) {
  //     highlightNodes.add(node);
  //     node.neighbors.forEach(neighbor => highlightNodes.add(neighbor));
  //     node.links.forEach(link => highlightLinks.add(link));
  //   }

  //   hoverNode = node || null;
  // })
    .nodeCanvasObject((node, ctx) => {
    const label = node.title;
    const fontSize = 15;
    ctx.font = `${fontSize}px Sans-Serif`;
    const textWidth = ctx.measureText(label).width;
    const bckgDimensions = [textWidth, fontSize].map(n => n + fontSize * 0.2); // some padding

    ctx.fillStyle = '#565554';
    ctx.fillRect(node.x - bckgDimensions[0] / 2, node.y - bckgDimensions[1] / 2, ...bckgDimensions);

    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = '#FAFCFC';
    ctx.fillText(label, node.x, node.y);

    node.__bckgDimensions = bckgDimensions; // to re-use in nodePointerAreaPaint
    })
    .linkCurvature(d =>
    0.07 * // max curvature
    // curve outwards from source, using gradual straightening within a margin of a few px
    (['td', 'bu'].includes(Graph.dagMode())
      ? Math.max(-1, Math.min(1, (d.source.x - d.target.x) / 25)) :
      ['lr', 'rl'].includes(Graph.dagMode())
        ? Math.max(-1, Math.min(1, (d.target.y - d.source.y) / 25))
        : ['radialout', 'radialin'].includes(Graph.dagMode()) ? 0 : 1
    )
    )
    .onNodeClick(node => {
      scrollTo(node.title)
    })
    .linkDirectionalParticles(2)
    .linkDirectionalParticleWidth(3)
    .d3Force('collide', d3.forceCollide(50))
    .d3AlphaDecay(0.02)
    .d3VelocityDecay(0.3);
  
fetch('dags/course2.json')
.then(res => res.json())
.then(data => {
  Graph(document.getElementById('graph'))
    .graphData(data)
});
