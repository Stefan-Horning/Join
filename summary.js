const monthNames = [
  "Januar",
  "Februar",
  "März",
  "April",
  "Mai",
  "Juni",
  "Juli",
  "August",
  "September",
  "Oktober",
  "November",
  "Dezember",
];


async function init() {
  await load();
  renderUserProfile();
  renderSummaryCards();
  countTaskStatuses();
  renderGreetingMessage();
  changeGreetingName();
  setDate();
  renderUserProfileHead();
}

function countTaskStatuses() {
  let totalCount = allTasks.length;
  let todoCount = 0;
  let progressCount = 0;
  let feedbackCount = 0;
  let doneCount = 0;
  let urgentCount = 0;

  for (let i = 0; i < allTasks.length; i++) {
    const task = allTasks[i];

    switch (task.status) {
      case "todo":
        todoCount++;
        break;
      case "progress":
        progressCount++;
        break;
      case "feedback":
        feedbackCount++;
        break;
      case "done":
        doneCount++;
        break;
    }

    if (task.priority === "urgent") {
      urgentCount++;
    }
  }
  renderSummaryCards(
    totalCount,
    todoCount,
    progressCount,
    feedbackCount,
    doneCount,
    urgentCount
  );
  load();
}

function renderSummaryCards(
  totalCount,
  todoCount,
  progressCount,
  feedbackCount,
  doneCount,
  urgentCount
) {
  let contentSummary = document.getElementById("content-summary");
  contentSummary.innerHTML = renderSummaryCardsHTML(totalCount,todoCount,progressCount,feedbackCount,doneCount,urgentCount);
}

function renderGreetingMessage() {
  let message = getGreeting();
  if (message) {
    document.getElementById("greeting-message").innerHTML = message;
    document.getElementById("greeting-user").innerHTML = "";
  } else {
    document.getElementById("greeting-message").innerHTML = message + ",";
    document.getElementById("greeting-user").innerHTML = user;
  }
  mobileGreet();
}

function getGreeting() {
  let time = new Date();
  time = time.getHours();

  if (time >= 6 && time < 12) {
    return "Good morning,";
  }
  if (time >= 12 && time < 18) {
    return "Good afternoon,";
  }
  if ((time >= 18 && time < 24) || (time >= 0 && time < 6)) {
    return "Good evening,";
  }
}

async function setDate() {
  await load();
  let urgentTasks = allTasks.filter((t) => t.priority === "urgent" && t.date);
  let sortedUrgentTasks = urgentTasks
    .map((t) => new Date(t.date))
    .filter((d) => !isNaN(d.getTime()))
    .sort((a, b) => a.getTime() - b.getTime());

  if (sortedUrgentTasks.length === 0) {
    return;
  }

  let closestDate = sortedUrgentTasks.reduce((a, b) =>
    Math.abs(b - new Date()) < Math.abs(a - new Date()) ? b : a
  );
  let closestDateString = closestDate.toLocaleString("default", {
    month: "long",
    day: "2-digit",
    year: "numeric",
  });

  document.getElementById("date").innerHTML = `${closestDateString}`;
}

function changeGreetingName() {
  let cookieValue = document.cookie;
  let nameFromCookie = cookieValue
    .split(";")
    .find((cookie) => cookie.includes("users="));

  showsGreetingName(nameFromCookie);
}

function showsGreetingName(nameFromCookie) {
  if (nameFromCookie === undefined) {
    document.getElementById("greeting-user").innerHTML = "Guest";
    //      document.getElementById('overlay').innerHTML = 'Guest';
  } else {
    let nameCookieFormatted = nameFromCookie.split("=")[1];
    const selectedUser = users.find(
      (user) => user.name.toLowerCase().replace(" ", "") === nameCookieFormatted
    );

    document.getElementById("greeting-user").innerHTML = selectedUser.name;
    //    document.getElementById('overlay').innerHTML = selectedUser.name;
  }
}

function linkToBoard() {
  window.location.href = "board.html";
}

function mobileGreet() {
  if (window.innerWidth < 768) {
    let overlayContainer = document.getElementById("overlayContainer");
    let mainContainer = document.getElementsByClassName("main")[0];
    if (document.referrer.includes('index.html')) {
      overlayContainer.classList.remove("d-none");
      overlayContainer.classList.add("overlayContainer");
      mainContainer.classList.add("d-none");
      greetText();
      setTimeout(function () {
        overlayContainer.classList.add("d-none");
        mainContainer.classList.remove("d-none");
      }, 2500);
    }
  }
}

function greetText() {
  let user = renderOverlayProfile();
  let message = getGreeting();
  if (message) {
    document.getElementById("overlay").innerHTML = message;
    document.getElementById("overlayUser").innerHTML = "";
  } else {
    document.getElementById("overlay").innerHTML = message + ",";
    document.getElementById("overlayUser").innerHTML = user;
  }
}
