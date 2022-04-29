// TODO: Change link colours?
// TODO: Add borders?

// TODO: Improve linkless
// TODO: Clear search bar
// TODO: Link legend

// TODO: Get review information for courses

// Created from https://github.com/vasturiano/force-graph
const highlightNodes = new Set();
const highlightLinks = new Set();
let hoverNode = null;

// function to scroll rightBar into view
function scrollTo(id) {
  let element = document.getElementById(id);
  element.scrollIntoView({ behavior: "smooth" });
  element.classList.add("highlight");
  setTimeout(function () {
    element.classList.remove("highlight");
  }, 1000);
};

// Tabs
tabLinks = document.querySelectorAll(".tabLink");
tabContentList = document.querySelectorAll(".tabContent");

tabLinks.forEach((tabLink) => {
  tabLink.addEventListener("click", goToTab)
});

function goToTab(e) {
  tabLinks.forEach(tab => tab.classList.remove("activated"))
  
  tabContentList.forEach((tabContent) => {
    tabContent.style.display = "none";
    if (tabContent.id === e.target.dataset.linkTo) {
      tabContent.style.display = "block";
    };
  });
  e.target.classList.add("activated");
}

tabLinks[0].click();

const Graph = ForceGraph()
  .width(innerWidth - document.getElementById("rightBar").offsetWidth - document.getElementById("leftBar").offsetWidth)
  .backgroundColor("#101020")
  .nodeId("id")
  .nodeVal("val")
  .nodeLabel("title")
  // .nodeAutoColorBy("color")

  // .cooldownTime(3000)

  .linkSource("source")
  .linkTarget("target")
  .linkAutoColorBy("type")

  // .dagMode("lr")
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
  .autoPauseRedraw(false)
  .nodeCanvasObject((node, ctx) => {
    const label = node.title;
    const fontSize = 10;
    ctx.font = `${fontSize}px Sans-Serif`;
    const textWidth = ctx.measureText(label).width;
    const bckgDimensions = [textWidth, fontSize].map((n) => n + fontSize * 0.4); // some padding

    if (node === hoverNode) {
      ctx.fillStyle = "#F6AE2D";
      ctx.fillRect(
        node.x - bckgDimensions[0] / 2,
        node.y - bckgDimensions[1] / 2,
        ...bckgDimensions
      );

      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillStyle = "#000000";
      ctx.fillText(label, node.x, node.y);
    } else if (highlightNodes.has(node)) {
      ctx.fillStyle = "#1B98E0";
      ctx.fillRect(
        node.x - bckgDimensions[0] / 2,
        node.y - bckgDimensions[1] / 2,
        ...bckgDimensions
      );

      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillStyle = "#000000";
      ctx.fillText(label, node.x, node.y);
    } else {
      ctx.fillStyle = node.color;
      ctx.fillRect(
        node.x - bckgDimensions[0] / 2,
        node.y - bckgDimensions[1] / 2,
        ...bckgDimensions
      );
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillStyle = "#FAFCFC";
      ctx.fillText(label, node.x, node.y);
    }

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
  .d3Force(
    "charge",
    d3.forceManyBody().strength(-100).distanceMin(10).distanceMax(3000)
  )
  .d3Force("link", d3.forceLink().iterations(1)
  // .distance(100)
  )
  .d3Force("collide", d3.forceCollide(30));
// .d3AlphaDecay(0.01)
// .d3VelocityDecay(0.3);

//////////////////////////////
// Load JSON and Call graph //
//////////////////////////////
fetch("dags/UPcourse2.json")
  .then((res) => res.json())
  .then((data) => {
    data.nodes.forEach((node) => {
      node.year = node.title.match(/\d{3}/)[0];
      node.year = parseInt(node.year);
    });

    data.nodes.sort((a, b) => {
      return a.year - b.year;
    });

    // Highlight interactivity
    const rightBar = document.getElementById("rightBar");
    rightBar.addEventListener("mouseleave", function () {
      highlightNodes.clear();
      highlightLinks.clear();
      hoverNode = null;
    });

    // Course collapse interactivity
    tagCollapsed = false;
    const rightTag = document.getElementById("rightTag");
    rightTag.addEventListener("click", () => {
      rightBar.classList.toggle("right");
      rightTag.classList.toggle("tagCollapse");
      tagCollapsed = !tagCollapsed;
      if (tagCollapsed === true) {
        rightTag.innerHTML = "<<br><<br><";

        updatePosition();

        Graph.width(graphWidth);
      } else {
        rightTag.innerHTML = "><br>><br>>";

        updatePosition();

        setTimeout(() => {
          Graph.width(graphWidth);
        }, 500);
      }
    });

    

    const subjCardsContainer = document.getElementById("subjCardsContainer");
    // Add subjects
    let subjCards = data.subjects.map((subject) => {
      let h2 = document.createElement("h2");
      h2.classList.add("subjBarLi");
      h2.id = subject;
      h2.append(subject);

      subjCardsContainer.append(h2);
      return { subject: subject, element: h2, hide: false };
    });

    // Collapse interactivity
    subjTagCollapsed = false;
    const leftTag = document.getElementById("leftTag");
    const leftBar = document.getElementById("leftBar")
    // leftTag.style.left = `${leftBar.offsetWidth - 10}px`;


    leftTag.addEventListener("click", () => {
      leftBar.classList.toggle("left");
      leftTag.classList.toggle("tagCollapse");
      subjTagCollapsed = !subjTagCollapsed;
      

      if (subjTagCollapsed === true) {
        leftTag.innerHTML = "><br>><br>>";
        updatePosition()
        Graph.width(graphWidth);
        graphDiv.style.left = "0px";
      } else {
        leftTag.innerHTML = "<<br><<br><";
        updatePosition()
        
        setTimeout(() => {
          graphDiv.style.left = `${leftBar.offsetWidth}px`;
          Graph.width(graphWidth);
        }, 500);
      }
    });


    let graphWidth;
    function updatePosition() {
      if (subjTagCollapsed === false) {
          graphWidth = innerWidth - leftBar.offsetWidth;
      } else {
        graphWidth = innerWidth
      };
      if (tagCollapsed === false) {
        graphWidth -= rightBar.offsetWidth
      };
    }

    // Hide subjects
    let visibleSubjects = data.subjects;
    let filteredData = {
      nodes: data.nodes,
      links: data.links,
    };

    subjCards.forEach((card) => {
      card.element.addEventListener("click", () => {
        toggleHide(card);

        checkMinimum();
        checkLinkless();
        Graph.graphData(filteredData);

        resetCards();    
      });
    });
    

    function resetGraph() {
      filteredData = {
        nodes: data.nodes.filter((node) => {
          let nodeSubject = node.title.split(/ \d{3}/)[0];
          return visibleSubjects.includes(nodeSubject);
        }),

        links: data.links.filter((link) => {
          let sourceSubject = link.source.title.split(/ \d{3}/)[0];
          let targetSubject = link.target.title.split(/ \d{3}/)[0];

          return (
            visibleSubjects.includes(sourceSubject) &&
            visibleSubjects.includes(targetSubject)
          );
        }),
      };
    }
    function toggleHide(card) {
      card.element.classList.toggle("deactivated");

      card.hide = !card.hide;

      if (card.hide === true) {
        visibleSubjects = visibleSubjects.filter((subject) => {
          return subject != card.subject;
        });
      } else {
        visibleSubjects.push(card.subject);
      }

      resetGraph();
    }
    const barLi = rightBar.getElementsByClassName("barli");
    // Add cards
    let cards;
    function resetCards() {
      while (barLi.length > 0) {
        barLi[0].remove()
      }

      cards = filteredData.nodes.map((node) => {
        let div = document.createElement("div");
        div.classList.add("barli");
        div.id = node.title;

        let h1 = document.createElement("h1");
        let p = document.createElement("p");

        h1.append(node.title);
        p.append(node.desc);

        div.append(h1, p);

        div.addEventListener("mouseenter", graphHighlight);
        div.addEventListener("click", graphFocus)

        rightBar.append(div);

        return { title: node.title, desc: node.desc, element: div };
      });
    }
    resetCards();

    // Show all or No Cards
    const showAll = document.getElementById("showAll");
    const showNone = document.getElementById("showNone");

    showAll.addEventListener("click", () => {
      subjCards.forEach((card) => {
        card.element.classList.add("deactivated");
        card.hide = true;
        toggleHide(card);

      })
      checkMinimum();
      checkLinkless();
      Graph.graphData(filteredData);

      resetCards();
    })
    showNone.addEventListener("click", () => {
      subjCards.forEach((card) => {
        card.element.classList.remove("deactivated");
        card.hide = false;
        toggleHide(card);

      })
      checkMinimum();
      checkLinkless();
      Graph.graphData(filteredData);

      resetCards();
    })

    // Linkless
    const linkless = document.getElementById("linkless");
    let isLinkLess = false;
    linkless.addEventListener("click", () => {
      isLinkLess = !isLinkLess;
      linkless.classList.toggle("knobDeactivated");

      resetGraph();
      checkLinkless();
      checkMinimum();
      Graph.graphData(filteredData);
    });

    function checkLinkless() {
      if (isLinkLess === true) {
        filteredData = {
          nodes: filteredData.nodes.filter((node) => {
            return !data.noLinks.includes(node.title);
          }),
          links: filteredData.links,
        };
      }
    }

    // Minimum
    const minimum = document.getElementById("minimum");
    let isMinimum = false;
    minimum.addEventListener("click", () => {
      isMinimum = !isMinimum;
      minimum.classList.toggle("knobDeactivated");

      resetGraph();
      checkMinimum();
      checkLinkless();
      Graph.graphData(filteredData);
    });

    function checkMinimum() {
      if (isMinimum === true) {
        filteredData = {
          nodes: filteredData.nodes,
          links: filteredData.links.filter((link) => {
            if (link.duplicate === true) {
              return false;
            } else {
              return true;
            }
          }),
        };
      }
    }

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

    graphDiv = document.getElementById("graph");
    graphDiv.style.position = "absolute";
    graphDiv.style.left = `${leftBar.offsetWidth}px`;
    Graph(graphDiv).graphData(filteredData);
    


    // Gravity button

    const gravity = document.getElementById("gravity");
    gravity.addEventListener("click", toggleGravity);

    let gravityOn = false;
    function toggleGravity() {
      gravityOn = !gravityOn;
      gravity.classList.toggle("knobDeactivated");

      if (gravityOn === true) {
        // Graph.d3Force("charge", d3.forceManyBody().strength(35));
        // Graph.d3AlphaDecay(0.01)
        Graph.d3Force("forceX", d3.forceX()
          .strength(0.05))
        Graph.d3Force("forceY", d3.forceY()
          .strength(0.05))
        Graph.d3ReheatSimulation();
      } else {
        // Graph.d3Force(
        //   "charge",
        //   d3.forceManyBody().strength(-100).distanceMin(10).distanceMax(3000)
        // );
        Graph.d3Force("forceX", d3.forceX()
          .strength(0))
        Graph.d3Force("forceY", d3.forceY()
          .strength(0))
        Graph.d3ReheatSimulation();
      }
    }

    // Freeze button

    const freeze = document.getElementById("freeze");
    freeze.addEventListener("click", toggleFreeze);

    let freezeOn = false;
    function toggleFreeze() {
      freezeOn = !freezeOn;
      freeze.classList.toggle("knobDeactivated");

      if (freezeOn === true) {
        filteredData.nodes.forEach((node) => {
          node.fx = node.x;
          node.fy = node.y;
        });
      } else {
        filteredData.nodes.forEach((node) => {
          node.fx = null;
          node.fy = null;
          checkDag()
        });
      }
    }

    // DAG button

    function checkDag() {
      if (isDag === true) {
        Graph.dagMode("td");
        Graph.d3Force(
          "charge",
          d3.forceManyBody().strength(-100).distanceMin(10).distanceMax(10000)
        );
        Graph.d3Force(
          "collide",
          d3.forceCollide(40)
        );
      } else {
        Graph.dagMode(null);
        Graph.d3Force(
          "charge",
          d3.forceManyBody().strength(-100).distanceMin(10).distanceMax(3000)
        );
        Graph.d3Force(
          "collide",
          d3.forceCollide(30)
        )
      }
    }

    const dagButton = document.getElementById("dag");
    isDag = false;
    dagButton.addEventListener("click", () => {
      isDag = !isDag;
      dagButton.classList.toggle("knobDeactivated");
      checkDag();
    });

    // Search bar

    const searchInput = document.getElementById("search");

    searchInput.addEventListener("input", (e) => {
      const value = e.target.value.toLowerCase();
      cards.forEach((card) => {
        card.desc = card.desc || "";
        const isVisible =
          card.title.toLowerCase().includes(value) ||
          card.desc.toLowerCase().includes(value);
        card.element.classList.toggle("hide", !isVisible);
      });
    });

    // onDivClick, center at node

    function graphFocus(e) {
      let node = data.nodes.find((node) => {
        return node.title === e.currentTarget.id;
      });

      Graph.centerAt(node.x, node.y, 1000);
      Graph.zoom(1.5, 1000);
    }

    // onDivhover, highlight node
    function graphHighlight(e) {
      let node = data.nodes.find((node) => {
        return node.title === e.currentTarget.id;
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
  });
