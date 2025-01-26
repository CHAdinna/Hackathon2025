// Get DOM elements
const clockIcon = document.getElementById('clock-icon');
const pomodoroPopup = document.getElementById('pomodoro-popup');
const closePopup = document.getElementById('close-popup');
const startPomodoro = document.getElementById('start-pomodoro');
const pomodoroTimeDisplay = document.getElementById('pomodoro-time');

// Timer Settings
const timer = {
  pomodoro: 25 * 60, // 25 minutes in seconds
  shortBreak: 5 * 60, // 5 minutes in seconds
  longBreak: 15 * 60, // 15 minutes in seconds
  longBreakInterval: 4,
  sessions: 0,
};

let interval;
let isPomodoroActive = false;

// Open the Pomodoro Timer Popup when clicking the clock icon
clockIcon.addEventListener('click', function() {
  pomodoroPopup.style.display = 'block';
  startPomodoro.textContent = 'Start';
  pomodoroTimeDisplay.textContent = formatTime(timer.pomodoro);
});

// Close the Pomodoro Timer Popup when clicking the close button
closePopup.addEventListener('click', function() {
  pomodoroPopup.style.display = 'none';
  clearInterval(interval);
  isPomodoroActive = false;
});

// Format time as MM:SS
function formatTime(seconds) {
  const minutes = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
}

// Update the timer display
function updateTimerDisplay() {
  pomodoroTimeDisplay.textContent = formatTime(timer.pomodoro);
}

// Start Pomodoro Timer
startPomodoro.addEventListener('click', function() {
  if (!isPomodoroActive) {
    isPomodoroActive = true;
    startPomodoro.textContent = 'Stop';

    interval = setInterval(function() {
      timer.pomodoro--; // Decrease timer by one second
      updateTimerDisplay();

      // Check for session change (end of work session, short break, or long break)
      if (timer.pomodoro <= 0) {
        clearInterval(interval);

        // Check if it's time for a long break or short break
        if (timer.sessions % timer.longBreakInterval === 0) {
          timer.pomodoro = timer.longBreak;
          speakTime('Long break! Relax for 15 minutes.');
        } else {
          timer.pomodoro = timer.shortBreak;
          speakTime('Short break! Relax for 5 minutes.');
        }

        // Increment the session count
        timer.sessions++;

        updateTimerDisplay();
        startPomodoro.textContent = 'Start'; // Reset the button text
        isPomodoroActive = false;
      }

    }, 1000);
  } else {
    clearInterval(interval);
    isPomodoroActive = false;
    startPomodoro.textContent = 'Start'; // Reset the button text
  }
});

// Speak time for session transition
function speakTime(message) {
  // Check if SpeechSynthesis is supported by the browser
  if ('speechSynthesis' in window) {
    const utterance = new SpeechSynthesisUtterance(message);
    utterance.lang = 'en-US';
    speechSynthesis.speak(utterance);
  }
}

// Initialize the timer display
updateTimerDisplay();
