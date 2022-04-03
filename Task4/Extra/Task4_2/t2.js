function add(a, b = undefined) {
  if (b !== undefined) {
    return a + b;
  } else {
    return function (value) {
      return value + a;
    };
  }
}

function sub(a, b = undefined) {
  if (b !== undefined) {
    return a - b;
  } else {
    return function (value) {
      return value - a;
    };
  }
}

function mul(a, b = undefined) {
  if (b !== undefined) {
    return a * b;
  } else {
    return function (value) {
      return value * a;
    };
  }
}

function div(a, b = undefined) {
  if (b !== undefined) {
    return a / b;
  } else {
    return function (value) {
      return value / a;
    };
  }
}

function pipe() {
  let operations = [];
  for (let i = 0; i < arguments.length; i++) {
    operations[i] = arguments[i];
  }
  return function (number) {
    let result = number;
    for (let i = 0; i < operations.length; i++) {
      result = operations[i](result);
    }
    return result;
  };
}

let a = add(1, 6); //7
console.log(a);
let b = add(2);
console.log(b(a)); //9
let c = pipe(add(6), div(5), mul(10), sub(27))(9);
console.log(c); //3
