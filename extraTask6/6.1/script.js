let listHead = undefined;

function createList(titel, list) {
  let fontSize = 2;
  let listPage = "";
  listPage += `<h2>${titel}</h2><ul class="listHead" id="listHead">`;
  list.forEach((node) => {
    listPage += listLogic(node, fontSize);
  });
  listPage += `</ul>`;
  document.getElementById("list").innerHTML = listPage;
  listHead = document.getElementById("listHead");
  for (let li of listHead.querySelectorAll("li")) {
    let span = document.createElement("span");
    li.prepend(span);
    span.append(span.nextSibling);
  }
  listHead.onclick = function (event) {
    if (event.target.tagName != "SPAN") {
      return;
    }

    let childrens = event.target.parentNode.querySelector("ul");
    if (!childrens) return;

    childrens.hidden = !childrens.hidden;
  };
}

function listLogic(node, fontSize) {
  let listHtml = "";
  listHtml += `<li style="font-size: ${fontSize}rem">${node.value}`;
  if (node.children && node.children.lenght !== 0) {
    listHtml += `<ul>`;
    node.children.forEach((child) => {
      listHtml += listLogic(child, fontSize * 0.9);
    });
    listHtml += `</ul>`;
  }
  listHtml += `</li>`;
  return listHtml;
}

class Node {
  constructor(value) {
    this.value = value;
    this.children = [];
  }
  addChild(value) {
    this.children.push(new Node(value));
  }
}

const list = [];
for (let i = 0; i < 10; i++) list.push(new Node("11111111"));
for (let i = 0; i < 5; i++) list[0].addChild("22222222");
for (let i = 0; i < 5; i++) list[0].children[0].addChild("22222222");
createList("Anton", list);
