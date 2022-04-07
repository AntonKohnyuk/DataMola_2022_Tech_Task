function makeCalendar(element, date) {
  let theDate = new Date(Date.parse(date));
  let lastDayOfMonth = new Date(
    theDate.getFullYear(),
    theDate.getMonth() + 1,
    0
  ).getDate();
  let theDayOfWeekOfLastDay = new Date(
    theDate.getFullYear(),
    theDate.getMonth(),
    lastDayOfMonth
  ).getDay(); // день недели последнего дня месяца
  let dayOfWeekOfFirst = new Date(
    theDate.getFullYear(),
    theDate.getMonth(),
    1
  ).getDay(); // день недели первого дня месяца

  let headOfCalendar = `<table id="calendar">
  <thead class="head">
      <tr class="head">
          <td colspan="4" class="head" id="month"></td>
          <td colspan="3" class="head" id="year"></td>
      </tr>
      <tr>
          <td>Пн</td>
          <td>Вт</td>
          <td>Ср</td>
          <td>Чт</td>
          <td>Пт</td>
          <td>Сб</td>
          <td>Вс</td>
      </tr>
  </thead><tbody id="mainPart"><tr>`;
  document.getElementById(element).innerHTML = headOfCalendar;
  let calendar = "";
  let month = [
    "Январь",
    "Февраль",
    "Март",
    "Апрель",
    "Май",
    "Июнь",
    "Июль",
    "Август",
    "Сентябрь",
    "Октябрь",
    "Ноябрь",
    "Декабрь",
  ];

  if (dayOfWeekOfFirst != 0) {
    for (let i = 1; i < dayOfWeekOfFirst; i++) calendar += "<td>";
  } else {
    for (let i = 0; i < 6; i++) calendar += "<td>";
  }

  // дни месяца
  for (let i = 1; i <= lastDayOfMonth; i++) {
    if (i != theDate.getDate()) {
      calendar += `<td class="body">` + i + `</td>`;
    } else {
      calendar += '<td id="thatday">' + i + `</td>`;
    }
    if (new Date(theDate.getFullYear(), theDate.getMonth(), i).getDay() == 0) {
      calendar += "</tr><tr>";
    }
  }

  if (theDayOfWeekOfLastDay != 0) {
    for (let i = theDayOfWeekOfLastDay; i < 7; i++) calendar += "<td>";
  }

  document.getElementById("mainPart").innerHTML = calendar;
  document.getElementById("year").innerHTML = theDate.getFullYear();
  document.getElementById("month").innerHTML = month[theDate.getMonth()];
}
makeCalendar("here", prompt("Установите дату", "1970 01 01"));
