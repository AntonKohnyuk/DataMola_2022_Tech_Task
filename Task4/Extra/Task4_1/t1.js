class Node {
  constructor(value, next = null) {
    this.value = value;
    this.next = next;
  }
}

class List {
  constructor(value) {
    this.head = new Node(value);
    this.length = 1;
  }

  addNode(value = this.length + 1, position = this.length + 1) {
    if (position < 1 || position > this.length + 1) {
      return false;
    }

    let newNode = new Node(value);
    let currentNode = this.head;

    if (position === 1) {
      newNode.next = this.head;
      this.head = newNode;
      this.length++;
      return true;
    } else {
      for (let i = 1; i < position - 1; i++) {
        currentNode = currentNode.next;
      }
      newNode.next = currentNode.next;
      currentNode.next = newNode;
      this.length++;
      return true;
    }
  }

  removeNode(position) {
    let currentNode = this.head;
    if (position < 1 || position > this.length) {
      return false;
    } else if (position === 1) {
      this.head = this.head.next;
      this.length--;
      return true;
    } else {
      for (let i = 1; i < position - 1; i++) {
        currentNode = currentNode.next;
      }
      currentNode.next = currentNode.next.next;
      this.length--;
      return true;
    }
  }

  printList() {
    if (this.length === 0) {
      return "Список пуст";
    }
    let currentNode = this.head;
    let listString = "";
    for (let i = 1; i <= this.length; i++) {
      listString += `${currentNode.value}, `;
      currentNode = currentNode.next;
    }
    console.log(listString);
  }
}

//проверки
let list = new List(1);
list.addNode();
list.addNode();
list.addNode();
list.addNode();
list.addNode();
list.addNode();
list.addNode();
list.addNode();
console.log(list.length); //чтобы знать кол-во
list.addNode(123, 4);
list.removeNode(1);
list.removeNode(6);
console.log(list.removeNode(100));
list.printList();
