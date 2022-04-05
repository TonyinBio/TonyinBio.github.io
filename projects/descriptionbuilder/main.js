fetch("course2.json")
  .then((res) => res.json())
  .then((course2) => {
    function appendDesc(title, desc) {
      let node = course2.nodes.find((node) => {
        return node.title === title;
      });
      node.desc = desc;
      console.log(title)
      console.log(node.desc);
    }

    let title = document.getElementById("title");
    let desc = document.getElementById("desc");
    let appendButton = document.querySelector("#appendButton");
    appendButton.addEventListener("click", () => {
      appendDesc(title.value, desc.value);
    });

    let saveButton = document.querySelector("#saveButton");
    saveButton.addEventListener("click", () => {
      let blob = new Blob([window.JSON.stringify(course2)], {
        type: "text/plain;charset=utf-8",
      });
      saveAs(blob, "course2.json");
    });
  });
