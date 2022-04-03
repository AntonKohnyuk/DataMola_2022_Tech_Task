class Node {
  constructor(value, next = null) {
    this.value = value;
    this.next = next;
  }
}

class List {
  constructor(value) {
    this.head = new Node(value);
    this._length = 1;
  }

  addNode(value = this._length + 1, position = this._length) {
    if (position < 1 || position > this._length + 1) {
      return false;
    }

    let newNode = new Node(value);
    let currentNode = this.head;

    if (position === 0) {
      newNode.next = this.head;
      this.head = newNode;
      this._length++;
      return true;
    } else {
      for (let i = 0; i < position - 1; i++) {
        currentNode = currentNode.next;
      }
      newNode.next = currentNode.next;
      currentNode.next = newNode;
      this._length++;
      return true;
    }
  }

  removeNode(position = this._length - 1) {
    let currentNode = this.head;
    if (position < 0 || position > this._length) {
      return false;
    } else if (position === 0) {
      this.head = this.head.next;
      this._length--;
      return true;
    } else {
      for (let i = 0; i < position - 1; i++) {
        currentNode = currentNode.next;
      }
      currentNode.next = currentNode.next.next;
      this._length--;
      return true;
    }
  }

  printList() {
    if (this._length === 0) {
      return "Список пуст";
    }
    let currentNode = this.head;
    let listString = "";
    for (let i = 0; i < this._length; i++) {
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
console.log(list._length); //чтобы знать кол-во
list.addNode(123, 4);
list.removeNode(1);
list.removeNode(6);
console.log(list.removeNode(100));
list.printList();
list.removeNode(0);
list.printList();
list.removeNode();
list.printList();
