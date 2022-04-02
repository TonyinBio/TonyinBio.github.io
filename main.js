// TODO: Touch up css
// TODO: Change link colours?
// TODO: Add borders?
// TODO: Fix D3. Nodes repel away infinetly

// Created from https://github.com/vasturiano/force-graph
const highlightNodes = new Set();
const highlightLinks = new Set();
let hoverNode = null;

// function to scroll sidebar into view
function scrollTo(id) {
  let element = document.getElementById(id);
  element.scrollIntoView({ behavior: "smooth" });
  element.classList.add("highlight");
  setTimeout(function () {
    element.classList.remove("highlight");
  }, 1000);
}

const Graph = ForceGraph()
  .width(innerWidth - document.getElementById("sidebar").offsetWidth)
  .backgroundColor("#42AE90")
  .linkColor(() => "rgba(255,255,255,0.2)")
  .nodeId("id")
  .nodeVal("val")
  .nodeLabel("title")
  .nodeAutoColorBy("group")

  .linkSource("source")
  .linkTarget("target")
  .linkColor("#FAFCFC")
  .dagMode("lr")
  .dagLevelDistance(250)
  .onNodeHover((node) => {
    highlightNodes.clear();
    highlightLinks.clear();
    if (node && node.neighbors) {
      highlightNodes.add(node);
      node.neighbors.forEach((neighbor) => highlightNodes.add(neighbor));
      node.links.forEach((link) => highlightLinks.add(link));
    }

    hoverNode = node || null;
  })
  .onLinkHover((link) => {
    highlightNodes.clear();
    highlightLinks.clear();

    if (link) {
      highlightLinks.add(link);
      highlightNodes.add(link.source);
      highlightNodes.add(link.target);
    }
  })
  // .autoPauseRedraw(false)
  .nodeCanvasObject((node, ctx) => {
    const label = node.title;
    const fontSize = 15;
    ctx.font = `${fontSize}px Sans-Serif`;
    const textWidth = ctx.measureText(label).width;
    const bckgDimensions = [textWidth, fontSize].map((n) => n + fontSize * 0.2); // some padding

    if (node === hoverNode) {
      ctx.fillStyle = "#F6AE2D";
      ctx.fillRect(
        node.x - bckgDimensions[0] / 2,
        node.y - bckgDimensions[1] / 2,
        ...bckgDimensions
      );
    } else if (highlightNodes.has(node)) {
      ctx.fillStyle = "#1B98E0";
      ctx.fillRect(
        node.x - bckgDimensions[0] / 2,
        node.y - bckgDimensions[1] / 2,
        ...bckgDimensions
      );
    } else {
      ctx.fillStyle = "#565554";
      ctx.fillRect(
        node.x - bckgDimensions[0] / 2,
        node.y - bckgDimensions[1] / 2,
        ...bckgDimensions
      );
    }

    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillStyle = "#FAFCFC";
    ctx.fillText(label, node.x, node.y);

    node.__bckgDimensions = bckgDimensions; // to re-use in nodePointerAreaPaint
  })
  .onNodeDragEnd((node) => {
    node.fx = node.x;
    node.fy = node.y;
  })

  .nodePointerAreaPaint((node, color, ctx) => {
    ctx.fillStyle = color;
    const bckgDimensions = node.__bckgDimensions;
    bckgDimensions &&
      ctx.fillRect(
        node.x - bckgDimensions[0] / 2,
        node.y - bckgDimensions[1] / 2,
        ...bckgDimensions
      );
  })
  .linkDirectionalParticleSpeed(0.0025)
  .linkCurvature(
    (d) =>
      0.07 * // max curvature
      // curve outwards from source, using gradual straightening within a margin of a few px
      (["td", "bu"].includes(Graph.dagMode())
        ? Math.max(-1, Math.min(1, (d.source.x - d.target.x) / 25))
        : ["lr", "rl"].includes(Graph.dagMode())
        ? Math.max(-1, Math.min(1, (d.target.y - d.source.y) / 25))
        : ["radialout", "radialin"].includes(Graph.dagMode())
        ? 0
        : 1)
  )
  .onNodeClick((node) => {
    scrollTo(node.title);
    Graph.centerAt(node.x, node.y, 1000);
    Graph.zoom(1.5, 1000);
  })
  .linkDirectionalParticles(2)
  .linkDirectionalParticleWidth((link) => (highlightLinks.has(link) ? 10 : 3))
  .linkWidth((link) => (highlightLinks.has(link) ? 5 : 1))
  .d3Force("collide", d3.forceCollide(50))
  .d3AlphaDecay(0.02)
  .d3VelocityDecay(0.3);

const barLi = document.querySelectorAll(".barli");
//////////////////////////////
// Load JSON and Call graph //
//////////////////////////////
fetch("dags/course2.json")
  .then((res) => res.json())
  .then((data) => {
    const gData = {
      nodes: data.nodes,
      links: data.links,
    };

    // Locate neighbours
    data.links.forEach((link) => {
      const a = data.nodes.find((node) => {
        return node.id === link.source;
      });
      const b = data.nodes.find((node) => {
        return node.id === link.target;
      });

      !a.neighbors && (a.neighbors = []);
      !b.neighbors && (b.neighbors = []);
      a.neighbors.push(b);
      b.neighbors.push(a);

      !a.links && (a.links = []);
      !b.links && (b.links = []);
      a.links.push(link);
      b.links.push(link);
    });

    Graph(document.getElementById("graph")).graphData(data);

    // onDivClick, center at node

    function graphFocus(nodetitle) {
      let node = data.nodes.find((node) => {
        return node.title === nodetitle;
      });
      Graph.centerAt(node.x, node.y, 1000);
      Graph.zoom(1.5, 1000);
    }

    barLi.forEach((element) => {
      element.addEventListener("click", function () {
        graphFocus(this.id);
      });
    });

    // onDivhover, highlight node
    function graphHighlight(nodetitle) {
      let node = data.nodes.find((node) => {
        return node.title === nodetitle;
      });
      highlightNodes.clear();
      highlightLinks.clear();
      if (node && node.neighbors) {
        highlightNodes.add(node);
        node.neighbors.forEach((neighbor) => highlightNodes.add(neighbor));
        node.links.forEach((link) => highlightLinks.add(link));
      }
      hoverNode = node || null;
    }

    barLi.forEach((element) => {
      element.addEventListener("mouseenter", function () {
        graphHighlight(this.id);
      });
    });

    const bar = document.getElementById("sidebar");
    bar.addEventListener("mouseleave", function () {
      highlightNodes.clear();
      highlightLinks.clear();
      hoverNode = null;
    });

    barLi.forEach((div) => {
      let p = div.querySelector("p");
      let tempnode = data.nodes.find((node) => {
        return node.title === div.id;
      });
      p.innerHTML = tempnode.desc;
    });
  });

// Add module that inserts text into courses

// fetch("descriptions.json")
// .then(res => res.json())
// .then(descriptions => {
//   barLi.forEach(div => {
//     let p = div.querySelector('p');
//     p.innerHTML = descriptions.find(course => {
//       return course ===
//     })
//   });
// })
