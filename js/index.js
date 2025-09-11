// Audio Context for sound effects
let audioContext;

// Initialize audio context
function initAudio() {
  if (!audioContext) {
    audioContext = new (window.AudioContext || window.webkitAudioContext)();
  }
}

// Sound effect functions
function playSound(frequency, duration, type = "sine", volume = 0.3) {
  initAudio();
  const oscillator = audioContext.createOscillator();
  const gainNode = audioContext.createGain();

  oscillator.connect(gainNode);
  gainNode.connect(audioContext.destination);

  oscillator.frequency.setValueAtTime(frequency, audioContext.currentTime);
  oscillator.type = type;

  gainNode.gain.setValueAtTime(0, audioContext.currentTime);
  gainNode.gain.linearRampToValueAtTime(
    volume,
    audioContext.currentTime + 0.01
  );
  gainNode.gain.exponentialRampToValueAtTime(
    0.001,
    audioContext.currentTime + duration
  );

  oscillator.start(audioContext.currentTime);
  oscillator.stop(audioContext.currentTime + duration);
}

function playButtonClick() {
  playSound(800, 0.1, "square", 0.2);
}

function playCorrectAnswer() {
  // Play a rising chord
  setTimeout(() => playSound(523, 0.3, "sine", 0.3), 0); // C
  setTimeout(() => playSound(659, 0.3, "sine", 0.3), 100); // E
  setTimeout(() => playSound(784, 0.4, "sine", 0.3), 200); // G
}

function playIncorrectAnswer() {
  // Play a descending sound
  playSound(400, 0.2, "triangle", 0.3);
  setTimeout(() => playSound(300, 0.3, "triangle", 0.3), 100);
}

function playVictorySound() {
  // Play a victory fanfare
  const melody = [523, 659, 784, 1047, 1047, 1047];
  melody.forEach((freq, index) => {
    setTimeout(() => playSound(freq, 0.3, "sine", 0.3), index * 150);
  });
}

function playTimerTick() {
  playSound(1000, 0.05, "square", 0.1);
}

// Game state
let gameState = {
  teamName: "",
  currentRiddle: 1,
  riddlesSolved: 0,
  startTime: null,
  endTime: null,
  timerInterval: null,
};

const noOfRiddles = 6;
let timesHintTaken = 0;
const penaltyPerHint = 5; // seconds

// Correct answers for each riddle
const answers = {
  1: "caretaker",
  2: "keyboard",
  3: ["footstep", "footsteps", "foot step", "foot steps"],
  4: "clock",
  5: "detective",
  6: 550,
};

// Start the game
function startGame() {
  playButtonClick();
  const teamNameInput = document.getElementById("teamNameInput");
  const teamName = teamNameInput.value.trim();

  if (!teamName) {
    playIncorrectAnswer();
    alert("Please enter a team name!");
    return;
  }

  gameState.teamName = teamName;
  gameState.startTime = new Date();

  // Hide team input section and show game section
  document.getElementById("teamInputSection").style.display = "none";
  document.getElementById("gameSection").style.display = "block";
  document.getElementById("progressBar").style.display = "block";
  document.getElementById("timer").style.display = "block";

  // Show first riddle
  showRiddle(1);

  // Start timer
  startTimer();

  // Update progress
  updateProgress();
}

// Show specific riddle
function showRiddle(riddleNumber) {
  // Hide all riddles
  for (let i = 1; i <= noOfRiddles; i++) {
    document.getElementById(`riddle${i}`).classList.remove("active");
    console.log("Hid riddle", i);
  }

  // Show current riddle
  document.getElementById(`riddle${riddleNumber}`).classList.add("active");
  gameState.currentRiddle = riddleNumber;
}

// Start timer
function startTimer() {
  gameState.timerInterval = setInterval(updateTimer, 1000);
}

// Update timer display
function updateTimer() {
  if (!gameState.startTime) return;

  const currentTime = new Date();
  const elapsed = Math.floor((currentTime - gameState.startTime) / 1000);

  const minutes = Math.floor(elapsed / 60);
  const seconds = elapsed % 60;

  const timeString = `${minutes.toString().padStart(2, "0")}:${seconds
    .toString()
    .padStart(2, "0")}`;
  document.getElementById("timer").textContent = `Time: ${timeString}`;
}

// Update progress bar
function updateProgress() {
  const progress = (gameState.riddlesSolved / noOfRiddles) * 100;
  document.getElementById("progressFill").style.width = `${progress}%`;
}

function reveal(riddleNumber) {
  const hintElement = document.getElementById(`hint-${riddleNumber}`);
  if (hintElement.style.display === "none") {
    hintElement.style.display = "block";
    timesHintTaken += 1;
    // Add 5 seconds penalty
    if (gameState.startTime) {
      gameState.startTime = new Date(gameState.startTime.getTime() - 5000);
    }
    console.log("Hint revealed for riddle", riddleNumber);
    console.log(
      "Penalty time added:",
      timesHintTaken * penaltyPerHint,
      "seconds"
    );
    console.log("Total hints taken:", timesHintTaken);
  }
}

