const wordEl = document.getElementById("word");
const wrongLettersEl = document.getElementById("wrong-letters");
const playAgainBtn = document.getElementById("play-button");
const popup = document.getElementById("popup-container");
const notification = document.getElementById("notification-container");
const finalMessage = document.getElementById("final-message");
const figureParts = document.querySelectorAll(".figure-part");
const languageChanged = document.getElementById("language-message");

let selectedWord;
let gameLost = false;

// original project was with hardcoded words
// refactored it to fetch random words via API
async function getWords() {
  const res = await fetch("https://random-word-api.herokuapp.com/word");
  const [word] = await res.json();
  selectedWord = word;
}

const correctLetters = [];
const wrongLetters = [];

// show hidden word
function displayWord() {
  wordEl.innerHTML = `
  ${selectedWord
    .split("") // splitting into an array
    .map(
      // mapping through the array
      (letter) =>
        `<span class="letter">${
          // seeing if that letter is including in the array
          correctLetters.includes(letter) ? letter : "" // if yes, then output the letter and if not give empty string
        }</span>`
    ) // turning it back to a string
    .join("")} 
  `;
  const innerWord = wordEl.innerText.replace(/\n/g, ""); // replacing or removing any line breaks

  if (innerWord === selectedWord) {
    finalMessage.innerText = "Congratulations! You won! 🥳";
    popup.style.display = "flex";
  }
}

// show notification
function showNotification() {
  notification.classList.add("show");

  setTimeout(() => {
    notification.classList.remove("show");
  }, 2000);
}

// update the wrong letters
function updateWrongLettersEl() {
  // display wrong letters
  wrongLettersEl.innerHTML = `
    ${wrongLetters.length > 0 ? "<p>Wrong Letters:</p>" : ""}
    ${wrongLetters.map((letter) => `<span>${letter}</span>`)}
  `;

  // display parts of hangman
  figureParts.forEach((part, index) => {
    const errors = wrongLetters.length;

    if (index < errors) {
      part.style.display = "block";
    } else {
      part.style.display = "none";
    }
  });

  // Check if LOST
  if (wrongLetters.length === figureParts.length) {
    finalMessage.innerText = `Unfortunately, you lost! 😩
    The correct word was: ${selectedWord}`;

    // if lost, user cannot type anymore
    gameLost = true;

    popup.style.display = "flex";
  }
}

// eventListeners

// Keydown letter press
window.addEventListener("keydown", (e) => {
  if (gameLost) {
    return;
  }
  if (e.keyCode >= 65 && e.keyCode <= 90) {
    const letter = e.key;
    if (selectedWord.includes(letter)) {
      if (!correctLetters.includes(letter)) {
        correctLetters.push(letter);
        displayWord();
      } else {
        showNotification();
      }
    } else {
      if (!wrongLetters.includes(letter)) {
        wrongLetters.push(letter);

        updateWrongLettersEl();
      } else {
        showNotification();
      }
    }
  }
});

getWords();

// Restart Game
playAgainBtn.addEventListener("click", async () => {
  // Empty arrays
  correctLetters.splice(0);
  wrongLetters.splice(0);

  await getWords();

  updateWrongLettersEl();
  popup.style.display = "none";

  displayWord();
  gameLost = false;
});
