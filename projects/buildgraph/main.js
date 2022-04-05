let nodeIdCounter = 0, linkIdCounter = 0;
let nodes = [], links = [];
let dragSourceNode = null, interimLink = null;
const snapInDistance = 15;
const snapOutDistance = 40;

const updateGraphData = () => {
  Graph.graphData({ nodes: nodes, links: links });
};

const distance = (node1, node2) => {
  return Math.sqrt(Math.pow(node1.x - node2.x, 2) + Math.pow(node1.y - node2.y, 2));
};

const rename = (nodeOrLink, type) => {
  let value = prompt('Name this ' + type + ':', nodeOrLink.title);
  if (!value) {
    return;
  }
  nodeOrLink.title = value;
  updateGraphData();
};

const setInterimLink = (source, target) => {
  let linkId = linkIdCounter++;
  interimLink = { id: linkId, source: source, target: target };
  links.push(interimLink);
  updateGraphData();
};

const removeLink = link => {
  links.splice(links.indexOf(link), 1);
};

const removeInterimLinkWithoutAddingIt = () => {
  removeLink(interimLink);
  interimLink = null;
  updateGraphData();
};

const removeNode = node => {
  links.filter(link => link.source === node || link.target === node).forEach(link => removeLink(link));
  nodes.splice(nodes.indexOf(node), 1);
};

const Graph = ForceGraph()
  (document.getElementById('graph'))
  .linkDirectionalArrowLength(6)
  .linkDirectionalArrowRelPos(1)
  .onNodeDrag(dragNode => {
    dragSourceNode = dragNode;
    for (let node of nodes) {
      if (dragNode === node) {
        continue;
      }
      // close enough: snap onto node as target for suggested link
      if (!interimLink && distance(dragNode, node) < snapInDistance) {
        setInterimLink(dragSourceNode, node);
      }
      // close enough to other node: snap over to other node as target for suggested link
      if (interimLink && node !== interimLink.target && distance(dragNode, node) < snapInDistance) {
        removeLink(interimLink);
        setInterimLink(dragSourceNode, node);
      }
    }
    // far away enough: snap out of the current target node
    if (interimLink && distance(dragNode, interimLink.target) > snapOutDistance) {
      removeInterimLinkWithoutAddingIt();
    }

    nodes.map((node) => {
      node.fx = node.x;
      node.fy = node.y;
    })
  })
  .onNodeDragEnd(() => {
    dragSourceNode = null;
    interimLink = null;
    updateGraphData();
  })
  .nodeColor(node => node === dragSourceNode || (interimLink &&
    (node === interimLink.source || node === interimLink.target)) ? 'orange' : null)
  .linkColor(link => link === interimLink ? 'orange' : '#bbbbbb')
  .linkLineDash(link => link === interimLink ? [2, 2] : [])
  .onNodeClick((node, event) => rename(node, 'node'))
  .onNodeRightClick((node, event) => removeNode(node))
  .onLinkClick((link, event) => rename(link, 'link'))
  .onLinkRightClick((link, event) => removeLink(link))
  .onBackgroundClick(event => {
    let coords = Graph.screen2GraphCoords(event.layerX, event.layerY);
    let nodeId = nodeIdCounter++;
    nodes.push({ id: nodeId, x: coords.x, y: coords.y, title: 'node_' + nodeId });
    updateGraphData();
  })
  .nodeCanvasObject((node, ctx) => {
    const label = node.title;
    const fontSize = 10;
    ctx.font = `${fontSize}px Sans-Serif`;
    const textWidth = ctx.measureText(label).width;
    const bckgDimensions = [textWidth, fontSize].map((n) => n + fontSize * 0.2); // some padding

    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillStyle = "#00000";
    ctx.fillText(label, node.x, node.y);

    node.__bckgDimensions = bckgDimensions; // to re-use in nodePointerAreaPaint
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
  .d3Force("collide", d3.forceCollide(50));
updateGraphData();


// Upload data
d3.select("#upload-input").on("click", function(){
  document.getElementById("hidden-file-upload").click();
});
d3.select("#hidden-file-upload").on("change", function () {
  if (window.File && window.FileReader && window.FileList && window.Blob) {
    var uploadFile = this.files[0];
    var filereader = new window.FileReader();

    filereader.onload = function () {
      var txtRes = filereader.result;
      // TODO better error handling
      try {
        var jsonObj = JSON.parse(txtRes);
        console.log(jsonObj);
        nodes = jsonObj.nodes;
        links = jsonObj.links;
        nodeIdCounter = jsonObj.nodes.length + 1;
    
        // var newLinks = jsonObj.links;
        // newLinks.forEach(function (e, i) {
        //   newLinks[i] = {
        //     source: thisGraph.nodes.filter(function (n) { return n.id == e.source; })[0],
        //     target: thisGraph.nodes.filter(function (n) { return n.id == e.target; })[0]
        //   };
        // });
        // thisGraph.links = newLinks;
        updateGraphData();
      } catch (err) {
        window.alert("Error parsing uploaded file\nerror message: " + err.message);
        return;
      }
    };
    filereader.readAsText(uploadFile);

  } else {
    alert("Your browser won't let you save this graph -- try upgrading your browser to IE 10+ or Chrome or Firefox.");
  }

});


// Download

d3.select("#download-input").on("click", function(){
  var nodesave = nodes;
  var linksave = [];

  for (let i = 0; i < nodesave.length; i++) {
    delete nodesave[i].x
    delete nodesave[i].y
    delete nodesave[i].index
    delete nodesave[i].__indexColor
    delete nodesave[i].vx
    delete nodesave[i].vy
  };

  for (let i = 0; i < links.length; i++) {
    linksave.push(
      { "source": links[i].source.id, "target": links[i].target.id }
    )
  };

  var toSave = { nodes: nodesave, links: linksave }

  var json = JSON.stringify(toSave, null, 4);
  console.log(json);
  download(json, 'dag.json', 'application/json');
});

function download(content, fileName, contentType) {
  var a = document.createElement("a");
  var file = new Blob([content], { type: contentType });
  a.href = URL.createObjectURL(file);
  a.download = fileName;
  a.click();
};