// Check answer for specific riddle
function checkAnswer(riddleNumber) {
  playButtonClick();
  const answerInput = document.getElementById(`answer${riddleNumber}`);
  const feedback = document.getElementById(`feedback${riddleNumber}`);
  const userAnswer = answerInput.value.trim();

  if (!userAnswer) {
    playIncorrectAnswer();
    showFeedback(feedback, "Please enter an answer!", false);
    return;
  }

  let isCorrect = false;

  // Check answer based on riddle number
  if (riddleNumber === 1) {
    isCorrect = userAnswer.toLowerCase().trim() === answers[1];
  } else if (riddleNumber === 2) {
    isCorrect = userAnswer.toLowerCase().trim() === answers[2];
  } else if (riddleNumber === 3) {
    const lowerAnswer = userAnswer.toLowerCase().trim();
    isCorrect = answers[3].some((correctAnswer) =>
      lowerAnswer.includes(correctAnswer.toLowerCase())
    );
  } else if (riddleNumber === 4) {
    isCorrect = userAnswer.toLowerCase().trim() === answers[4];
  } else if (riddleNumber === 5) {
    isCorrect = userAnswer.toLowerCase().trim() === answers[5];
  } else if (riddleNumber === 6) {
    const numericAnswer = parseInt(userAnswer.trim(), 10);
    isCorrect = numericAnswer === answers[6];
  }

  if (isCorrect) {
    playCorrectAnswer();
    showFeedback(feedback, "✅ Correct! Well done!", true);
    gameState.riddlesSolved++;
    updateProgress();

    // Disable input and button
    answerInput.disabled = true;
    answerInput.nextElementSibling.disabled = true;

    // Move to next riddle or finish game
    setTimeout(() => {
      if (riddleNumber < noOfRiddles) {
        showRiddle(riddleNumber + 1);
      } else {
        finishGame();
      }
    }, 1500);
  } else {
    playIncorrectAnswer();
    showFeedback(feedback, "❌ Incorrect. Try again!", false);

    // Clear input for retry
    setTimeout(() => {
      answerInput.focus();
    }, 7000);
  }
}

// Show feedback message
function showFeedback(feedbackElement, message, isCorrect) {
  feedbackElement.textContent = message;
  feedbackElement.className = `feedback ${isCorrect ? "correct" : "incorrect"}`;
  feedbackElement.style.display = "block";
}

// Finish the game
function finishGame() {
  playVictorySound();
  gameState.endTime = new Date();
  clearInterval(gameState.timerInterval);

  // Calculate final time
  const totalSeconds = Math.floor(
    (gameState.endTime - gameState.startTime) / 1000
  );
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  const finalTimeString = `${minutes.toString().padStart(2, "0")}:${seconds
    .toString()
    .padStart(2, "0")}`;

  // Submit score to leaderboard
  submitScore(gameState.teamName, totalSeconds, gameState.riddlesSolved);

  // Update victory section
  document.getElementById("finalTeamName").textContent = gameState.teamName;
  document.getElementById("finalTeamName2").textContent = gameState.teamName;
  document.getElementById("finalTime").textContent = finalTimeString;
  document.getElementById("noHintsTaken").textContent = timesHintTaken;
  document.getElementById("penaltyTimeAdded").textContent =
    timesHintTaken * penaltyPerHint + " seconds";

  // Hide game section and show victory section
  document.getElementById("gameSection").style.display = "none";
  document.getElementById("victorySection").style.display = "block";
  document.getElementById("timer").style.display = "none";
}

// Submit score to backend
async function submitScore(teamName, completionTime, riddlesSolved) {
  try {
    const response = await fetch("/api/teams", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        teamName,
        completionTime,
        riddlesSolved,
      }),
    });

    if (!response.ok) {
      console.error("Failed to submit score");
    }
  } catch (error) {
    console.error("Error submitting score:", error);
  }
}

// Reset game
function resetGame() {
  playButtonClick();

  // Reset game state
  gameState = {
    teamName: "",
    currentRiddle: 1,
    riddlesSolved: 0,
    startTime: null,
    endTime: null,
    timerInterval: null,
  };

  // Reset UI
  document.getElementById("teamNameInput").value = "";
  document.getElementById("victorySection").style.display = "none";
  document.getElementById("teamInputSection").style.display = "block";
  document.getElementById("timer").style.display = "none";
  document.getElementById("progressFill").style.width = "0%";

  // Reset all riddle inputs and feedback
  for (let i = 1; i <= noOfRiddles; i++) {
    const answerInput = document.getElementById(`answer${i}`);
    const feedback = document.getElementById(`feedback${i}`);
    const submitBtn = answerInput.nextElementSibling;

    answerInput.value = "";
    answerInput.disabled = false;
    submitBtn.disabled = false;
    feedback.style.display = "none";

    document.getElementById(`riddle${i}`).classList.remove("active");
  }

  // Clear timer interval if exists
  if (gameState.timerInterval) {
    clearInterval(gameState.timerInterval);
  }
}

// Add enter key support for inputs
document.addEventListener("DOMContentLoaded", function () {
  // Team name input
  document
    .getElementById("teamNameInput")
    .addEventListener("keypress", function (e) {
      if (e.key === "Enter") {
        startGame();
      }
    });

  // Answer inputs
  for (let i = 1; i <= noOfRiddles; i++) {
    document
      .getElementById(`answer${i}`)
      .addEventListener("keypress", function (e) {
        if (e.key === "Enter") {
          checkAnswer(i);
        }
      });
    console.log("Added enter key support for answer", i);
  }
});
