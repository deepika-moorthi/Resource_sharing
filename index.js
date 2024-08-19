class TreeNode {
  constructor(key, type, parent = null, data = "") {
    this.key = key;
    this.type = type;
    this.data = data;
    this.parent = parent;
    this.children = [];
  }

  get hasChildren() {
    return this.children.length !== 0;
  }
}

class Tree {
  constructor(key) {
    this.root = new TreeNode(key, "folder", null, "");
  }

  *preOrderTraversal(node = this.root) {
    yield node;
    if (node.children.length) {
      for (let child of node.children) {
        yield* this.preOrderTraversal(child);
      }
    }
  }

  insert(parentNodeKey, key, type, data = "") {
    for (let node of this.preOrderTraversal()) {
      if (node.key === parentNodeKey) {
        node.children.push(new TreeNode(key, type, node, data));
        return true;
      }
    }
    return false;
  }

  insertNode(parentNodeKey, newNode) {
    for (let node of this.preOrderTraversal()) {
      if (node.key === parentNodeKey) {
        newNode.parent = node;
        node.children.push(newNode);
      }
    }
  }

  remove(key) {
    for (let node of this.preOrderTraversal()) {
      const filtered = node.children.filter((c) => c.key !== key);
      if (filtered.length !== node.children.length) {
        node.children = filtered;
        return true;
      }
    }
    return false;
  }

  find(key) {
    for (let node of this.preOrderTraversal()) {
      if (node.key === key) return node;
    }
    return undefined;
  }
}

function updateTree(tree, baseDiv = "root", movingNode = null) {
  document.getElementById(baseDiv).innerHTML = "";

  const preOrderTraversal = tree.preOrderTraversal();
  preOrderTraversal.next();
  let currentNode = preOrderTraversal.next().value;
  if (currentNode) {
    do {
      const newLi = document.createElement("li");
      // if(
      //   //check the type
      //   truw
      //   ){
      //     const button = //create a button with txt inside
      //     button.onClick = function () {

      //     }
      //     newLi.appendChild(document.crea)
      // }

      let liItem = document.createElement("button");
      liItem.appendChild(document.createTextNode(currentNode.key));
      const key = currentNode.key;
      const data = currentNode.data;
      if (currentNode.type === "folder") {
        liItem.onclick = () => {
          const movingFolderName =
            document.getElementById("movingFolderName").innerHTML;
          if (movingFolderName.length > 0) {
            const movingNode = tree.find(movingFolderName);
            tree.remove(movingFolderName);
            tree.insertNode(key, movingNode);
            document.getElementById("movingFolderName").innerHTML = "";
            updateTree(tree);
          } else {
            document.getElementById("name").innerHTML = key;
            document.getElementById("link").style.visibility = "hidden";
          }
        };
      } else {
        liItem.onclick = () => {
          document.getElementById("name").innerHTML = key;
          document.getElementById("link").style.visibility = "visible";
          document.getElementById("link").setAttribute("href", data || "");
        };
      }
      const image = document.createElement("img");
      image.setAttribute(
        "src",
        currentNode.type === "folder"
          ? "./src/folderImage.png"
          : "./fileImage.png"
      );
      image.height = 12;
      image.width = 12;
      const div = document.createElement("div");
      newLi.style.borderWidth = "1px";
      newLi.style.borderColor = "black";
      newLi.style.flexDirection = "row";

      newLi.style.justifyContent = "center";
      div.setAttribute(
        "class",
        currentNode.type === "folder" ? "folderButton" : "fileButton"
      );
      div.style.display = "flex";
      div.style.alignItems = "center";
      div.appendChild(image);
      div.appendChild(liItem);
      newLi.appendChild(div);

      if (currentNode.hasChildren) {
        const newUl = document.createElement("ul");
        newUl.setAttribute("id", currentNode.key);
        newLi.appendChild(newUl);
      }
      try {
        const parentUl = document.getElementById(currentNode.parent.key);
        parentUl.appendChild(newLi);
      } catch {}
      currentNode = preOrderTraversal.next().value;
    } while (currentNode);
  }
}

const tree = new Tree("root");
tree.insert("root", "semester1", "folder");
tree.insert("root", "semester2", "folder");
tree.insert("root", "semester3", "folder");
tree.insert("root", "semester4", "folder");
tree.insert("root", "semester5", "folder");
tree.insert("root", "semester6", "folder");
tree.insert("root", "semester7", "folder");
tree.insert("root", "semester8", "folder");
tree.insert("root", "placement_notes", "folder");

tree.insert("semester1", "python", "folder");


tree.insert("semester2", "it essentials", "folder");


tree.insert("semester3", "pds", "folder");


tree.insert("semester4", "oops", "folder");


tree.insert("semester5", "cn", "folder");


tree.insert("semester6", "electives", "folder");






tree.insert("placement_notes", "place_prep", "file", "file path");

updateTree(tree);

document.getElementById("addNew").onclick = function () {
  const parentFolder = document.getElementById("parentKey").value;
  const key = document.getElementById("key").value;
  const type = document.getElementById("type").value;
  const data = document.getElementById("data").value;
  if (
    parentFolder.length > 0 &&
    tree.find(parentFolder) &&
    key.length > 0 &&
    ((type === "file" && data.length > 0) || type !== "file")
  ) {
    tree.insert(parentFolder, key, type, data);
    updateTree(tree);
    return;
  }

  alert("Please provide a valid folder and file information.");
};

document.getElementById("delete").onclick = () => {
  const key = document.getElementById("name").innerHTML;
  if (tree.remove(key)) updateTree(tree);
};

document.getElementById("move").onclick = () => {
  const key = document.getElementById("name").innerHTML;
  document.getElementById("movingFolderName").innerHTML = key;
}