let nonFreeFields = 0;
let player = 0;
let ai = 0;
let i;
function load() {
  document
    .getElementById("restart")
    .addEventListener("click", function (event) {
      document.querySelectorAll(".field").forEach((field) => {
        field.innerHTML = "";
        nonFreeFields = 0;
      });
    });

  document.getElementById("game").addEventListener("click", function (event) {
    let curTar = event.target;
    if (curTar.closest(".field")) {
      if (!curTar.closest(".field").innerHTML) {
        curTar.closest(".field").innerHTML = "x";
        nonFreeFields++;
        checkForWinner();
        if (!nonFreeFields) {
          document.querySelectorAll(".field").forEach((field) => {
            field.innerHTML = "";
          });
        } else {
          while (true) {
            i = Math.floor(Math.random() * (8 - 0 + 1)) + 0;
            if (document.querySelectorAll(".field")[i].innerHTML === "") {
              document.querySelectorAll(".field")[i].innerHTML = "o";

              break;
            }
          }
          nonFreeFields++;
        }

        checkForWinner();
        if (!nonFreeFields) {
          document.querySelectorAll(".field").forEach((field) => {
            field.innerHTML = "";
          });
        }
      } else {
        return;
      }
    }
  });
}

function checkForWinner() {
  const fields = document.querySelectorAll(".field");
  if (
    fields[0].innerHTML === fields[1].innerHTML &&
    fields[1].innerHTML === fields[2].innerHTML &&
    fields[0].innerHTML !== ""
  ) {
    if (fields[0].innerHTML === "x") {
      alert("Вы победили!");
      document.getElementById("player").innerHTML = ++player;
    } else {
      alert("ИИ победил!");
      document.getElementById("ai").innerHTML = ++ai;
    }
    nonFreeFields = 0;
  } else if (
    fields[3].innerHTML === fields[4].innerHTML &&
    fields[4].innerHTML === fields[5].innerHTML &&
    fields[3].innerHTML !== ""
  ) {
    if (fields[3].innerHTML === "x") {
      alert("Вы победили!");
      document.getElementById("player").innerHTML = ++player;
    } else {
      alert("ИИ победил!");
      document.getElementById("ai").innerHTML = ++ai;
    }
    nonFreeFields = 0;
  } else if (
    fields[6].innerHTML === fields[7].innerHTML &&
    fields[7].innerHTML === fields[8].innerHTML &&
    fields[6].innerHTML !== ""
  ) {
    if (fields[6].innerHTML === "x") {
      alert("Вы победили!");
      document.getElementById("player").innerHTML = ++player;
    } else {
      alert("ИИ победил!");
      document.getElementById("ai").innerHTML = ++ai;
    }
    nonFreeFields = 0;
  } else if (
    fields[0].innerHTML === fields[3].innerHTML &&
    fields[3].innerHTML === fields[6].innerHTML &&
    fields[6].innerHTML !== ""
  ) {
    if (fields[6].innerHTML === "x") {
      alert("Вы победили!");
      document.getElementById("player").innerHTML = ++player;
    } else {
      alert("ИИ победил!");
      document.getElementById("ai").innerHTML = ++ai;
    }
    nonFreeFields = 0;
  } else if (
    fields[1].innerHTML === fields[4].innerHTML &&
    fields[4].innerHTML === fields[7].innerHTML &&
    fields[1].innerHTML !== ""
  ) {
    if (fields[1].innerHTML === "x") {
      alert("Вы победили!");
      document.getElementById("player").innerHTML = ++player;
    } else {
      alert("ИИ победил!");
      document.getElementById("ai").innerHTML = ++ai;
    }
    nonFreeFields = 0;
  } else if (
    fields[2].innerHTML === fields[5].innerHTML &&
    fields[5].innerHTML === fields[8].innerHTML &&
    fields[2].innerHTML !== ""
  ) {
    if (fields[1].innerHTML === "x") {
      alert("Вы победили!");
      document.getElementById("player").innerHTML = ++player;
    } else {
      alert("ИИ победил!");
      document.getElementById("ai").innerHTML = ++ai;
    }
    nonFreeFields = 0;
  } else if (
    fields[0].innerHTML === fields[4].innerHTML &&
    fields[4].innerHTML === fields[8].innerHTML &&
    fields[0].innerHTML !== ""
  ) {
    if (fields[0].innerHTML === "x") {
      alert("Вы победили!");
      document.getElementById("player").innerHTML = ++player;
    } else {
      alert("ИИ победил!");
      document.getElementById("ai").innerHTML = ++ai;
    }
    nonFreeFields = 0;
  } else if (
    fields[2].innerHTML === fields[4].innerHTML &&
    fields[4].innerHTML === fields[6].innerHTML &&
    fields[6].innerHTML !== ""
  ) {
    if (fields[2].innerHTML === "x") {
      alert("Вы победили!");
      document.getElementById("player").innerHTML = ++player;
    } else {
      alert("ИИ победил!");
      document.getElementById("ai").innerHTML = ++ai;
    }
    nonFreeFields = 0;
  } else if (nonFreeFields === 9) {
    alert("Победила дружба!");
    nonFreeFields = 0;
    if (!nonFreeFields) {
      return;
    }
  }
}

load();
