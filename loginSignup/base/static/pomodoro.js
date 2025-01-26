// 1. DEFINE HTML ELEMENT REFERENCES
const taskInput = document.getElementById("new-task");
const addTaskButton = document.getElementById("add-task");
const taskList = document.getElementById("task-list");
const tabs = document.querySelectorAll(".tab");
const pages = document.querySelectorAll(".page");

// Pomodoro Timer Elements
const timerDisplay = document.getElementById("timer-display");
const startButton = document.getElementById("start-timer");
const pauseButton = document.getElementById("pause-timer");
const resetButton = document.getElementById("reset-timer");

// Store timeout IDs for each task to handle delayed clearing
const taskTimers = {};

// Pomodoro Timer Variables
let workDuration = 25 * 60; // 25 minutes
let shortBreakDuration = 5 * 60; // 5 minutes
let longBreakDuration = 30 * 60; // 30 minutes
let remainingTime = workDuration; // Time left in the current session
let isRunning = false; // Timer running state
let isBreak = false; // Current session type: Work or Break
let sessionCount = 0; // Number of completed work sessions
let timerInterval; // Reference to the interval

// 2. TAB NAVIGATION LOGIC
function switchTab(tab) {
  tabs.forEach((t) => t.classList.remove("active"));
  pages.forEach((p) => p.classList.remove("active"));

  tab.classList.add("active");
  const pageId = tab.getAttribute("data-page");
  document.getElementById(pageId).classList.add("active");
}

// Add event listeners to tabs
tabs.forEach((tab) => {
  tab.addEventListener("click", () => switchTab(tab));
});

// 3. TASK LIST FUNCTIONALITY
function addTask() {
  const taskText = taskInput.value.trim();
  if (!taskText) return;

  const taskItem = document.createElement("li");
  taskItem.textContent = taskText;
  taskItem.addEventListener("click", () => toggleComplete(taskItem));

  taskList.appendChild(taskItem);
  saveTask(taskText);
  taskInput.value = "";
}

addTaskButton.addEventListener("click", addTask);

function saveTask(task) {
  chrome.storage.sync.get(["tasks"], (result) => {
    const tasks = result.tasks || [];
    tasks.push({ text: task, completed: false });
    chrome.storage.sync.set({ tasks });
  });
}

function loadTasks() {
  chrome.storage.sync.get(["tasks"], (result) => {
    const tasks = result.tasks || [];
    tasks.forEach((task) => {
      const taskItem = document.createElement("li");
      taskItem.textContent = task.text;
      if (task.completed) taskItem.classList.add("completed");

      taskItem.addEventListener("click", () => toggleComplete(taskItem));
      taskList.appendChild(taskItem);
    });
  });
}

document.addEventListener("DOMContentLoaded", loadTasks);

function toggleComplete(taskItem) {
  const taskText = taskItem.textContent;
  taskItem.classList.toggle("completed");

  if (taskItem.classList.contains("completed")) {
    taskTimers[taskText] = setTimeout(() => {
      clearTask(taskItem);
    }, 3000);
  } else if (taskTimers[taskText]) {
    clearTimeout(taskTimers[taskText]);
    delete taskTimers[taskText];
  }

  updateTaskCompletion(taskText, taskItem.classList.contains("completed"));
}

function updateTaskCompletion(taskText, isCompleted) {
  chrome.storage.sync.get(["tasks"], (result) => {
    const tasks = result.tasks || [];
    tasks.forEach((task) => {
      if (task.text === taskText) task.completed = isCompleted;
    });
    chrome.storage.sync.set({ tasks });
  });
}

function clearTask(taskItem) {
  const taskText = taskItem.textContent;

  chrome.storage.sync.get(["tasks"], (result) => {
    const tasks = result.tasks || [];
    const updatedTasks = tasks.filter((task) => task.text !== taskText);
    chrome.storage.sync.set({ tasks: updatedTasks }, () => {
      taskList.removeChild(taskItem);
      delete taskTimers[taskText];
    });
  });
}

// 4. POMODORO TIMER FUNCTIONALITY
function formatTime(seconds) {
  const minutes = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${minutes.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
}

function updateTimerDisplay() {
  timerDisplay.textContent = formatTime(remainingTime);
}

function startTimer() {
  if (isRunning) return;
  isRunning = true;

  timerInterval = setInterval(() => {
    if (remainingTime > 0) {
      remainingTime--;
      updateTimerDisplay();
    } else {
      clearInterval(timerInterval);
      isRunning = false;
      handleSessionEnd();
    }
  }, 1000);
}

function pauseTimer() {
  if (!isRunning) return;
  clearInterval(timerInterval);
  isRunning = false;
}

function resetTimer() {
  clearInterval(timerInterval);
  isRunning = false;
  remainingTime = isBreak ? (sessionCount === 4 ? longBreakDuration : shortBreakDuration) : workDuration;
  updateTimerDisplay();
}

function handleSessionEnd() {
  if (!isBreak) {
    sessionCount++;
    if (sessionCount % 4 === 0) {
      remainingTime = longBreakDuration;
      alert("Long Break! Relax for 30 minutes.");
    } else {
      remainingTime = shortBreakDuration;
      alert("Short Break! Take 5 minutes.");
    }
    isBreak = true;
  } else {
    if (sessionCount === 4) sessionCount = 0;
    remainingTime = workDuration;
    alert("Back to Work! Focus for 25 minutes.");
    isBreak = false;
  }
  updateTimerDisplay();
  startTimer();
}

// Attach event listeners
startButton.addEventListener("click", startTimer);
pauseButton.addEventListener("click", pauseTimer);
resetButton.addEventListener("click", resetTimer);

// Initialize timer display
updateTimerDisplay();